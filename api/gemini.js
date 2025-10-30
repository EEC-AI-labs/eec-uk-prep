// /api/gemini.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      
      console.log(GEMINI_API_KEY);
      if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
      }
      
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const body = req.body; 
      if (!body) return res.status(400).json({ error: "Empty request body" });
  
      const payload = JSON.parse(body);
  
      const upstreamResponse = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const text = await upstreamResponse.text();
      if (!text) {
        return res.status(502).json({ error: "Empty response from Gemini API" });
      }
  
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        return res.status(502).json({
          error: "Invalid JSON from Gemini API",
          raw: text.slice(0, 200),
        });
      }
  
      if (!upstreamResponse.ok) {
        return res.status(upstreamResponse.status).json({
          error: data.error?.message || "Gemini API error",
          details: data,
        });
      }
  
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Proxy failed", message: err.message });
    }
  }
  