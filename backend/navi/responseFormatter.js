/**
 * Navi Response Formatter
 * 
 * Converts the technical output from the Decision Agent into
 * simple, friendly, naturally conversational language.
 * 
 * Pipeline: Decision Agent → Response Formatter → Final Response
 */

// ── Severity helpers ─────────────────────────────────────────────────────────
function friendlyImpactLevel(level) {
  switch ((level || '').toLowerCase()) {
    case 'critical': return 'very serious';
    case 'high':     return 'significant';
    case 'medium':   return 'moderate';
    default:         return 'minor';
  }
}

function friendlyDelay(days) {
  if (!days || days === 0) return 'no delay expected';
  if (days === 1) return 'about 1 day';
  if (days < 4)  return `around ${days} days`;
  if (days < 8)  return `roughly ${days} days`;
  return `up to ${days} days`;
}

function friendlyCost(formatted) {
  if (!formatted || formatted === '₹0') return 'no extra cost';
  return formatted;
}

// ── Main formatter ────────────────────────────────────────────────────────────
export function formatResponse(decisionOut) {
  const {
    conversationalReply,
    situationSummary,
    impact,
    recommendations = [],
    bestRoute,
    reasoning,
    usedLLM,
    confidence
  } = decisionOut;

  // ── Conversational / greeting replies → pass through as-is ──────────────
  if (conversationalReply) {
    return {
      ...decisionOut,
      friendlyResponse: buildGreetingResponse(conversationalReply, decisionOut),
      formatterApplied: true
    };
  }

  // ── Build structured friendly blocks ─────────────────────────────────────
  const situation  = buildSituation(situationSummary, impact);
  const impactText = buildImpact(impact);
  const recommendation = buildRecommendation(recommendations, bestRoute);
  const bestOption = buildBestOption(bestRoute, impact);
  const why = buildWhy(reasoning, recommendations, usedLLM, confidence);

  const friendlyResponse = {
    situation,
    impact: impactText,
    recommendation,
    bestOption,
    why
  };

  return {
    ...decisionOut,
    friendlyResponse,
    formatterApplied: true
  };
}

// ── Situation block ───────────────────────────────────────────────────────────
function buildSituation(summary, impact) {
  if (!impact || !summary) {
    return "Here's what's happening — everything looks stable right now. No major disruptions detected.";
  }

  const level = friendlyImpactLevel(impact.level);
  const disCount = impact.disruptionCount || 0;
  const ships = impact.totalShipmentsAffected || 0;

  if (disCount === 0) {
    return "Here's what's happening — your supply chain looks stable at the moment. No active disruptions were found.";
  }

  const disruptionWord = disCount === 1 ? 'disruption' : 'disruptions';
  const shipWord = ships === 1 ? '1 shipment' : `${ships} shipments`;

  return `Here's what's happening — there ${disCount === 1 ? 'is' : 'are'} currently ${disCount} active ${disruptionWord} in your network. This is having a ${level} effect on your operations, with ${shipWord} currently affected.`;
}

// ── Impact block ──────────────────────────────────────────────────────────────
function buildImpact(impact) {
  if (!impact) return "No significant financial impact at this time.";

  const delay = friendlyDelay(impact.maxDelayDays);
  const cost  = friendlyCost(impact.costFormatted);

  let parts = [];

  if (impact.maxDelayDays > 0) {
    parts.push(`This might cause a delay of ${delay} on your most affected shipments`);
  }

  if (impact.totalCostImpact > 0) {
    parts.push(`The estimated financial exposure is around ${cost}`);
  }

  if (impact.criticalRoutes > 0) {
    const rWord = impact.criticalRoutes === 1 ? 'route is' : 'routes are';
    parts.push(`${impact.criticalRoutes} critical ${rWord} currently at risk`);
  }

  if (parts.length === 0) return "No significant delay or cost impact detected right now.";

  return parts.join('. ') + '.';
}

