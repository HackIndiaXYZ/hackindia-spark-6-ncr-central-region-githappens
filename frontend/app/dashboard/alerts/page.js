import React, { Suspense } from 'react';
import { getBaseUrl } from '@/lib/api-server';
import AlertsList from './AlertsList';

// Next.js 15 Server Component
export default async function AlertsPage() {
  const baseUrl = await getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/alerts`, { next: { revalidate: 30 } });
    const alerts = await res.json();

    return (
      <Suspense fallback={<AlertsLoading />}>
        <AlertsList initialAlerts={alerts} />
      </Suspense>
    );
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    return <div>Error loading tactical alerts. Please ensure backend is running at {baseUrl}.</div>;
  }
}

function AlertsLoading() {
  return (
    <div className="flex flex-col gap-10 animate-in">
      <div className="h-24 bg-white/5 border border-white/5 rounded-[40px] animate-pulse"></div>
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-white/5 border border-white/5 rounded-[40px] animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}
