import React, { Suspense } from 'react';
import { getBaseUrl } from '@/lib/api-server';
import ShipmentsList from './ShipmentsList';

// Next.js 15 Server Component
export default async function ShipmentsPage() {
  let baseUrl = 'unresolved';
  try {
    baseUrl = await getBaseUrl();
    const fetchUrl = `${baseUrl}/api/shipments`;
    const res = await fetch(fetchUrl, { next: { revalidate: 30 } });
    
    if (!res.ok) throw new Error(`Backend returned ${res.status} for ${fetchUrl}`);
    const shipments = await res.json();

    if (!Array.isArray(shipments)) {
      throw new Error(`Invalid data format: Expected array but received ${typeof shipments}`);
    }

    return (
      <div className="flex flex-col gap-8 animate-in">
        <ShipmentsList initialShipments={shipments} />
      </div>
    );
  } catch (error) {
    console.error('Failed to resolve or fetch shipments:', error);
    return (
      <div className="p-10 bg-rose-500/10 border border-rose-500/20 rounded-3xl">
        <h2 className="text-xl font-bold text-rose-500 mb-2">Logistics Pipeline Error</h2>
        <p className="text-sm font-medium text-rose-500/60 mb-4">Fail-safe triggered: Could not synchronize shipment nodes.</p>
        <div className="bg-black/20 p-4 rounded-xl font-mono text-[10px] text-rose-500/40 break-all">
          Attempted Fetch: {baseUrl}/api/shipments<br/>
          Resolution Error: {error.message}
        </div>
      </div>
    );
  }
}

function ShipmentsLoading() {
  return (
    <div className="flex flex-col gap-10 animate-in">
      <div className="h-24 bg-white/5 border border-white/5 rounded-[40px] animate-pulse"></div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-96 bg-white/5 border border-white/5 rounded-[40px] animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}
