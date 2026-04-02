import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runNavi } from './navi/naviOrchestrator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Load mock data
const loadData = (file) => JSON.parse(readFileSync(join(__dirname, 'data', file), 'utf-8'));
const disruptions = loadData('disruptions.json');
const routes = loadData('routes.json');
const shipments = loadData('shipments.json');
const suppliers = loadData('suppliers.json');

// ─── Auth (Mock) ───────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({
      success: true,
      user: { id: 'usr-001', name: 'Alex Morgan', email, role: 'Operations Manager', avatar: null },
      token: 'mock-jwt-token-' + Date.now()
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    res.json({
      success: true,
      user: { id: 'usr-' + Date.now(), name, email, role: 'Analyst', avatar: null },
      token: 'mock-jwt-token-' + Date.now()
    });
  } else {
    res.status(400).json({ success: false, message: 'All fields required' });
  }
});

// ─── Dashboard Summary ────────────────────────────────────────
app.get('/api/dashboard/summary', (req, res) => {
  const affected = shipments.filter(s => s.status !== 'on-time').length;
  const totalDelay = shipments.reduce((sum, s) => sum + s.delayDays, 0);
  const avgDelay = (totalDelay / shipments.length).toFixed(1);
  const critical = disruptions.filter(d => d.severity === 'critical').length;
  const totalCostImpact = disruptions.reduce((sum, d) => sum + d.costImpact, 0);

  res.json({
    shipmentsAffected: affected,
    totalShipments: shipments.length,
    avgDelay: parseFloat(avgDelay),
    criticalAlerts: critical,
    totalAlerts: disruptions.length,
    totalCostImpact,
    riskScore: 72,
    trendData: [
      { date: 'Mar 25', delays: 3, risk: 45, shipments: 42 },
      { date: 'Mar 26', delays: 5, risk: 52, shipments: 38 },
      { date: 'Mar 27', delays: 8, risk: 61, shipments: 35 },
      { date: 'Mar 28', delays: 12, risk: 74, shipments: 29 },
      { date: 'Mar 29', delays: 10, risk: 68, shipments: 31 },
      { date: 'Mar 30', delays: 14, risk: 78, shipments: 26 },
      { date: 'Mar 31', delays: 11, risk: 72, shipments: 28 }
    ]
  });
});

// ─── Disruptions ──────────────────────────────────────────────
app.get('/api/disruptions', (req, res) => res.json(disruptions));

// ─── Shipments ────────────────────────────────────────────────
app.get('/api/shipments', (req, res) => res.json(shipments));

app.post('/api/shipments', (req, res) => {
  const { origin, destination, cargo, type } = req.body;
  if (!origin || !destination || !cargo) {
    return res.status(400).json({ error: 'Origin, Destination, and Cargo are required' });
  }

  const newShipment = {
    id: `SHP-${Math.floor(10000 + Math.random() * 90000)}`,
    origin,
    destination,
    cargo,
    type: type || 'sea',
    status: 'pending',
    transitDays: 14,
    delayDays: 0,
    departure: new Date().toISOString().split('T')[0],
    arrival: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    history: [
      { status: 'booked', location: origin, time: new Date().toISOString() }
    ]
  };

  shipments.unshift(newShipment);
  
  // Persist to file
  try {
    writeFileSync(join(__dirname, 'data', 'shipments.json'), JSON.stringify(shipments, null, 2));
    res.status(201).json(newShipment);
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to persist shipment' });
  }
});

// ─── Suppliers ────────────────────────────────────────────────
app.get('/api/suppliers', (req, res) => res.json(suppliers));

// ─── Routes ───────────────────────────────────────────────────
app.get('/api/routes', (req, res) => res.json(routes));

// ─── Alerts System ────────────────────────────────────────────
app.get('/api/alerts', (req, res) => {
  // Empty array as we strictly use real-time signals now
  const alerts = [];
  res.json(alerts);
});



