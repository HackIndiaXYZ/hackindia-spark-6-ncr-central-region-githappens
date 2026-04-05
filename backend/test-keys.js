const weatherKey = "37b80019ea5745b983c65343260104";
const newsKey = "14cc6b3cf21241b685dfe3cb0cd7c026";

async function testKeys() {
  console.log("Testing WeatherAPI...");
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherKey}&q=London&aqi=no`);
    const data = await res.json();
    console.log("WeatherAPI Status:", res.status);
    if (res.ok) console.log("Weather Success:", data.location.name, data.current.condition.text);
    else console.log("Weather Error:", data.error?.message);
  } catch (err) {
    console.error("Weather Connection Failed:", err.message);
  }

  console.log("\nTesting NewsAPI...");
  try {
    const q = encodeURIComponent('supply chain');
    const res = await fetch(`https://newsapi.org/v2/everything?q=${q}&sortBy=publishedAt&pageSize=1&language=en&apiKey=${newsKey}`);
    const data = await res.json();
    console.log("NewsAPI Status:", res.status);
    if (res.ok) console.log("News Success:", data.articles?.[0]?.title);
    else console.log("News Error:", data.message);
  } catch (err) {
    console.error("News Connection Failed:", err.message);
  }
}

testKeys();
