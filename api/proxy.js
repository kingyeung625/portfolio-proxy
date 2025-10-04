export default async function handler(req, res) {
   Get the target URL from the query string (e.g., url=https...)
  const targetUrl = req.query.url;

  if (!targetUrl) {
    res.status(400).send('Missing url query parameter.');
    return;
  }

  try {
    const response = await fetch(targetUrl);

     Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

     Set CORS headers to allow your app to access this
    res.setHeader('Access-Control-Allow-Origin', '');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

     Return the data from Yahoo Finance
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(`An error occurred ${error.message}`);
  }
}