// ─── Simulation Engine ────────────────────────────────────────
app.post('/api/simulate', (req, res) => {
  const { supplierLocation, destination, transportType, budgetMode, riskTolerance, timeSensitivity } = req.body;
  
  // Use frontend params (defaults to 50 if missing)
  const budgetWeight = (budgetMode !== undefined ? budgetMode : 50) / 100; // 0 to 1
  const riskWeight = (riskTolerance !== undefined ? riskTolerance : 50) / 100; // 0 to 1
  const timeWeight = (timeSensitivity !== undefined ? timeSensitivity : 50) / 100; // 0 to 1
  
  // ── Dynamic Node Hash Generator for infinite combinations ──
  const loc = (supplierLocation || 'Unknown').trim();
  const dest = (destination || 'Unknown').trim();
  
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const combinedHash = hashString(loc.toLowerCase() + dest.toLowerCase());
  
  // Base raw values from hash
  const baseDays = 5 + (combinedHash % 40);
  const generatedBaseCost = 10000 + ((combinedHash % 50) * 1000);
  const baseRisk = 0.10 + ((combinedHash % 35) / 100);

  // Apply user-defined constraints (simulation "what-if" models)
  // If user sets high time sensitivity, transit time decreases 
  const timeModifier = 1 - (timeWeight - 0.5); 
  // If user sets low risk tolerance, risk naturally decreases but we offset it by cost
  const simulatedRisk = baseRisk * (riskWeight * 1.5 + 0.2); 
  // Base cost is slightly adjusted by their budget stringency 
  const costModifier = 1 + (0.5 - budgetWeight) + (0.5 - riskWeight); 

  const factor = { 
    base: Math.max(1, Math.round(baseDays * timeModifier)), 
    risk: simulatedRisk, 
    cost: Math.round(generatedBaseCost * Math.max(0.4, costModifier))
  };

  const isAir = (transportType || '').toLowerCase() === 'air';
  
  const delayProbability = Math.min(95, Math.round((factor.risk + (isAir ? -0.15 : 0.1)) * 100 + Math.random() * 10));
  const baseCost = isAir ? factor.cost * 3.2 : factor.cost;
  const costImpact = Math.round(baseCost * (1 + factor.risk));
  const transitDays = isAir ? Math.max(1, Math.round(factor.base / 6)) : factor.base;
  const delayedDays = Math.round(transitDays * factor.risk * 1.5);

  const result = {
    scenario: { supplierLocation, destination, transportType: transportType || 'sea' },
    results: {
      delayProbability: delayProbability + '%',
      estimatedTransitDays: transitDays,
      estimatedDelayDays: delayedDays,
      costEstimate: baseCost,
      costWithDisruption: costImpact,
      costImpactPercent: Math.round(factor.risk * 100) + '%',
      riskLevel: factor.risk > 0.3 ? 'High' : factor.risk > 0.15 ? 'Medium' : 'Low'
    },
    alternatives: [
      {
        description: isAir ? 'Sea freight (slower, cheaper)' : 'Air freight (faster, more expensive)',
        transitDays: isAir ? factor.base : Math.max(1, Math.round(factor.base / 6)),
        cost: isAir ? factor.cost : factor.cost * 3.2,
        delayProbability: isAir ? (factor.risk + 0.1) * 100 + '%' : Math.max(5, (factor.risk - 0.15) * 100) + '%'
      },
      {
        description: 'Alternative premium routing via secondary hubs',
        transitDays: Math.max(1, transitDays - 2),
        cost: Math.round(baseCost * 1.25),
        delayProbability: Math.max(5, delayProbability - 25) + '%'
      },
      {
        description: 'Multi-modal (sea + rail)',
        transitDays: Math.round(transitDays * 0.85),
        cost: Math.round(baseCost * 1.15),
        delayProbability: Math.max(8, delayProbability - 15) + '%'
      }
    ]
  };

  setTimeout(() => res.json(result), 600);
});

// ─── Route Optimization ───────────────────────────────────────
app.get('/api/routes/optimize/:routeId', (req, res) => {
  const route = routes.find(r => r.id === req.params.routeId);
  if (!route) return res.status(404).json({ error: 'Route not found' });

  const optimized = {
    currentRoute: {
      ...route,
      totalDays: route.transitDays + route.currentDelay,
      totalCost: route.cost * (1 + route.currentDelay * 0.02)
    },
    optimizedRoute: {
      name: route.name.replace('via Suez', 'via Cape').replace('→', '→ (Optimized) '),
      transitDays: route.transitDays + 5,
      delay: 0,
      totalDays: route.transitDays + 5,
      cost: Math.round(route.cost * 1.12),
      riskLevel: 'low',
      reliability: 94
    },
    comparison: {
      timeSaved: Math.max(0, route.currentDelay - 2) + ' days',
      costDifference: '+' + Math.round(route.cost * 0.12).toLocaleString(),
      reliabilityImprovement: '+' + (94 - (route.riskLevel === 'critical' ? 45 : route.riskLevel === 'high' ? 62 : 78)) + '%',
      recommendation: route.currentDelay > 3 ? 'Strongly recommended' : 'Optional - monitor situation'
    }
  };

  res.json(optimized);
});

