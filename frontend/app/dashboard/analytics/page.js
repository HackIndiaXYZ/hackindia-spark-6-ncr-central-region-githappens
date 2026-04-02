import React, { Suspense } from 'react';
import AnalyticsUI from './AnalyticsUI';

// Next.js 15 Server Component
export default async function AnalyticsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  try {
    const res = await fetch(`${baseUrl}/api/analytics`, { next: { revalidate: 60 } });
    const analyticsData = await res.json();

    return (
      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsUI initialAnalytics={analyticsData} />
      </Suspense>
    );
  } catch (error) {
    console.error('Failed to fetch analytics data:', error);
    return <div>Error loading analytics. Please ensure backend is running at {baseUrl}.</div>;
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
