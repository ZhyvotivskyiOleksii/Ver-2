import { NextRequest, NextResponse } from 'next/server';

// Telegram notification
async function notifyTelegram(text: string) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!token || !chatId) {
      console.warn('Telegram credentials not configured');
      return false;
    }
    
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Telegram notification error:', error);
    return false;
  }
}

// Service name mapping
const serviceNames: Record<string, Record<string, string>> = {
  ua: {
    landing: 'Landing Page',
    corporate: 'Корпоративний сайт',
    ecommerce: 'Інтернет-магазин',
    webapp: 'Web-додаток',
    redesign: 'Редизайн сайту',
    support: 'Підтримка сайту',
  },
  en: {
    landing: 'Landing Page',
    corporate: 'Corporate Website',
    ecommerce: 'Online Store',
    webapp: 'Web Application',
    redesign: 'Website Redesign',
    support: 'Website Support',
  },
  pl: {
    landing: 'Landing Page',
    corporate: 'Strona firmowa',
    ecommerce: 'Sklep internetowy',
    webapp: 'Aplikacja webowa',
    redesign: 'Redesign strony',
    support: 'Wsparcie strony',
  },
  de: {
    landing: 'Landing Page',
    corporate: 'Unternehmenswebsite',
    ecommerce: 'Online-Shop',
    webapp: 'Webanwendung',
    redesign: 'Website-Redesign',
    support: 'Website-Support',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message, sourcePage, locale, timestamp } = body;
    
    // Validation
    if (!name || !email || !service) {
      return NextResponse.json(
        { error: 'Name, email, and service are required' },
        { status: 400 }
      );
    }
    
    // Get service name in the appropriate language
    const serviceName = serviceNames[locale]?.[service] || serviceNames.ua[service] || service;
    
    // Telegram message
    const telegramMessage = `
🚀 <b>НОВА ЗАЯВКА!</b>

📋 <b>Послуга:</b> ${serviceName}
👤 <b>Ім'я:</b> ${name}
📧 <b>Email:</b> ${email}
📱 <b>Телефон:</b> ${phone || 'Не вказано'}

💬 <b>Повідомлення:</b>
${message || 'Не вказано'}

📍 <b>Сторінка:</b> ${sourcePage}
🌐 <b>Мова сайту:</b> ${locale.toUpperCase()}
🕐 <b>Час:</b> ${new Date(timestamp).toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}
`.trim();
    
    // Send Telegram notification
    const telegramResult = await notifyTelegram(telegramMessage);
    
    console.log(`Order notification - Telegram: ${telegramResult ? '✅' : '❌'}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order received successfully',
    });
    
  } catch (error: any) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