// ─── Analytics ────────────────────────────────────────────────
app.get('/api/analytics', (req, res) => {
  res.json({
    delaysOverTime: [
      { month: 'Oct', delays: 12, onTime: 88 },
      { month: 'Nov', delays: 18, onTime: 82 },
      { month: 'Dec', delays: 25, onTime: 75 },
      { month: 'Jan', delays: 22, onTime: 78 },
      { month: 'Feb', delays: 30, onTime: 70 },
      { month: 'Mar', delays: 35, onTime: 65 }
    ],
    riskDistribution: [
      { name: 'Weather', value: 35, color: '#3b82f6' },
      { name: 'Congestion', value: 25, color: '#f59e0b' },
      { name: 'Geopolitical', value: 20, color: '#ef4444' },
      { name: 'Infrastructure', value: 12, color: '#8b5cf6' },
      { name: 'Supplier', value: 8, color: '#10b981' }
    ],
    regionPerformance: [
      { region: 'Asia Pacific', reliability: 72, avgDelay: 4.2, shipments: 340 },
      { region: 'Europe', reliability: 78, avgDelay: 3.1, shipments: 280 },
      { region: 'North America', reliability: 85, avgDelay: 1.8, shipments: 210 },
      { region: 'Middle East', reliability: 65, avgDelay: 5.5, shipments: 120 },
      { region: 'South America', reliability: 81, avgDelay: 2.4, shipments: 95 }
    ],
    costTrend: [
      { month: 'Oct', actual: 2100000, projected: 1800000 },
      { month: 'Nov', actual: 2800000, projected: 1900000 },
      { month: 'Dec', actual: 3200000, projected: 2000000 },
      { month: 'Jan', actual: 2900000, projected: 2100000 },
      { month: 'Feb', actual: 4100000, projected: 2200000 },
      { month: 'Mar', actual: 4800000, projected: 2300000 }
    ],
    kpis: {
      totalShipmentsMonitored: 1045,
      averageTransitTime: 24.5,
      onTimeDeliveryRate: 68.2,
      costSavingsFromAI: 2400000,
      disruptionsAverted: 14,
      routesOptimized: 38
    }
  });
});

// ─── Recommended Actions ──────────────────────────────────────
app.get('/api/recommendations', (req, res) => {
  res.json([
    { id: 'REC-001', icon: 'RotateCcw', title: "Reroute Shipment SHP-10234", desc: "Estimated cost save: ₹3.4L", action: "reroute" },
    { id: 'REC-002', icon: 'ShieldAlert', title: "Acknowledge Rotterdam Hub", desc: "24% congestion mitigation available", action: "resolve" },
    { id: 'REC-003', icon: 'Clock', title: "Defer Batch XT-09 (Electronics)", desc: "Avoid typhoon transit; save ₹1.2L", action: "defer" }
  ]);
});

// ─── Navi Multi-Agent Intelligence API ───────────────────────
app.post('/api/navi/query', async (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Query required' });
  }

  try {
    const result = await runNavi(query.trim(), { disruptions, routes, shipments, suppliers });
    res.json(result);
  } catch (err) {
    console.error('Navi error:', err);
    res.status(500).json({ error: 'Navi pipeline failed', details: err.message });
  }
});

// Demo scenario endpoint — preloaded "Storm detected via API"
app.get('/api/navi/demo', async (req, res) => {
  try {
    const result = await runNavi(
      'Storm detected via API — what is the best route and immediate action?',
      { disruptions, routes, shipments, suppliers }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Demo scenario failed', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n  🚀 SupplyAlert API Server running on http://localhost:${PORT}`);
  console.log(`  📊 Dashboard: http://localhost:${PORT}/api/dashboard/summary`);
  console.log(`  🤖 Navi Intel: POST http://localhost:${PORT}/api/navi/query`);
  console.log(`  🔄 Simulation: POST http://localhost:${PORT}/api/simulate\n`);
});
