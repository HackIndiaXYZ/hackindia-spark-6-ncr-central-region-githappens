import React, { Suspense } from 'react';
import { getBaseUrl } from '@/lib/api-server';
import CommandCenterUI from './CommandCenterUI';

// This is a Server Component in Next.js 15
export default async function DashboardPage() {
  const baseUrl = await getBaseUrl();
  console.log(`[Dashboard] Dynamic Base URL: ${baseUrl}`);

  try {
    const summaryUrl = `${baseUrl}/api/dashboard/summary`;
    const recommendationsUrl = `${baseUrl}/api/recommendations`;
    
    const [summaryRes, recommendationsRes] = await Promise.all([
      fetch(summaryUrl, { next: { revalidate: 60 } }),
      fetch(recommendationsUrl, { next: { revalidate: 60 } })
    ]);

    if (!summaryRes.ok) throw new Error(`Summary API failed (${summaryRes.status}) at ${summaryUrl}`);
    if (!recommendationsRes.ok) throw new Error(`Recommendations API failed (${recommendationsRes.status}) at ${recommendationsUrl}`);

    const summary = await summaryRes.json();
    const recommendations = await recommendationsRes.json();

    return (
      <Suspense fallback={<DashboardLoading />}>
        <CommandCenterUI initialSummary={summary} initialRecommendations={recommendations} />
      </Suspense>
    );
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return (
      <div className="p-10 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
        <h2 className="text-xl font-bold text-amber-500 mb-2">Command Center Offline</h2>
        <p className="text-sm font-medium text-amber-500/60 mb-4">Tactical summary feed could not be established.</p>
        <div className="bg-black/20 p-4 rounded-xl font-mono text-[10px] text-amber-500/40 break-all">
          Internal Router: {baseUrl}<br/>
          Resolution Error: {error.message}
        </div>
      </div>
    );
  }
}

function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-full bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="text-[var(--text-muted)] text-xs font-bold tracking-widest uppercase">Syncing Tactical Data...</div>
      </div>
    </div>
  );
}
