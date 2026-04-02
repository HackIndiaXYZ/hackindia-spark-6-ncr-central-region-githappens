const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = {
  getDashboardSummary: async () => {
    const res = await fetch(`${BASE_URL}/dashboard/summary`);
    if (!res.ok) throw new Error('Failed to fetch summary');
    return res.json();
  },

  // Legacy — kept for backward compat
  getAIAdvisorInsights: async (prompt) => {
    const res = await fetch(`${BASE_URL}/ai/advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error('Failed to fetch AI insights');
    return res.json();
  },

  // ── Navi Multi-Agent Intelligence ──────────────────────────
  queryNavi: async (query) => {
    const res = await fetch(`${BASE_URL}/navi/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Navi pipeline failed');
    return res.json();
  },

  loadNaviDemo: async () => {
    const res = await fetch(`${BASE_URL}/navi/demo`);
    if (!res.ok) throw new Error('Demo scenario failed');
    return res.json();
  },

  getShipments: async () => {
    const res = await fetch(`${BASE_URL}/shipments`);
    if (!res.ok) throw new Error('Failed to fetch shipments');
    return res.json();
  },

  bookShipment: async (data) => {
    const res = await fetch(`${BASE_URL}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to book shipment');
    return res.json();
  },

  runSimulation: async (params) => {
    const res = await fetch(`${BASE_URL}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Simulation failed');
    return res.json();
  },
};

export default api;

