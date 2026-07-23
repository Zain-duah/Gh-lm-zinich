export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, model } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Invalid request' });

  const allowed = [
    'llama-3.3-70b-versatile',
'openai/gpt-oss-120b' ];
  const safeModel = allowed.includes(model) ? model : allowed[0];

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({ model: safeModel, messages, max_tokens: 3048 }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error?.message || 'Groq error' });
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
      }
  
