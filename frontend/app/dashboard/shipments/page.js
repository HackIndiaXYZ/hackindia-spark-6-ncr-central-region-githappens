import React, { Suspense } from 'react';
import { headers } from 'next/headers';
import ShipmentsList from './ShipmentsList';

// Next.js 15 Server Component
export default async function ShipmentsPage() {
  const getBaseUrl = async () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    const headerList = await headers();
    const host = headerList.get('host');
    if (host && !host.includes('localhost')) return `https://${host}/_/backend`;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/_/backend`;
    return 'http://localhost:5000';
  };
  const baseUrl = await getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/shipments`, { next: { revalidate: 30 } });
    const shipments = await res.json();

    return (
      <Suspense fallback={<ShipmentsLoading />}>
        <ShipmentsList initialShipments={shipments} />
      </Suspense>
    );
  } catch (error) {
    console.error('Failed to fetch shipments:', error);
    return <div>Error loading shipments. Please ensure backend is running at {baseUrl}.</div>;
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
