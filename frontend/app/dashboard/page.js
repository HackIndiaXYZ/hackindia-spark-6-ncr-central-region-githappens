import { getBaseUrl } from '@/lib/api-server';
import CommandCenterUI from './CommandCenterUI';

// This is a Server Component in Next.js 15
export default async function DashboardPage() {
  const baseUrl = await getBaseUrl();
  console.log(`[Dashboard] Dynamic Base URL: ${baseUrl}`);

  try {
    const [summaryRes, recommendationsRes] = await Promise.all([
      fetch(`${baseUrl}/api/dashboard/summary`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/recommendations`, { next: { revalidate: 60 } })
    ]);

    const summary = await summaryRes.json();
    const recommendations = await recommendationsRes.json();

    return (
      <Suspense fallback={<DashboardLoading />}>
        <CommandCenterUI initialSummary={summary} initialRecommendations={recommendations} />
      </Suspense>
    );
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return <div>Error loading dashboard. Please ensure backend is running.</div>;
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
