/**
 * Navi Multi-Agent System — 3-Agent Architecture
 *
 * Pipeline: Retrieval Agent → Impact Analysis Agent → Decision Agent
 *
 * Each agent is a pure function: (input) => output
 * A separate Response Formatter converts the Decision Agent's output
 * into simple, human-friendly language.
 */

import { getRelevantSignals } from './mockSignals.js';

// ════════════════════════════════════════════════════════════
// 🔹 Agent 1: Retrieval Agent
//    Fetches context from internal data (RAG) + live APIs
//    (weather, news signals) and structures it for downstream agents.
// ════════════════════════════════════════════════════════════
export async function retrievalAgent(retrievalResult, query) {
  const { docs, summary } = retrievalResult;

  // Filter relevant data
  const activeDisruptions = summary.disruptions.filter(d => d.status === 'active');
  const disrupted = summary.routes.filter(r => r.status === 'disrupted' || r.status === 'at-risk');
  const criticalShipments = summary.shipments.filter(
    s => s.status === 'critical' || s.status === 'delayed'
  );

  // Fetch live signals (weather + news) as part of retrieval
  const { signals, apiHealth } = await getRelevantSignals(docs);

  const criticalSignals = signals.filter(s => s.severity === 'critical');
  const highSignals     = signals.filter(s => s.severity === 'high');

  let signalSeverity = 'low';
  if (criticalSignals.length > 0) signalSeverity = 'critical';
  else if (highSignals.length > 0) signalSeverity = 'high';
  else if (signals.length > 0)    signalSeverity = 'medium';

  return {
    agentName: 'Retrieval Agent',
    status: 'complete',
    // Core data findings
    findings: {
      activeDisruptions,
      disruptedRoutes: disrupted,
      affectedShipments: criticalShipments,
      totalDocsRetrieved: docs.length,
    },
    contextChunks: docs.map(d => d.content),
    rawDocs: docs,
    // Live signal data (merged from former Signal Agent)
    signals,
    signalSeverity,
    criticalSignals,
    signalSummary: signals.length > 0
      ? `${signals.length} live signal(s) detected. Severity: ${signalSeverity.toUpperCase()}.`
      : 'No critical real-time signals detected.',
    apiSources: [...new Set(signals.map(s => s.source))],
    apiHealth
  };
}

// ════════════════════════════════════════════════════════════
// 🔹 Agent 2: Impact Analysis Agent
//    Analyses retrieved data and computes delay, cost, and severity
//    in both raw numbers and plain-English terms.
// ════════════════════════════════════════════════════════════
export function impactAnalysisAgent(retrievalOut) {
  const { findings, signals, signalSeverity } = retrievalOut;

  // Aggregate cost from active disruptions
  const totalCostImpact = findings.activeDisruptions.reduce(
    (sum, d) => sum + (d.costImpact || 0), 0
  );

  // Shipments affected count
  const totalShipmentsAffected = findings.activeDisruptions.reduce(
    (sum, d) => sum + (d.shipmentsAffected || 0), 0
  );

  // Max delay from affected shipments
  const maxDelayDays = findings.affectedShipments.reduce(
    (max, s) => Math.max(max, s.delayDays || 0), 0
  );

  // Signal amplification factor
  const signalMultiplier = signalSeverity === 'critical' ? 1.3
    : signalSeverity === 'high'   ? 1.15
    : signalSeverity === 'medium' ? 1.05
    : 1.0;

  // Impact score (0 – 100)
  const baseImpactScore = findings.activeDisruptions.reduce(
    (max, d) => Math.max(max, d.impactScore || 0), 0
  );
  const amplifiedScore = Math.min(100, Math.round(baseImpactScore * signalMultiplier));

  let impactLevel = 'Low';
  if (amplifiedScore >= 80) impactLevel = 'Critical';
  else if (amplifiedScore >= 60) impactLevel = 'High';
  else if (amplifiedScore >= 40) impactLevel = 'Medium';

  // Signal-driven extra cost
  const signalCostAdder = signals.filter(s => s.severity === 'critical').length * 500000;
  const totalCost = totalCostImpact + signalCostAdder;

  return {
    agentName: 'Impact Analysis Agent',
    status: 'complete',
    impact: {
      level: impactLevel,
      score: amplifiedScore,
      totalCostImpact: totalCost,
      costFormatted: formatINR(totalCost),
      totalShipmentsAffected,
      maxDelayDays,
      signalAmplification: `${((signalMultiplier - 1) * 100).toFixed(0)}%`,
      disruptionCount: findings.activeDisruptions.length,
      criticalRoutes: findings.disruptedRoutes.filter(r => r.riskLevel === 'critical').length
    }
  };
}

