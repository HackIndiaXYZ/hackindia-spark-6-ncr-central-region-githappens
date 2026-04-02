/**
 * Navi Live Signals — Weather & News API Integration
 * Fetches real-time supply chain context from external sources.
 */


export async function getRelevantSignals(retrievedDocs) {
  const regions = new Set(
    retrievedDocs
      .filter(d => d.raw?.region)
      .map(d => d.raw.region)
  );

  const signals = [];
  const weatherKey = process.env.WEATHER_API_KEY;
  const newsKey = process.env.NEWS_API_KEY;
  
  const apiHealth = {
    weather: 'Unconfigured / Fallback Mode',
    news: 'Unconfigured / Fallback Mode'
  };

  // 1. WeatherAPI Integration (Live)
  if (weatherKey && weatherKey.length > 5 && !weatherKey.includes('your-')) {
    try {
      const locQueries = [];
      if ([...regions].some(r => r.includes('Asia'))) locQueries.push('Shenzhen');
      if ([...regions].some(r => r.includes('Europe'))) locQueries.push('Rotterdam');
      if (locQueries.length === 0) locQueries.push('London'); // Default polling

      let anySuccess = false;
      for (const loc of locQueries) {
        const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${weatherKey}&q=${loc}&aqi=no`);
        if (res.ok) {
          anySuccess = true;
          const data = await res.json();
          const condition = data.current.condition.text.toLowerCase();
          const isSevere = condition.includes('storm') || condition.includes('hurricane') || data.current.wind_mph > 40;
          
          if (isSevere || condition.includes('fog') || condition.includes('heavy') || condition.includes('rain')) {
             signals.push({
               source: 'WeatherAPI (Live)',
               type: 'weather',
               event: `${data.current.condition.text} Advisory`,
               location: data.location.name,
               severity: isSevere ? 'high' : 'medium',
               details: `Current winds at ${data.current.wind_mph}mph. Visibility: ${data.current.vis_miles}Miles.`,
               affectedRegion: loc === 'Shenzhen' ? 'Asia Pacific' : 'Europe',
               timestamp: new Date().toISOString()
             });
          }
        }
      }
      apiHealth.weather = anySuccess ? 'Online (Polling active)' : 'API Error (Bad Request)';
    } catch (err) {
      apiHealth.weather = 'Offline (Connection Failed)';
      console.warn('WeatherAPI live fetch failed, skipping.');
    }
  }

  // 2. NewsAPI Integration (Live)
  if (newsKey && newsKey.length > 5 && !newsKey.includes('your-')) {
    try {
      const q = encodeURIComponent('supply chain OR shipping OR logistics disruption');
      const res = await fetch(`https://newsapi.org/v2/everything?q=${q}&sortBy=publishedAt&pageSize=3&language=en&apiKey=${newsKey}`);
      if (res.ok) {
        apiHealth.news = 'Online (Live sync)';
        const data = await res.json();
        data.articles?.forEach(article => {
          const title = article.title.toLowerCase();
          let severity = 'low';
          if (title.includes('strike') || title.includes('attack') || title.includes('halt')) severity = 'critical';
          else if (title.includes('delay') || title.includes('divert') || title.includes('congestion')) severity = 'high';

          if (severity !== 'low') {
             signals.push({
               source: 'NewsAPI (Live)',
               type: 'geopolitical',
               headline: article.title,
               severity,
               affectedRegion: 'Global',
               details: article.description?.slice(0, 100) + '...',
               timestamp: article.publishedAt || new Date().toISOString()
             });
          }
        });
      } else {
        apiHealth.news = 'API Error (Unauthorized or Quota Exceeded)';
      }
    } catch (err) {
      apiHealth.news = 'Offline (Connection Failed)';
      console.warn('NewsAPI live fetch failed, skipping.');
    }
  }

  // (Mock Demo Injections Removed by user request to strictly enforce real-time data constraints)

  return { signals, apiHealth };
}
