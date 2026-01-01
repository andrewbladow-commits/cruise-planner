export default async function handler(req, res) {
  // 1. Allow Vercel to handle the request method check automatically or keep simple
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API Key missing in Vercel Settings' });
  }

  try {
    // 2. USE THE PUBLIC MODEL NAME: gemini-1.5-flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    // Check if Google returned an error
    if (data.error) {
        throw new Error(data.error.message);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message });
  }
}