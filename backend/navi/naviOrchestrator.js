/**
 * Navi Orchestrator
 * Chains: RAG → Retrieval Agent → Signal Agent → Impact Agent → Decision Agent
 * Optionally calls OpenAI LLM if OPENAI_API_KEY is set.
 */

import { retrieve } from './ragPipeline.js';
import { retrievalAgent, signalAgent, impactAgent, decisionAgent } from './agents.js';

// ── Autonomous Tool-Use Execution Agents (ReAct) ──────────────────────────
const executionTools = [
  {
    type: "function",
    function: {
      name: "fetch_live_port_weather",
      description: "Gets exact live weather data for any given location, city, or port. Use this if the user asks for specific weather conditions anywhere globally.",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "The city or port name, e.g., 'Singapore', 'London'" }
        },
        required: ["location"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "execute_logistics_calculation",
      description: "Dynamically executes a calculation to quantify exact financial impact or delay cost.",
      parameters: {
        type: "object",
        properties: {
          daily_cost: { type: "number", description: "Cost incurred per day" },
          delay_days: { type: "number", description: "Total days delayed" },
          extra_fees: { type: "number", description: "Any additional flat fees" }
        },
        required: ["daily_cost", "delay_days"]
      }
    }
  }
];

async function executeTool(name, argsObj) {
  if (name === 'fetch_live_port_weather') {
    const loc = argsObj.location;
    const key = process.env.WEATHER_API_KEY;
    if (!key || key.includes('your-')) return `Error: WEATHER_API_KEY not configured.`;
    try {
      const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${loc}&aqi=no`);
      if (res.ok) {
        const data = await res.json();
        return `Current weather in ${loc}: ${data.current.condition.text}, Winds ${data.current.wind_mph}mph, Vis ${data.current.vis_miles}mi. Temp: ${data.current.temp_c}C`;
      }
      return `API Failed to fetch live weather for ${loc}`;
    } catch {
      return `Connection error fetching weather for ${loc}`;
    }
  }
  
  if (name === 'execute_logistics_calculation') {
    const total = (argsObj.daily_cost * argsObj.delay_days) + (argsObj.extra_fees || 0);
    return `Execution Agent successfully calculated: Total logistics exposure is $${total.toLocaleString()}`;
  }
  
  return `Tool ${name} not found.`;
}

// ── Optional LLM call (OpenAI) with Tool Loop ─────────────────────────────
async function callLLM(query, ragContext, agentSummary) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const systemPrompt = `You are Navi, an advanced supply chain decision intelligence system capable of real-world task execution.
You MUST base ALL responses strictly on the retrieved context below, OR on the live data returned by your assigned Execution Tools.
If the user specifically asks you to calculate something or check the weather, you MUST use your provided tools to execute the task before answering.
If the user's query is a simple greeting or asks about your system status, you MUST populate the "conversationalReply" field cleanly and set "situationSummary" to "Status OK".

Always respond in valid JSON with this exact structure:
{
  "conversationalReply": "string (only use for direct chat like hello/how are you/api checks, or direct answers to tool tasks like weather/calculations, else leave empty)",
  "situationSummary": "string",
  "impactLevel": "Critical|High|Medium|Low",
  "recommendations": [{ "priority": "IMMEDIATE|HIGH|MEDIUM|STANDARD", "action": "string", "reason": "string", "timeframe": "string" }],
  "bestRoute": { "name": "string", "reason": "string", "riskLevel": "low|medium|high" },
  "reasoning": "string (cite specific disruption IDs, tool execution results, or context)"
}`;

  const userPrompt = `RETRIEVED CONTEXT (RAG):
${ragContext}

AGENT PRE-ANALYSIS:
- Active disruptions: ${agentSummary.disruptionCount}
- Impact score: ${agentSummary.impactScore}/100 (${agentSummary.impactLevel})
- Affected shipments: ${agentSummary.shipmentsAffected}
- Live signals: ${agentSummary.signalSummary}
- API Health Status: Weather=${agentSummary.apiHealth.weather}, News=${agentSummary.apiHealth.news}

USER QUERY: "${query}"

Provide a grounded, actionable decision. Use your execution tools if the task requires fetching external weather or performing financial logic calculations.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  try {
    let iterations = 0;
    while (iterations < 4) {
      iterations++;
      
      const payload = {
        model: 'gpt-4o-mini',
        messages,
        tools: executionTools,
        tool_choice: "auto",
        temperature: 0.2
      };

      // We only enforce response_format json object on non-tool-calling passes?
      // Wait, OpenAI requires the model to output JSON if response_format is set.
      // And OpenAI models *can* output tool calls WHILE format is json_object,
      // but to be perfectly safe, we only enforce JSON schema on the final response phase,
      // or we just enable it globally and the LLM handles it natively.
      payload.response_format = { type: 'json_object' };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) return null;

      const data = await response.json();
      const responseMessage = data.choices[0].message;
      
      messages.push(responseMessage);

      if (responseMessage.tool_calls) {
        // Run specific Execution Tools!
        for (const toolCall of responseMessage.tool_calls) {
          const args = JSON.parse(toolCall.function.arguments || "{}");
          const executionOutput = await executeTool(toolCall.function.name, args);
          
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: executionOutput
          });
        }
        // Loop back to let LLM analyze the internal tool results
        continue;
      } else {
        // Final completion attained without pending tools
        const content = responseMessage.content;
        if (!content) return null;
        try {
          return JSON.parse(content);
        } catch {
          return null;
        }
      }
    }
    return null; // Loop exhausted
  } catch (err) {
    console.error("LLM Execution Error:", err);
    return null;
  }
}

