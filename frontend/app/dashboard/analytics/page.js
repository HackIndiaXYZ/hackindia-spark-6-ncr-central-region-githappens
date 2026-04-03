import React, { Suspense } from 'react';
import { getBaseUrl } from '@/lib/api-server';
import AnalyticsUI from './AnalyticsUI';

export const dynamic = 'force-dynamic';

// Next.js 15 Server Component
export default async function AnalyticsPage() {
  let baseUrl = 'unresolved';
  try {
    baseUrl = await getBaseUrl();
    const fetchUrl = `${baseUrl}/api/analytics`;
    const res = await fetch(fetchUrl, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Backend returned ${res.status} for ${fetchUrl}`);
    const analyticsData = await res.json();

    return (
      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsUI initialAnalytics={analyticsData} />
      </Suspense>
    );
  } catch (error) {
    console.error('Failed to resolve or fetch analytics:', error);
    return (
      <div className="p-10 bg-rose-500/10 border border-rose-500/20 rounded-3xl">
        <h2 className="text-xl font-bold text-rose-500 mb-2">Analytics Link failure</h2>
        <p className="text-sm font-medium text-rose-500/60 mb-4">High-level intelligence feed is offline.</p>
        <div className="bg-black/20 p-4 rounded-xl font-mono text-[10px] text-rose-500/40 break-all">
          Attempted Fetch: {baseUrl}/api/analytics<br/>
          Resolution Error: {error.message}
        </div>
      </div>
    );
  }
}

function AnalyticsLoading() {
  return (
    <div className="flex flex-col gap-10 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-48 bg-white/5 border border-white/5 rounded-[40px] animate-pulse"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 h-[500px] bg-white/5 border border-white/5 rounded-[40px] animate-pulse"></div>
        <div className="lg:col-span-4 h-[500px] bg-white/5 border border-white/5 rounded-[40px] animate-pulse"></div>
      </div>
    </div>
  );
}
