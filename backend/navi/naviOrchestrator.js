/**
 * Navi Orchestrator — 3-Agent Pipeline
 *
 * Flow:
 *   User Input
 *   → Retrieval Agent   (RAG + live weather/news signals)
 *   → Impact Analysis Agent  (delay / cost / severity)
 *   → Decision Agent    (route + recommended actions + reasoning)
 *   → Response Formatter (friendly, human-readable output)
 *
 * Optionally calls OpenAI LLM (gpt-4o-mini) if OPENAI_API_KEY is set.
 */

import { retrieve } from './ragPipeline.js';
import { retrievalAgent, impactAnalysisAgent, decisionAgent } from './agents.js';
import { formatResponse } from './responseFormatter.js';

// ── Autonomous Tool-Use Execution Agents (ReAct) ──────────────────────────────
const executionTools = [
  {
    type: 'function',
    function: {
      name: 'fetch_live_port_weather',
      description:
        'Gets live weather data for any city or port. Use when the user asks about specific weather conditions.',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: "City or port name, e.g. 'Singapore'" }
        },
        required: ['location']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'execute_logistics_calculation',
      description: 'Calculates the total financial impact of a logistics delay.',
      parameters: {
        type: 'object',
        properties: {
          daily_cost: { type: 'number', description: 'Cost per delayed day' },
          delay_days:  { type: 'number', description: 'Number of delayed days' },
          extra_fees:  { type: 'number', description: 'Any additional flat fees' }
        },
        required: ['daily_cost', 'delay_days']
      }
    }
  }
];

async function executeTool(name, argsObj) {
  if (name === 'fetch_live_port_weather') {
    const loc = argsObj.location;
    const key = process.env.WEATHER_API_KEY;
    if (!key || key.includes('your-')) return `Weather API key not configured for ${loc}.`;
    try {
      const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${loc}&aqi=no`);
      if (res.ok) {
        const data = await res.json();
        return `Live weather in ${loc}: ${data.current.condition.text}, winds at ${data.current.wind_mph}mph, visibility ${data.current.vis_miles}mi, temperature ${data.current.temp_c}°C.`;
      }
      return `Could not fetch weather data for ${loc}.`;
    } catch {
      return `Connection error when fetching weather for ${loc}.`;
    }
  }

  if (name === 'execute_logistics_calculation') {
    const total = (argsObj.daily_cost * argsObj.delay_days) + (argsObj.extra_fees || 0);
    return `Total logistics cost exposure: $${total.toLocaleString()}`;
  }

  return `Tool "${name}" not found.`;
}

// ── Optional LLM call (OpenAI) with Tool Loop ─────────────────────────────────
async function callLLM(query, ragContext, agentSummary) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const systemPrompt = `You are Navi, a friendly supply chain assistant. You help operations teams understand what is happening with their shipments and what to do next.

IMPORTANT RULES:
- Speak simply and conversationally — like a knowledgeable colleague, not a technical system.
- Avoid technical jargon (no "RAG", "TF-IDF", "API", "LLM", "vector" etc.).
- Lead with what's happening ("Here's what's happening..."), the impact ("This might cause a delay of..."), what to do ("I'd recommend..."), and the best option ("A better option would be...").
- Only use data from the retrieved context below. Do not invent information.
- If the user is just saying hello or asking for status, respond warmly and briefly.
- You have tools to fetch live weather and calculate costs — use them if needed.

Always respond in valid JSON with this exact structure:
{
  "conversationalReply": "string (for greetings/status only — leave empty for operational queries)",
  "situationSummary": "string — what is happening, in plain words",
  "impactLevel": "Critical|High|Medium|Low",
  "recommendations": [{ "priority": "IMMEDIATE|HIGH|MEDIUM|STANDARD", "action": "string", "reason": "string (plain language)", "timeframe": "string" }],
  "bestRoute": { "name": "string", "reason": "string (plain language)", "riskLevel": "low|medium|high" },
  "reasoning": "string — short plain explanation of why this recommendation was made"
}`;

  const userPrompt = `CONTEXT (your data sources):
${ragContext}

CURRENT SITUATION:
- Active disruptions: ${agentSummary.disruptionCount}
- Risk level: ${agentSummary.impactLevel} (score ${agentSummary.impactScore}/100)
- Shipments affected: ${agentSummary.shipmentsAffected}
- Cost exposure: ${agentSummary.costFormatted}
- Live signals: ${agentSummary.signalSummary}

USER QUESTION: "${query}"

Please give a friendly, clear answer with an actionable recommendation. Use your tools to fetch live weather or calculate costs if the question requires it.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user',   content: userPrompt }
  ];

  try {
    let iterations = 0;
    while (iterations < 4) {
      iterations++;

      const payload = {
        model: 'gpt-4o-mini',
        messages,
        tools: executionTools,
        tool_choice: 'auto',
        temperature: 0.2,
        response_format: { type: 'json_object' }
      };

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
        // Execute tools and feed results back to the LLM
        for (const toolCall of responseMessage.tool_calls) {
          try {
            const args = JSON.parse(toolCall.function.arguments || '{}');
            const output = await executeTool(toolCall.function.name, args);
            messages.push({ role: 'tool', tool_call_id: toolCall.id, content: output });
          } catch (toolErr) {
            console.error('Tool execution error:', toolErr);
            messages.push({ role: 'tool', tool_call_id: toolCall.id, content: `Error: ${toolErr.message}` });
          }
        }
        continue; // loop back for a fresh LLM pass with tool results
      }

      // Final response
      const content = responseMessage.content;
      if (!content) return null;
      try {
        return JSON.parse(content);
      } catch {
        return null;
      }
    }
    return null; // exhausted iterations
  } catch (err) {
    console.error('LLM error:', err);
    return null;
  }
}

