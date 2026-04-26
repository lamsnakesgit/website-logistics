export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, phone, route } = JSON.parse(req.body);
    const token = process.env.TG_BOT;
    const chatId = process.env.TG_USER_ID_ALLOWED;

    if (!token || !chatId) {
      throw new Error('Telegram credentials are not configured');
    }

    const text = `🚀 *Новая заявка (Phoenix Crystal)*\n\n👤 *Имя:* ${name}\n📞 *Тел:* ${phone}\n📍 *Маршрут:* ${route}`;

    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (!tgResponse.ok) {
      const errorData = await tgResponse.json();
      throw new Error(`Telegram API error: ${errorData.description}`);
    }

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error in submit handler:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
