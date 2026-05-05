export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const PIXEL_ID = '2012688992932143';
  const ACCESS_TOKEN = 'SEU_TOKEN_AQUI';

  const { event_name, event_id, value } = req.body;

  try {
    await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [{
          event_name: event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: event_id,
          action_source: "website",
          custom_data: {
            currency: "BRL",
            value: value
          }
        }]
      })
    });

    res.status(200).json({ ok: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