// ── Main orchestration function ───────────────────────────────────────────
export async function runNavi(query, dataStore) {
  const startTime = Date.now();
  const pipeline = [];

  // ── Step 1: RAG Retrieval ───────────────────────────
  pipeline.push({ agent: 'RAG Pipeline', status: 'running' });
  const ragResult = retrieve(query, dataStore);
  pipeline[0].status = 'complete';
  pipeline[0].retrieved = ragResult.docs.length;

  // ── Step 2: Retrieval Agent ─────────────────────────
  pipeline.push({ agent: 'Retrieval Agent', status: 'running' });
  const retrievalOut = retrievalAgent(ragResult, query);
  pipeline[1].status = 'complete';

  // ── Step 3: Signal Agent ────────────────────────────
  pipeline.push({ agent: 'Signal Agent', status: 'running' });
  const signalOut = await signalAgent(retrievalOut);
  pipeline[2].status = 'complete';
  pipeline[2].signalCount = signalOut.signals.length;

  // ── Step 4: Impact Agent ────────────────────────────
  pipeline.push({ agent: 'Impact Agent', status: 'running' });
  const impactOut = impactAgent(retrievalOut, signalOut);
  pipeline[3].status = 'complete';

  // ── Step 5: LLM call (optional) ────────────────────
  pipeline.push({ agent: 'Decision Agent', status: 'running' });
  const agentSummary = {
    disruptionCount: retrievalOut.findings.activeDisruptions.length,
    impactScore: impactOut.impact.score,
    impactLevel: impactOut.impact.level,
    shipmentsAffected: impactOut.impact.totalShipmentsAffected,
    costFormatted: impactOut.impact.costFormatted,
    signalSummary: signalOut.summary,
    apiHealth: signalOut.apiHealth
  };

  const llmResponse = await callLLM(query, ragResult.context, agentSummary);

  // ── Step 6: Decision Agent ──────────────────────────
  const decision = decisionAgent(query, retrievalOut, signalOut, impactOut, llmResponse);
  pipeline[4].status = 'complete';
  pipeline[4].usedLLM = !!llmResponse;

  const elapsed = Date.now() - startTime;

  return {
    query,
    timestamp: new Date().toISOString(),
    processingMs: elapsed,
    pipeline,
    usedLLM: !!llmResponse,
    ragContext: {
      docsRetrieved: ragResult.docs.length,
      types: [...new Set(ragResult.docs.map(d => d.type))]
    },
    signals: signalOut.signals,
    signalSeverity: signalOut.signalSeverity,
    ...decision
  };
}