// ── Recommendation block ──────────────────────────────────────────────────────
function buildRecommendation(recommendations, bestRoute) {
  const topRec = recommendations.find(r => r.priority === 'IMMEDIATE') ||
                 recommendations.find(r => r.priority === 'HIGH') ||
                 recommendations[0];

  if (!topRec && !bestRoute) {
    return "I'd recommend keeping an eye on the situation — no immediate action needed right now.";
  }

  if (!topRec) {
    return `I'd recommend switching to ${bestRoute.name} to keep things moving smoothly.`;
  }

  const action = topRec.action.charAt(0).toLowerCase() + topRec.action.slice(1);
  let reply = `I'd recommend you ${action}`;

  if (topRec.timeframe) {
    reply += ` — ideally within ${topRec.timeframe}`;
  }

  return reply + '.';
}

// ── Best Option block ─────────────────────────────────────────────────────────
function buildBestOption(bestRoute, impact) {
  if (!bestRoute || bestRoute.name === 'Current route nominal') {
    return "Your current route looks good — no changes needed at the moment.";
  }

  let text = `A better option would be ${bestRoute.name}`;

  if (bestRoute.additionalDays && bestRoute.additionalDays > 0) {
    text += ` — it takes about ${bestRoute.additionalDays} extra days`;
  } else if (bestRoute.additionalDays && bestRoute.additionalDays < 0) {
    text += ` — it can actually save you about ${Math.abs(bestRoute.additionalDays)} days`;
  }

  if (bestRoute.costDelta) {
    text += `, with an additional cost of ${bestRoute.costDelta}`;
  }

  text += '.';
  return text;
}

// ── Why block ─────────────────────────────────────────────────────────────────
function buildWhy(reasoning, recommendations, usedLLM, confidence) {
  const topRec = recommendations.find(r => r.priority === 'IMMEDIATE') ||
                 recommendations.find(r => r.priority === 'HIGH') ||
                 recommendations[0];

  if (topRec?.reason) {
    // Strip technical jargon words from the reason
    let reason = topRec.reason
      .replace(/RAG|TF-IDF|Vector|LLM|GPT/gi, '')
      .replace(/WeatherAPI|NewsAPI/gi, 'live weather and news feeds')
      .replace(/\s{2,}/g, ' ')
      .trim();

    return reason;
  }

  // Fallback from reasoning field
  if (reasoning) {
    // Extract just the recommendation part, strip technical details
    const match = reasoning.match(/recommends?:?\s*(.+?)(?:\.|$)/i);
    if (match) {
      return `This is the safest and most cost-effective route based on current data.`;
    }
  }

  return "This recommendation is based on the latest data available across your supply chain.";
}

// ── Greeting / status builder ─────────────────────────────────────────────────
function buildGreetingResponse(reply, decisionOut) {
  const { apiHealth } = decisionOut;

  const isStatus = reply.toLowerCase().includes('status') ||
                   reply.toLowerCase().includes('system check') ||
                   reply.toLowerCase().includes('weather') ||
                   reply.toLowerCase().includes('news');

  if (isStatus && apiHealth) {
    const weatherOk = apiHealth.weather?.includes('Online');
    const newsOk    = apiHealth.news?.includes('Online');
    const bothOk    = weatherOk && newsOk;
    const noneOk    = !weatherOk && !newsOk;

    const weatherStatus = weatherOk ? '✅ live' : `⚠️ ${apiHealth.weather || 'offline'}`;
    const newsStatus    = newsOk    ? '✅ live' : `⚠️ ${apiHealth.news    || 'offline'}`;

    const recommendation = noneOk
      ? "Live feeds aren't available in this environment — but I can still help using your internal shipment and route data. Go ahead and ask!"
      : bothOk
      ? "All feeds are live — go ahead and ask me about your shipments!"
      : "Some feeds are limited, but I can still help with your available data.";

    return {
      situation: "Here's a quick system check for you:",
      impact: `Weather feed is ${weatherStatus} and news feed is ${newsStatus}.`,
      recommendation,
      bestOption: null,
      why: null,
      isStatusCheck: true,
      rawReply: reply
    };
  }

  return {
    situation: reply,
    impact: null,
    recommendation: null,
    bestOption: null,
    why: null,
    isGreeting: true,
    rawReply: reply
  };
}
