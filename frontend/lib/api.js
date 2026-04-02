const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.host;
    if (host && !host.includes('localhost')) {
      return '/_/backend/api';
    }
  }
  return '/api';
};

const api = {
  getDashboardSummary: async () => {
    const res = await fetch(`${getApiUrl()}/dashboard/summary`);
    if (!res.ok) throw new Error('Failed to fetch summary');
    return res.json();
  },

  // Legacy — kept for backward compat
  getAIAdvisorInsights: async (prompt) => {
    const res = await fetch(`${getApiUrl()}/ai/advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error('Failed to fetch AI insights');
    return res.json();
  },

  // ── Navi Multi-Agent Intelligence ──────────────────────────
  queryNavi: async (query) => {
    const fetchUrl = `${getApiUrl()}/navi/query`;
    const res = await fetch(fetchUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => 'No internal error body');
      throw new Error(`Navi failed (${res.status}) at ${fetchUrl}: ${errText}`);
    }
    return res.json();
  },

  loadNaviDemo: async () => {
    const fetchUrl = `${getApiUrl()}/navi/demo`;
    const res = await fetch(fetchUrl);
    if (!res.ok) {
      const errText = await res.text().catch(() => 'No internal error body');
      throw new Error(`Demo failed (${res.status}) at ${fetchUrl}: ${errText}`);
    }
    return res.json();
  },

  getShipments: async () => {
    const res = await fetch(`${getApiUrl()}/shipments`);
    if (!res.ok) throw new Error('Failed to fetch shipments');
    return res.json();
  },

  bookShipment: async (data) => {
    const res = await fetch(`${getApiUrl()}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to book shipment');
    return res.json();
  },

  runSimulation: async (params) => {
    const res = await fetch(`${getApiUrl()}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Simulation failed');
    return res.json();
  },
};

export default api;