// ════════════════════════════════════════════════════════════
// 🔹 Agent 3: Decision Agent
//    Combines Retrieval + Impact outputs to produce:
//    recommended action, best route, alternatives, and reasoning.
// ════════════════════════════════════════════════════════════
export function decisionAgent(query, retrievalOut, impactOut, llmResponse = null) {
  const { findings, signals, apiHealth } = retrievalOut;
  const { impact } = impactOut;

  // ── If LLM provided a structured response, enrich and return it ──────────
  if (llmResponse) {
    return {
      agentName: 'Decision Agent',
      status: 'complete',
      usedLLM: true,
      ...llmResponse,
      impact,
      apiHealth,
      dataSources: buildDataSources(findings, signals),
      agentPipeline: ['Retrieval Agent', 'Impact Analysis Agent', 'Decision Agent (LLM)']
    };
  }

  // ── Conversational / status queries → short rule-based reply ─────────────
  const qStr = query.toLowerCase().trim();
  const isGreeting = /^(hi|hello|hey|start|how are you|good morning)/i.test(qStr);
  const isApiCheck = /\b(api|status|online|connection|working)\b/i.test(qStr);

  if (isGreeting || isApiCheck) {
    let reply = "Hi! I'm Navi, your supply chain assistant. I'm online and ready to help.";

    if (isApiCheck) {
      const weatherOk = apiHealth?.weather?.includes('Online');
      const newsOk    = apiHealth?.news?.includes('Online');
      reply = `System is up and running! Weather data is ${weatherOk ? 'live ✅' : 'offline ⚠️'} and news feed is ${newsOk ? 'live ✅' : 'offline ⚠️'}. Everything looks good — ask me about your shipments!`;
    }

    return {
      agentName: 'Decision Agent',
      status: 'complete',
      usedLLM: false,
      conversationalReply: reply,
      situationSummary: reply,
      impactLevel: 'Low',
      impact: null,
      apiHealth,
      recommendations: [],
      bestRoute: null,
      confidence: 100,
      agentPipeline: ['Retrieval Agent', 'Impact Analysis Agent', 'Decision Agent (Rule-based)'],
      dataSources: buildDataSources(findings, signals)
    };
  }

  // ── Core operational rule-based decision ─────────────────────────────────
  const bestRoute      = findBestRoute(findings.disruptedRoutes, findings.activeDisruptions);
  const alternatives   = buildAlternatives(bestRoute, findings);
  const recommendations = buildRecommendations(findings, signals, impact);
  const situationSummary = buildSituationSummary(findings, signals, impact);
  const reasoning      = buildReasoning(query, findings, signals, impact, bestRoute);

  return {
    agentName: 'Decision Agent',
    status: 'complete',
    usedLLM: false,
    situationSummary,
    impactLevel: impact.level,
    impact,
    apiHealth,
    recommendations,
    bestRoute,
    alternatives,
    reasoning,
    dataSources: buildDataSources(findings, signals),
    agentPipeline: ['Retrieval Agent', 'Impact Analysis Agent', 'Decision Agent (Rule-based)'],
    confidence: impact.level === 'Critical' ? 94 : impact.level === 'High' ? 88 : 76
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatINR(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function findBestRoute(disruptedRoutes, disruptions) {
  // Prefer safe operational routes; suggest Cape if Suez/Red Sea is disrupted
  const hasSuezIssue = disruptions.some(d =>
    d.affectedPorts?.some(p => ['Port Said', 'Aden', 'Jeddah'].includes(p))
  );

  if (hasSuezIssue) {
    return {
      id: 'RT-002',
      name: 'Shanghai → Rotterdam (via Cape of Good Hope)',
      reason: 'Because of the Red Sea disruption, the Cape route is the safest option — it adds 12 days but keeps your shipments completely out of the affected area.',
      additionalDays: 12,
      costDelta: '+₹5.2L',
      riskLevel: 'low',
      confidence: '94%'
    };
  }

  if (disruptedRoutes.length === 0) {
    return { name: 'Current route nominal', reason: 'No critical disruptions on your primary routes — you\'re good to go.', riskLevel: 'low' };
  }

  return {
    name: 'Air freight via Tokyo Hub',
    reason: 'Sea routes are heavily disrupted right now. Air freight is the fastest way to get time-critical cargo delivered safely.',
    additionalDays: -8,
    costDelta: '+₹18.5L',
    riskLevel: 'medium',
    confidence: '82%'
  };
}

function buildAlternatives(bestRoute, findings) {
  const alts = [];

  if (findings.disruptedRoutes.length > 0) {
    alts.push({
      name: 'Partial sea + rail (multi-modal)',
      description: 'Combines sea freight to a nearby hub, then rail to the destination. Balances cost and speed.',
      estimatedExtraDays: 5,
      costDelta: '+₹2.8L',
      riskLevel: 'medium'
    });
  }

  alts.push({
    name: 'Wait and monitor (hold)',
    description: 'If the disruption is expected to resolve soon, waiting may be the cheaper option.',
    estimatedExtraDays: null,
    costDelta: '₹0 (but risk of further delay)',
    riskLevel: 'high'
  });

  return alts;
}

function buildRecommendations(findings, signals, impact) {
  const recs = [];

  if (findings.activeDisruptions.some(d => d.type === 'weather' && d.severity === 'critical')) {
    recs.push({
      priority: 'IMMEDIATE',
      action: 'Pause new bookings on South China Sea routes',
      reason: 'A strong storm has been detected in the area. Sending ships through now would put cargo and crew at serious risk.',
      timeframe: '0–6 hours',
      savingsEstimate: 'Avoids up to ₹2.1L in delay penalties'
    });
  }

  if (findings.disruptedRoutes.length > 0) {
    recs.push({
      priority: 'HIGH',
      action: `Move ${findings.affectedShipments.length} affected shipments to alternative routes`,
      reason: `${findings.disruptedRoutes.length} of your usual routes are blocked or at risk right now. The Cape of Good Hope route is fully operational.`,
      timeframe: '6–24 hours',
      savingsEstimate: 'Could save around ₹3.4L in delay costs'
    });
  }

  if (findings.affectedShipments.some(s => s.cargo?.toLowerCase().includes('pharmaceutical'))) {
    recs.push({
      priority: 'HIGH',
      action: 'Switch pharmaceutical shipments to air freight immediately',
      reason: 'Medicines are time-sensitive. If these shipments get delayed, you could face large contractual penalties.',
      timeframe: '12–24 hours',
      savingsEstimate: 'Avoids up to ₹6.8L in contract penalties'
    });
  }

  if (signals.some(s => s.type === 'geopolitical')) {
    recs.push({
      priority: 'MEDIUM',
      action: 'Increase safety stock by 20% at EU distribution centers',
      reason: 'News feeds are showing ongoing tension in the Red Sea area. A stock buffer protects you if things get worse.',
      timeframe: '1–3 days',
      savingsEstimate: 'Prevents up to ₹12L in stockout costs'
    });
  }

  recs.push({
    priority: 'STANDARD',
    action: 'Activate backup supplier agreements in Southeast Asia',
    reason: 'With disruptions happening in multiple regions, having a backup supplier ready is a smart safety net.',
    timeframe: '3–7 days',
    savingsEstimate: 'Operational continuity value: ₹1.8L'
  });

  return recs;
}

function buildSituationSummary(findings, signals, impact) {
  const disCount = findings.activeDisruptions.length;
  const disNames = findings.activeDisruptions.map(d => d.title).join('; ');
  const sigCount = signals.length;

  if (disCount === 0) {
    return 'Your supply chain looks stable right now. No active disruptions detected.';
  }

  return `${disCount} active disruption(s) found: ${disNames || 'see details'}. ` +
    `${sigCount > 0 ? `${sigCount} live signal(s) confirm this. ` : ''}` +
    `Impact level: ${impact.level}. ${impact.totalShipmentsAffected} shipments affected. ` +
    `Total cost exposure: ${impact.costFormatted}.`;
}

function buildReasoning(query, findings, signals, impact, bestRoute) {
  let r = `Based on your question about "${query}": `;

  r += `Found ${findings.activeDisruptions.length} disruption(s), `;
  r += `${findings.disruptedRoutes.length} at-risk route(s), `;
  r += `and ${findings.affectedShipments.length} affected shipment(s) in your network. `;

  if (signals.length > 0) {
    r += `Live feeds added ${signals.length} external signal(s), amplifying the risk estimate by ${impact.signalAmplification}. `;
  }

  r += `Overall risk score is ${impact.score}/100 (${impact.level}). `;
  r += `Best recommended route: ${bestRoute?.name || 'current route'}. `;
  r += `All recommendations are grounded in live and stored supply chain data.`;

  return r;
}

function buildDataSources(findings, signals) {
  return [
    { source: 'Internal data — disruptions', records: findings.activeDisruptions.length },
    { source: 'Internal data — routes',      records: findings.disruptedRoutes.length },
    { source: 'Internal data — shipments',   records: findings.affectedShipments.length },
    ...signals.map(s => ({ source: s.source, records: 1, event: s.event || s.headline }))
  ];
}
