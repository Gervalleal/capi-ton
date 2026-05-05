export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const PIXEL_ID = '2012688992932143';

  // 🔒 Padrão profissional (Vercel env)
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || 'gBRWAZBWnknz9WgstaZBB5Qiv8BdRCJY9Xz1yyUIG0UJJvrQRGzoBPMmZB0CNViynbRVnsJF3idoDNf3LJlrH3y4SZBmyFjCQMn4JRB7uUZB8drEBZBTdo7V7IjY7XiX8OrtckeooX1EB4Nq3CKBAzzu2j3rERp1fZAdvljc7qL4tcgNkqinoMAZDZD';

  const { event_name, event_id, value } = req.body;

  const userAgent = req.headers['user-agent'];
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket?.remoteAddress;

  try {

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [{
            event_name: event_name || 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            event_id: event_id || Date.now().toString(),
            action_source: "website",
            user_data: {
              client_user_agent: userAgent,
              client_ip_address: ip
            },
            custom_data: {
              currency: "BRL",
              value: value || 0
            }
          }]
        })
      }
    );

    const data = await response.json();

    console.log("Resposta Meta:", data);

    return res.status(200).json({
      ok: true,
      enviado: true,
      fb: data
    });

  } catch (err) {

    console.error("Erro:", err);

    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}
