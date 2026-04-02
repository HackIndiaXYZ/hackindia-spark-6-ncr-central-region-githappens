const fs = require('fs');
const routesPath = 'backend/data/routes.json';
const shipmentsPath = 'backend/data/shipments.json';

const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
const shipments = JSON.parse(fs.readFileSync(shipmentsPath, 'utf8'));

// New Routes
routes.push({
  id: 'RT-006',
  name: 'Dubai → Antwerp',
  origin: { name: 'Dubai', lat: 25.0, lng: 55.0 },
  destination: { name: 'Antwerp', lat: 51.3, lng: 4.4 },
  waypoints: [{ name: 'Suez Canal', lat: 31.3, lng: 32.3 }],
  distance: '4,200 nm',
  transitDays: 16,
  cost: 26000,
  status: 'operational',
  riskLevel: 'low',
  currentDelay: 0,
  transportType: 'sea'
});

routes.push({
  id: 'RT-007',
  name: 'Sydney → New York',
  origin: { name: 'Sydney', lat: -33.8, lng: 151.2 },
  destination: { name: 'New York', lat: 40.7, lng: -74.0 },
  waypoints: [{ name: 'Panama Canal', lat: 9.0, lng: -79.5 }],
  distance: '9,800 nm',
  transitDays: 28,
  cost: 41000,
  status: 'at-risk',
  riskLevel: 'medium',
  currentDelay: 3,
  transportType: 'sea'
});

// New Shipments
shipments.push({
  id: 'SHP-10240',
  origin: 'Dubai',
  destination: 'Antwerp',
  status: 'on-time',
  routeId: 'RT-006',
  cargo: 'Petrochemicals',
  value: 4100000,
  departureDate: '2026-03-28T00:00:00Z',
  expectedArrival: '2026-04-13T00:00:00Z',
  revisedArrival: '2026-04-13T00:00:00Z',
  delayDays: 0,
  supplier: 'Gulf Petro',
  carrier: 'MSC'
});

shipments.push({
  id: 'SHP-10241',
  origin: 'Sydney',
  destination: 'New York',
  status: 'delayed',
  routeId: 'RT-007',
  cargo: 'Agricultural Tech',
  value: 2900000,
  departureDate: '2026-03-15T00:00:00Z',
  expectedArrival: '2026-04-12T00:00:00Z',
  revisedArrival: '2026-04-15T00:00:00Z',
  delayDays: 3,
  supplier: 'Aussie Agri',
  carrier: 'CMA CGM'
});

fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2));
fs.writeFileSync(shipmentsPath, JSON.stringify(shipments, null, 2));
console.log('Update successful');
