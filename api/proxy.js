export default async function handler(req, res) {
  // Get the target URL from the query string (e.g., ?url=https://...)
  const targetUrl = req.query.url;

  if (!targetUrl) {
    res.status(400).json({ error: 'Missing "url" query parameter.' });
    return;
  }

  try {
    // Set up headers to mimic a browser request, which can help avoid blocks
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json'
    };
    
    const response = await fetch(targetUrl, { headers });

    if (!response.ok) {
      throw new Error(`Upstream fetch failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Set CORS headers to allow your app to access this from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Vercel benefits from cache control headers for performance
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    // Return the data from Yahoo Finance
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: `An error occurred while proxying the request: ${error.message}` });
  }
}