// ── Main orchestration function ───────────────────────────────────────────────
export async function runNavi(query, dataStore) {
  const startTime = Date.now();
  const pipeline = [];

  // ── Step 1: RAG — retrieve relevant docs ────────────────────────────────
  pipeline.push({ agent: 'RAG Pipeline', status: 'running' });
  const ragResult = retrieve(query, dataStore);
  pipeline[0].status = 'complete';
  pipeline[0].retrieved = ragResult.docs.length;

  // ── Step 2: Retrieval Agent — structure context + fetch live signals ─────
  pipeline.push({ agent: 'Retrieval Agent', status: 'running' });
  const retrievalOut = await retrievalAgent(ragResult, query);
  pipeline[1].status = 'complete';
  pipeline[1].signalCount = retrievalOut.signals.length;

  // ── Step 3: Impact Analysis Agent — delay / cost / severity ─────────────
  pipeline.push({ agent: 'Impact Analysis Agent', status: 'running' });
  const impactOut = impactAnalysisAgent(retrievalOut);
  pipeline[2].status = 'complete';

  // ── Step 4: LLM call (optional, if OpenAI key is configured) ────────────
  pipeline.push({ agent: 'Decision Agent', status: 'running' });
  const agentSummary = {
    disruptionCount:     retrievalOut.findings.activeDisruptions.length,
    impactScore:         impactOut.impact.score,
    impactLevel:         impactOut.impact.level,
    shipmentsAffected:   impactOut.impact.totalShipmentsAffected,
    costFormatted:       impactOut.impact.costFormatted,
    signalSummary:       retrievalOut.signalSummary,
    apiHealth:           retrievalOut.apiHealth
  };

  const llmResponse = await callLLM(query, ragResult.context, agentSummary);

  // ── Step 5: Decision Agent — combine everything → structured decision ────
  const decision = decisionAgent(query, retrievalOut, impactOut, llmResponse);
  pipeline[3].status = 'complete';
  pipeline[3].usedLLM = !!llmResponse;

  // ── Step 6: Response Formatter — convert to friendly language ───────────
  pipeline.push({ agent: 'Response Formatter', status: 'running' });
  const formatted = formatResponse(decision);
  pipeline[4].status = 'complete';

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
    signals:       retrievalOut.signals,
    signalSeverity: retrievalOut.signalSeverity,
    apiHealth:     retrievalOut.apiHealth,
    ...formatted
  };
}
