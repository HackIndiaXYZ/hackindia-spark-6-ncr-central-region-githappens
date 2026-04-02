/**
 * Navi RAG Pipeline
 * Retrieves and scores relevant supply chain context for a given query.
 * Uses TF-IDF-inspired term frequency scoring — no external vector DB needed.
 */

// ── Tokenize & score ─────────────────────────────────────────────────────────
function tokenize(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function scoreRelevance(doc, queryTokens) {
  const docText = JSON.stringify(doc).toLowerCase();
  const docTokens = tokenize(docText);
  const freq = {};
  docTokens.forEach(t => { freq[t] = (freq[t] || 0) + 1; });

  let score = 0;
  const querySet = new Set(queryTokens);
  querySet.forEach(qt => {
    if (freq[qt]) score += Math.sqrt(freq[qt]); // TF weighting
  });

  // Boost high-severity / disrupted docs
  if (doc.severity === 'critical' || doc.status === 'critical' || doc.riskLevel === 'critical') score *= 1.8;
  if (doc.severity === 'high' || doc.riskLevel === 'high' || doc.status === 'disrupted') score *= 1.4;
  if (doc.status === 'active') score *= 1.2;

  return score;
}

// ── Build document chunks ──────────────────────────────────────────────────
function buildCorpus(disruptions, routes, shipments, suppliers) {
  const docs = [];

  disruptions.forEach(d => {
    const ports = (d.affectedPorts || []).join(', ') || 'N/A';
    docs.push({
      type: 'disruption', id: d.id,
      content: `Disruption ${d.id}: ${d.title}. ${d.description || d.message || ''} Region: ${d.region || 'Global'}. Severity: ${d.severity}. Affected ports: ${ports}. Estimated delay: ${d.estimatedDelay || 'Unknown'}. Ships affected: ${d.shipmentsAffected || 0}. Cost impact: ₹${((d.costImpact || 0) / 100000).toFixed(1)}L. Status: ${d.status || 'Active'}.`,
      raw: d
    });
  });

  routes.forEach(r => docs.push({
    type: 'route', id: r.id,
    content: `Route ${r.id}: ${r.name}. Transit: ${r.transitDays} days. Status: ${r.status}. Risk: ${r.riskLevel}. Current delay: ${r.currentDelay} days. Cost: $${r.cost.toLocaleString()}. Transport: ${r.transportType}.`,
    raw: r
  }));

  shipments.forEach(s => docs.push({
    type: 'shipment', id: s.id,
    content: `Shipment ${s.id}: ${s.origin} to ${s.destination}. Cargo: ${s.cargo}. Status: ${s.status}. Delay: ${s.delayDays} days. Value: ₹${(s.value / 100000).toFixed(1)}L. Carrier: ${s.carrier}. Supplier: ${s.supplier}.`,
    raw: s
  }));

  suppliers.forEach(s => docs.push({
    type: 'supplier', id: s.id || s.name,
    content: `Supplier ${s.name}: Region: ${s.region || 'Global'}. Reliability: ${s.reliabilityScore || 'N/A'}%.`,
    raw: s
  }));

  return docs;
}

// ── Main retrieval function ───────────────────────────────────────────────
export function retrieve(query, { disruptions, routes, shipments, suppliers }, topK = 6) {
  const queryTokens = tokenize(query);
  const corpus = buildCorpus(disruptions, routes, shipments, suppliers);

  const scored = corpus
    .map(doc => ({ ...doc, score: scoreRelevance(doc.raw, queryTokens) }))
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score)
  return {
    docs: scored,
    context: scored.map(d => d.content).join('\n\n'),
    summary: {
      disruptions: scored.filter(d => d.type === 'disruption').map(d => d.raw),
      routes: scored.filter(d => d.type === 'route').map(d => d.raw),
      shipments: scored.filter(d => d.type === 'shipment').map(d => d.raw),
    }
  };
}
