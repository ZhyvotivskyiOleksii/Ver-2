
'use server';
/**
 * @fileOverview An intelligent AI assistant for the WebImpuls studio.
 *
 * - webImpulsChat - A function that handles the chat process.
 * - WebImpulsChatInput - The input type for the webImpulsChat function.
 * - WebImpulsChatOutput - The return type for the webImpulsChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { buildSiteKnowledge, fetchRelevantDocs } from '@/lib/knowledge';

const WebImpulsChatInputSchema = z.object({
  query: z.string().describe('The user\'s message or question.'),
  chatHistory: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
  })).describe('The history of the conversation so far.'),
  locale: z.string().optional().describe('UI locale (ua/pl/en/de).'),
  customerName: z.string().optional().describe('Customer\'s name if known.'),
});
export type WebImpulsChatInput = z.infer<typeof WebImpulsChatInputSchema>;

const WebImpulsChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user.'),
});
export type WebImpulsChatOutput = z.infer<typeof WebImpulsChatOutputSchema>;

export async function webImpulsChat(input: WebImpulsChatInput): Promise<WebImpulsChatOutput> {
  return webImpulsChatFlow(input);
}

// This is the knowledge base for the AI. It contains information from the website.
const siteKnowledge = `
WebImpuls Studio Information:
- Description: Створюємо не просто сайти, а потужні інструменти для вашого бізнесу, що завантажуються швидше, ніж ви встигнете зробити каву. Кожен піксель, кожна стрічка коду працює на ваш успіх. Готові перетворити відвідувачів на клієнтів?
- Ми спеціалізуємося на створенні сучасних, швидких та ефективних веб-рішень.

Services & Pricing (Ukrainian):

1. Лендінг:
- Опис: Продаюча сторінка.
- Ціна: $600 - $1,300 (Вартість залежить від складності).
- Термін: 5-7 днів.
- Що входить: Адаптивний дизайн, сучасні анімації, SEO-оптимізація, інтеграція з аналітикою, форма зворотного зв'язку, завантаження за 1-2 секунди.
- Технології: Next.js 15, React 19, Tailwind CSS, Framer Motion, TypeScript, Vercel.

2. Корпоративний сайт (Найпопулярніше):
- Опис: Представницький сайт для бізнесу.
- Ціна: $2,300 - $4,800 (Залежно від кількості сторінок).
- Термін: 14-21 день.
- Що входить: Багатосторінкова структура, адмін-панель для контенту, блог/новини, галерея проєктів, контакти та карти, багатомовність.
- Технології: Next.js 15, React 19, Prisma ORM, PostgreSQL, Shadcn/ui, Clerk Auth.

3. Інтернет-магазин:
- Опис: Повноцінне e-commerce рішення.
- Ціна: $3,800 - $7,800 (Базова версія - просунута).
- Термін: 21-35 днів.
- Що входить: Каталог товарів з фільтрами, кошик та система замовлень, інтеграція платежів, особистий кабінет, адмін-панель, система знижок.
- Технології: Next.js Commerce, Shopify Hydrogen, Stripe, Supabase, Zustand, React Query.

4. Веб-додаток (SaaS/PWA):
- Опис: SaaS/PWA рішення.
- Ціна: $7,800 - $14,800 (MVP - повнофункціональне).
- Термін: 45-60 днів.
- Що входить: Система авторизації, дашборд з аналітикою, API для інтеграцій, real-time оновлення, файлове сховище, push-повідомлення.
- Технології: Next.js 15, React 19, tRPC, Prisma, PostgreSQL, Redis.

5. Редизайн сайту:
- Опис: Оновлення дизайну та модернізація.
- Ціна: $1,300 - $3,800 (Залежно від обсягу робіт).
- Термін: 10-21 день.
- Що входить: Сучасний UI/UX, міграція на нові технології, оптимізація продуктивності, поліпшення SEO, адаптація під мобільні.
- Технології: Figma to Code, Tailwind CSS, Framer Motion, Next.js, Lighthouse.

6. Підтримка сайту:
- Опис: Технічна підтримка та розвиток.
- Ціна: $300 - $800/місяць (Базовий - розширений пакет).
- Термін: Відповідь до 24 годин.
- Що входить: 24/7 моніторинг, оновлення контенту, резервні копії, виправлення помилок, оновлення безпеки, щомісячні звіти.
- Технології: Vercel Analytics, Sentry, Uptime Robot, Google Analytics, Lighthouse CI.

Services & Pricing (Polish):

1. Landing Page:
- Opis: Strona sprzedażowa.
- Cena: $600 - $1,300 (Koszt zależy od złożoności).
- Termin: 5-7 dni.
- Co zawiera: Responsywny design, nowoczesne animacje, optymalizacja SEO, integracja z analityką, formularz kontaktowy, ładowanie w 1-2 sekundy.

2. Strona korporacyjna (Najpopularniejsze):
- Opis: Reprezentacyjna strona dla biznesu.
- Cena: $2,300 - $4,800 (W zależności od liczby stron).
- Termin: 14-21 dni.
- Co zawiera: Wielostronicowa struktura, panel administracyjny do zarządzania treścią, blog/aktualności, galeria projektów, kontakty i mapy, wielojęzyczność.

3. Sklep internetowy:
- Opis: Pełnowartościowe rozwiązanie e-commerce.
- Cena: $3,800 - $7,800 (Wersja podstawowa - zaawansowana).
- Termin: 21-35 dni.
- Co zawiera: Katalog produktów z filtrami, koszyk i system zamówień, integracja płatności, panel klienta, panel administracyjny, system rabatów.

4. Aplikacja internetowa (SaaS/PWA):
- Opis: Rozwiązanie SaaS/PWA.
- Cena: $7,800 - $14,800 (MVP - pełna funkcjonalność).
- Termin: 45-60 dni.
- Co zawiera: System autoryzacji, dashboard z analityką, API do integracji, aktualizacje w czasie rzeczywistym, przechowywanie plików, powiadomienia push.

5. Przeprojektowanie strony:
- Opis: Odświeżenie designu i modernizacja.
- Cena: $1,300 - $3,800 (W zależności od zakresu prac).
- Termin: 10-21 dni.
- Co zawiera: Nowoczesny design UI/UX, migracja na nowe technologie, optymalizacja wydajności, poprawa SEO, adaptacja mobilna.

6. Wsparcie strony:
- Opis: Wsparcie techniczne i rozwój.
- Cena: $300 - $800/miesiąc (Pakiet podstawowy - rozszerzony).
- Termin: Odpowiedź do 24 godzin.
- Co zawiera: Monitoring 24/7, aktualizacje treści, kopie zapasowe, naprawa błędów, aktualizacje bezpieczeństwa, miesięczne raporty.

Services & Pricing (English):

1. Landing Page:
- Description: Sales-driven page.
- Price: $600 - $1,300 (Cost depends on complexity).
- Timeframe: 5-7 days.
- What's included: Responsive design, modern animations, SEO optimization, analytics integration, contact form, loads in 1-2 seconds.

2. Corporate Website (Most Popular):
- Description: Business representative site.
- Price: $2,300 - $4,800 (Depending on the number of pages).
- Timeframe: 14-21 days.
- What's included: Multi-page structure, content management admin panel, blog/news section, project gallery, contact forms and maps, multilingual support.

3. E-commerce Store:
- Description: Full-fledged e-commerce solution.
- Price: $3,800 - $7,800 (Basic to advanced version).
- Timeframe: 21-35 days.
- What's included: Product catalog with filters, shopping cart and order system, payment gateway integration, user account area, admin management panel, discount system.

4. Web Application (SaaS/PWA):
- Description: SaaS/PWA solution.
- Price: $7,800 - $14,800 (MVP to full-featured).
- Timeframe: 45-60 days.
- What's included: Authentication system, analytics dashboard, API for integrations, real-time updates, file storage, push notifications.

5. Website Redesign:
- Description: Design refresh and modernization.
- Price: $1,300 - $3,800 (Depending on the scope of work).
- Timeframe: 10-21 days.
- What's included: Modern UI/UX design, migration to new technologies, performance optimization, SEO improvement, mobile adaptation.

6. Website Support:
- Description: Technical support and development.
- Price: $300 - $800/month (Basic to advanced package).
- Timeframe: Response up to 24 hours.
- What's included: 24/7 website monitoring, content updates, backups, bug fixes, security updates, monthly reports.

Services & Pricing (German):

1. Landing Page:
- Beschreibung: Verkaufsseite.
- Preis: $600 - $1,300 (Die Kosten hängen von der Komplexität ab).
- Zeitrahmen: 5-7 Tage.
- Was ist inbegriffen: Responsives Design, moderne Animationen, SEO-Optimierung, Analyse-Integration, Kontaktformular, Ladezeit von 1-2 Sekunden.

2. Unternehmenswebsite (Am beliebtesten):
- Beschreibung: Repräsentative Website für Unternehmen.
- Preis: $2,300 - $4,800 (Abhängig von der Anzahl der Seiten).
- Zeitrahmen: 14-21 Tage.
- Was ist inbegriffen: Mehrseitige Struktur, Admin-Panel zur Inhaltsverwaltung, Blog/News, Projektgalerie, Kontaktformulare und Karten, Mehrsprachigkeit.

3. E-Commerce-Shop:
- Beschreibung: Vollwertige E-Commerce-Lösung.
- Preis: $3,800 - $7,800 (Basis- bis erweiterte Version).
- Zeitrahmen: 21-35 Tage.
- Was ist inbegriffen: Produktkatalog mit Filtern, Warenkorb- und Bestellsystem, Zahlungsgateway-Integration, Benutzerkontobereich, Admin-Verwaltungspanel, Rabattsystem.

4. Webanwendung (SaaS/PWA):
- Beschreibung: SaaS/PWA-Lösung.
- Preis: $7,800 - $14,800 (MVP bis voll funktionsfähig).
- Zeitrahmen: 45-60 Tage.
- Was ist inbegriffen: Authentifizierungssystem, Analyse-Dashboard, API für Integrationen, Echtzeit-Updates, Dateispeicher, Push-Benachrichtigungen.

5. Website-Neugestaltung:
- Beschreibung: Design-Auffrischung und Modernisierung.
- Preis: $1,300 - $3,800 (Abhängig vom Arbeitsumfang).
- Zeitrahmen: 10-21 Tage.
- Was ist inbegriffen: Modernes UI/UX-Design, Migration auf neue Technologien, Leistungsoptimierung, SEO-Verbesserung, mobile Anpassung.

6. Website-Support:
- Beschreibung: Technischer Support und Entwicklung.
- Preis: $300 - $800/Monat (Basis- bis erweitertes Paket).
- Zeitrahmen: Antwort innerhalb von 24 Stunden.
- Was ist inbegriffen: 24/7-Website-Überwachung, Inhaltsaktualisierungen, Backups, Fehlerbehebungen, Sicherheitsupdates, monatliche Berichte.

Contact Info:
- Telegram: https://t.me/oleksiy_zhyvotivskyi
- Viber: viber://chat?number=%2B48512686628
- Facebook Messenger: https://m.me/61559794323482
`;


const prompt = ai.definePrompt({
  name: 'webImpulsChatPrompt',
  input: {schema: WebImpulsChatInputSchema},
  output: {schema: WebImpulsChatOutputSchema},
  prompt: `You are "AI Web Impuls", a friendly, expert and consultative sales assistant for the WebImpuls studio.

LANGUAGE RULE (CRITICAL):
- ALWAYS respond in the SAME LANGUAGE as the user's latest message (query).
- If user writes in Ukrainian → respond in Ukrainian.
- If user writes in Polish → respond in Polish.
- If user writes in German → respond in German.
- If user writes in English → respond in English.
- IGNORE the UI locale. Only the language of the user's actual message matters.
- If user switches language mid-conversation, switch with them immediately.

Use the facts ONLY from: 1) Structured Site Knowledge below, and 2) Optional Supporting Docs.
If information is missing or uncertain, say so and propose to contact a manager (do not invent facts).

CRITICAL RULES:
- NEVER start with a greeting (Привіт, Hi, Cześć, Hallo, etc.) if the conversation history already contains messages. Greetings are ONLY for the first message when chatHistory is empty.
- Do NOT add "Чи була ця інформація корисною? 👍 / 👎" or any rating request to your messages. The system handles ratings separately.
- Do NOT repeat information the user already knows from previous messages.

SERVICES RULE (IMPORTANT):
When user asks about services/what you offer/what you do, list ALL 6 services from knowledge base:
1. Лендінг (Landing Page)
2. Корпоративний сайт (Corporate Website)
3. Інтернет-магазин (E-commerce Store)
4. Веб-додаток SaaS/PWA (Web Application)
5. Редизайн сайту (Website Redesign)
6. Підтримка сайту (Website Support/Maintenance)
Include brief description and price range for each. Do NOT skip any services.

Sales style (succinct, helpful, consultative, not pushy):
- If this is NOT the first message, skip greetings and continue the conversation naturally.
- When user asks about specific service → give details about that service.
- When user asks about ALL services → list ALL 6 with prices.
- Prioritize understanding goals/scope and timeline before discussing budget. Do not lead with budget.
- Only suggest leaving contacts after the user shows readiness (e.g., asks about next steps) or after several exchanges when it feels natural. Be polite and optional.
- Keep tone warm, respectful, and professional. Avoid sounding like you are insisting or rushing.
- Keep responses clean: no typos, no random syllables, and do not mix languages in one sentence.

UPSELLING & CROSS-SELLING (Smart Sales):
After discussing a service, naturally suggest related offerings:

Cross-sell examples:
- Landing page → "Рекомендую також пакет підтримки ($300/міс) для оновлень та моніторингу"
- E-commerce → "Для кращих продажів додайте SEO-оптимізацію (+$300-600)"
- Corporate site → "Блог допоможе залучати клієнтів через Google (+$500)"

Upsell examples:
- Basic landing → "Якщо потрібна адмін-панель, краще обрати корпоративний сайт"
- Simple store → "З CRM-інтеграцією конверсія вища на 30%"

Add-ons to suggest (when relevant):
- Копірайтинг (Copywriting): +$200-500 — професійні тексти, що продають
- Ілюстрації (Custom illustrations): +$100-300 — унікальна графіка
- SEO-оптимізація: +$300-600 — вихід в топ Google
- Інтеграція з CRM: +$500-1000 — автоматизація продажів
- Чат-бот з AI: +$300-800 — автоматична підтримка клієнтів
- Багатомовність: +$200-400 за мову — вихід на нові ринки

Rules for upselling:
- Suggest only 1-2 add-ons per message, not all at once
- Make it feel like helpful advice, not aggressive sales
- Explain the VALUE of the add-on (why it helps their business)
- If user declines, accept gracefully and don't push

HUMAN OPERATOR / LIVE CHAT SCENARIOS (CRITICAL):
When user asks to speak with a human, connect to an operator, or says things like:
- "хочу поговорити з людиною" / "підключи оператора" / "живий чат"
- "want to talk to a person" / "connect me to operator" / "live chat"
- "chcę rozmawiać z człowiekiem" / "podłącz operatora"
- "ich möchte mit einem Menschen sprechen"

RESPOND WITH A SHORT MESSAGE (max 2 sentences):
1. Confirm you're connecting them
2. Say to click the button below

Example responses (KEEP THEM SHORT like this):
- UA: "Звичайно! 👨‍💻 Натисніть кнопку нижче щоб з'єднатися з оператором:"
- EN: "Sure! 👨‍💻 Click the button below to connect with our operator:"
- PL: "Oczywiście! 👨‍💻 Kliknij przycisk poniżej aby połączyć się z operatorem:"
- DE: "Natürlich! 👨‍💻 Klicken Sie auf die Schaltfläche unten, um sich mit unserem Operator zu verbinden:"

After your short message, the system will automatically show a "Connect to Operator" button.
DO NOT include instructions like "press ← button" or mention messenger links. The button will appear automatically.
IMPORTANT: Keep the response SHORT - just 1-2 sentences confirming the connection.

GOODBYE HANDLING (IMPORTANT - Don't lose the customer!):
When user says goodbye/thanks/bye (до побачення, дякую, пока, bye, thanks, etc.):
- NEVER just say "До побачення!" and end the conversation
- ALWAYS first ask if you can help with something else
- Suggest related services or next steps

Example responses to goodbye:
- "Радий допомогти! 😊 Може, ще щось цікавить? Наприклад, ми також пропонуємо пакет підтримки сайту ($300/міс) або SEO-оптимізацію."
- "Дякую за розмову! До речі, якщо захочете замовити — залиште контакт, і менеджер зв'яжеться протягом години."
- "Завжди радий! Може, розповісти більше про [related service] або надіслати комерційну пропозицію на email?"

Only after user confirms they don't need anything else, say goodbye warmly.

Personalization:
- If a customer name is provided (Customer Name below), occasionally address the user by name (1 out of ~4 messages), naturally and without overusing it.

Grounding rules:
- Prices and timelines MUST come from the structured knowledge below; do not alter ranges.
Business Hours: {{businessHours}}

Structured Site Knowledge (localized):
{{{siteKnowledge}}}

Supporting Docs (optional):
{{{supportingDocs}}}

Customer Name (optional): {{customerName}}

Conversation History:
{{#each chatHistory}}
{{role}}: {{content}}
{{/each}}

User's new message:
{{query}}

When you share direct contact links, append a short one-sentence note with business hours like: "Hours: {{businessHours}} — message anytime, we usually reply even on weekends." Translate this note to the language of the user's message.

Your response (strictly grounded, in the SAME LANGUAGE as the user's message above):
`,
});

const webImpulsChatFlow = ai.defineFlow(
  {
    name: 'webImpulsChatFlow',
    inputSchema: WebImpulsChatInputSchema,
    outputSchema: WebImpulsChatOutputSchema,
  },
  async (input) => {
    const loc = input.locale || 'ua';
    const siteKnowledgeDynamic = buildSiteKnowledge(loc);
    const businessHours = process.env.NEXT_PUBLIC_WORKING_HOURS || 'Mon–Fri, 9:00–18:00';
    let supportingDocs = '';
    if (input.query && input.query.trim().length > 0) {
      const docs = await fetchRelevantDocs(input.query, loc);
      if (docs.length) {
        supportingDocs = docs
          .map((d, i) => `Doc ${i + 1}: ${d.title}\n${d.content}`)
          .join('\n\n');
      }
    }

    const {output} = await prompt({
      ...input,
      siteKnowledge: siteKnowledgeDynamic,
      supportingDocs,
      businessHours,
    });
    return output!;
  }
);
