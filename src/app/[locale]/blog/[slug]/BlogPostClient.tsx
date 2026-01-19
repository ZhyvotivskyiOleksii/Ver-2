'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WebImpulsHeader } from '@/components/layout/web-impuls-header';
import { Footer } from '@/components/layout/footer';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Copy, Check, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';

// Simple markdown to HTML parser
function parseMarkdown(markdown: string): string {
  let html = markdown
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers (must be done before other replacements)
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Paragraphs (double newlines)
    .split(/\n\n+/)
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<h') || block.startsWith('<ul')) return block;
      return `<p>${block.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');
  
  return html;
}

// Blog content with translations per locale
const blogPosts: Record<string, {
  titleKey: string;
  excerptKey: string;
  content: Record<string, string>;
  image: string;
  categoryKey: string;
  date: string;
  readTime: string;
  authorKey: string;
  authorRole: string;
  tags: string[];
}> = {
  'why-business-needs-website': {
    titleKey: 'blogPost1Title',
    excerptKey: 'blogPost1Excerpt',
    content: {
      ua: `## Введення

У сучасному цифровому світі наявність якісного веб-сайту — це не просто опція, а необхідність для будь-якого бізнесу. Ваш веб-сайт — це ваша цифрова візитка, яка працює 24/7.

## Чому це важливо?

### 1. Перше враження

Понад 75% користувачів оцінюють надійність компанії за якістю її веб-сайту. Професійний дизайн створює довіру та демонструє серйозність вашого підходу до бізнесу.

### 2. Доступність 24/7

На відміну від фізичного офісу, ваш веб-сайт доступний цілодобово. Клієнти можуть дізнатися про ваші послуги, переглянути портфоліо та зв'язатися з вами в будь-який час.

### 3. Розширення географії

Веб-сайт дозволяє виходити за межі локального ринку та залучати клієнтів з інших міст і країн.

## Ключові елементи успішного сайту

- **Адаптивний дизайн** — ваш сайт повинен виглядати ідеально на всіх пристроях
- **Швидке завантаження** — користувачі не чекають більше 3 секунд
- **Зрозуміла навігація** — відвідувачі повинні легко знаходити потрібну інформацію
- **Заклики до дії** — чіткі CTA кнопки, що спрямовують до конверсії

## Висновок

Інвестиція у якісний веб-сайт — це інвестиція у майбутнє вашого бізнесу. Не відкладайте цей крок — почніть трансформацію вже сьогодні.`,
      en: `## Introduction

In today's digital world, having a quality website is not just an option, but a necessity for any business. Your website is your digital business card that works 24/7.

## Why is this important?

### 1. First Impression

Over 75% of users judge a company's credibility by the quality of its website. Professional design builds trust and demonstrates the seriousness of your approach to business.

### 2. 24/7 Availability

Unlike a physical office, your website is available around the clock. Customers can learn about your services, view your portfolio, and contact you at any time.

### 3. Geographic Expansion

A website allows you to go beyond the local market and attract customers from other cities and countries.

## Key Elements of a Successful Website

- **Responsive design** — your site should look perfect on all devices
- **Fast loading** — users don't wait more than 3 seconds
- **Clear navigation** — visitors should easily find the information they need
- **Calls to action** — clear CTA buttons that guide to conversion

## Conclusion

Investing in a quality website is an investment in the future of your business. Don't delay this step — start your transformation today.`,
      pl: `## Wprowadzenie

We współczesnym cyfrowym świecie posiadanie wysokiej jakości strony internetowej to nie tylko opcja, ale konieczność dla każdego biznesu. Twoja strona to Twoja cyfrowa wizytówka, która pracuje 24/7.

## Dlaczego to ważne?

### 1. Pierwsze wrażenie

Ponad 75% użytkowników ocenia wiarygodność firmy na podstawie jakości jej strony internetowej. Profesjonalny design buduje zaufanie i pokazuje powagę Twojego podejścia do biznesu.

### 2. Dostępność 24/7

W przeciwieństwie do fizycznego biura, Twoja strona jest dostępna przez całą dobę. Klienci mogą poznać Twoje usługi, przejrzeć portfolio i skontaktować się z Tobą o każdej porze.

### 3. Ekspansja geograficzna

Strona internetowa pozwala wyjść poza lokalny rynek i przyciągać klientów z innych miast i krajów.

## Kluczowe elementy skutecznej strony

- **Responsywny design** — Twoja strona powinna wyglądać idealnie na wszystkich urządzeniach
- **Szybkie ładowanie** — użytkownicy nie czekają dłużej niż 3 sekundy
- **Przejrzysta nawigacja** — odwiedzający powinni łatwo znajdować potrzebne informacje
- **Wezwania do działania** — wyraźne przyciski CTA prowadzące do konwersji

## Podsumowanie

Inwestycja w wysokiej jakości stronę to inwestycja w przyszłość Twojego biznesu. Nie odkładaj tego kroku — rozpocznij transformację już dziś.`,
      de: `## Einführung

In der heutigen digitalen Welt ist eine qualitativ hochwertige Website nicht nur eine Option, sondern eine Notwendigkeit für jedes Unternehmen. Ihre Website ist Ihre digitale Visitenkarte, die rund um die Uhr arbeitet.

## Warum ist das wichtig?

### 1. Der erste Eindruck

Über 75% der Nutzer beurteilen die Glaubwürdigkeit eines Unternehmens anhand der Qualität seiner Website. Professionelles Design schafft Vertrauen und zeigt die Ernsthaftigkeit Ihres Geschäftsansatzes.

### 2. Verfügbarkeit rund um die Uhr

Im Gegensatz zu einem physischen Büro ist Ihre Website rund um die Uhr verfügbar. Kunden können sich über Ihre Dienstleistungen informieren, Ihr Portfolio ansehen und Sie jederzeit kontaktieren.

### 3. Geografische Expansion

Eine Website ermöglicht es Ihnen, über den lokalen Markt hinauszugehen und Kunden aus anderen Städten und Ländern anzuziehen.

## Schlüsselelemente einer erfolgreichen Website

- **Responsives Design** — Ihre Website sollte auf allen Geräten perfekt aussehen
- **Schnelles Laden** — Benutzer warten nicht länger als 3 Sekunden
- **Klare Navigation** — Besucher sollten die benötigten Informationen leicht finden
- **Handlungsaufforderungen** — klare CTA-Buttons, die zur Konversion führen

## Fazit

Die Investition in eine qualitativ hochwertige Website ist eine Investition in die Zukunft Ihres Unternehmens. Verschieben Sie diesen Schritt nicht — beginnen Sie Ihre Transformation noch heute.`,
    },
    image: '/blog/1.svg',
    categoryKey: 'categoryBusiness',
    date: '2025-01-15',
    readTime: '5',
    authorKey: 'Admin',
    authorRole: 'Web Impuls Team',
    tags: ['web', 'business', 'marketing', 'digital'],
  },
  'responsive-design-importance': {
    titleKey: 'blogPost2Title',
    excerptKey: 'blogPost2Excerpt',
    content: {
      ua: `## Мобільна революція

Сьогодні більше половини всього інтернет-трафіку припадає на мобільні пристрої. Якщо ваш сайт не адаптований для смартфонів та планшетів — ви втрачаєте клієнтів.

## Що таке адаптивний дизайн?

Адаптивний (responsive) дизайн — це підхід до веб-розробки, при якому сайт автоматично підлаштовується під розмір екрану пристрою користувача.

## Переваги адаптивного дизайну

### SEO

Google використовує mobile-first індексацію. Це означає, що пошукова система спочатку оцінює мобільну версію вашого сайту.

### Конверсія

Сайти з хорошим мобільним досвідом мають на 67% вищу конверсію порівняно з неадаптованими.

### Користувацький досвід

Зручний мобільний сайт = задоволені клієнти = повторні покупки.

## Висновок

Адаптивний дизайн — це не тренд, а стандарт сучасної веб-розробки.`,
      en: `## Mobile Revolution

Today, more than half of all internet traffic comes from mobile devices. If your site is not adapted for smartphones and tablets — you are losing customers.

## What is Responsive Design?

Responsive design is an approach to web development where the site automatically adjusts to the screen size of the user's device.

## Benefits of Responsive Design

### SEO

Google uses mobile-first indexing. This means the search engine first evaluates the mobile version of your site.

### Conversion

Sites with good mobile experience have 67% higher conversion compared to non-adapted ones.

### User Experience

Convenient mobile site = satisfied customers = repeat purchases.

## Conclusion

Responsive design is not a trend, but a standard of modern web development.`,
      pl: `## Rewolucja mobilna

Dziś ponad połowa całego ruchu internetowego pochodzi z urządzeń mobilnych. Jeśli Twoja strona nie jest dostosowana do smartfonów i tabletów — tracisz klientów.

## Czym jest responsywny design?

Responsywny design to podejście do tworzenia stron, w którym strona automatycznie dostosowuje się do rozmiaru ekranu urządzenia użytkownika.

## Zalety responsywnego designu

### SEO

Google stosuje indeksowanie mobile-first. Oznacza to, że wyszukiwarka najpierw ocenia mobilną wersję Twojej strony.

### Konwersja

Strony z dobrym doświadczeniem mobilnym mają o 67% wyższą konwersję w porównaniu do niedostosowanych.

### Doświadczenie użytkownika

Wygodna strona mobilna = zadowoleni klienci = powtórne zakupy.

## Podsumowanie

Responsywny design to nie trend, ale standard nowoczesnego tworzenia stron.`,
      de: `## Mobile Revolution

Heute kommt mehr als die Hälfte des gesamten Internetverkehrs von mobilen Geräten. Wenn Ihre Website nicht für Smartphones und Tablets angepasst ist — verlieren Sie Kunden.

## Was ist Responsives Design?

Responsives Design ist ein Ansatz in der Webentwicklung, bei dem sich die Website automatisch an die Bildschirmgröße des Benutzergeräts anpasst.

## Vorteile von Responsivem Design

### SEO

Google verwendet Mobile-First-Indexierung. Das bedeutet, dass die Suchmaschine zuerst die mobile Version Ihrer Website bewertet.

### Konversion

Websites mit guter mobiler Erfahrung haben eine um 67% höhere Konversion im Vergleich zu nicht angepassten.

### Benutzererfahrung

Bequeme mobile Website = zufriedene Kunden = Wiederholungskäufe.

## Fazit

Responsives Design ist kein Trend, sondern ein Standard der modernen Webentwicklung.`,
    },
    image: '/blog/2.svg',
    categoryKey: 'categoryDesign',
    date: '2025-01-10',
    readTime: '4',
    authorKey: 'Manager',
    authorRole: 'Project Manager',
    tags: ['design', 'UX', 'mobile', 'responsive'],
  },
  'seo-marketing-strategy': {
    titleKey: 'blogPost3Title',
    excerptKey: 'blogPost3Excerpt',
    content: {
      ua: `## Вступ до SEO

SEO (Search Engine Optimization) — це комплекс заходів для покращення позицій сайту в пошукових системах.

## Базові SEO стратегії

### 1. Ключові слова

Дослідіть, що шукають ваші потенційні клієнти, та оптимізуйте контент під ці запити.

### 2. Технічна оптимізація

- Швидкість завантаження
- Адаптивний дизайн
- HTTPS протокол
- Правильна структура URL

### 3. Контент-маркетинг

Регулярно публікуйте корисний контент, який відповідає на питання вашої аудиторії.

### 4. Локальне SEO

Для локального бізнесу критично важливо оптимізувати Google My Business та локальні ключові слова.

## Висновок

SEO — це марафон, а не спринт. Послідовна робота над оптимізацією принесе стабільний органічний трафік.`,
      en: `## Introduction to SEO

SEO (Search Engine Optimization) is a set of measures to improve website positions in search engines.

## Basic SEO Strategies

### 1. Keywords

Research what your potential customers are searching for and optimize content for these queries.

### 2. Technical Optimization

- Loading speed
- Responsive design
- HTTPS protocol
- Proper URL structure

### 3. Content Marketing

Regularly publish useful content that answers your audience's questions.

### 4. Local SEO

For local business, it's critical to optimize Google My Business and local keywords.

## Conclusion

SEO is a marathon, not a sprint. Consistent optimization work will bring stable organic traffic.`,
      pl: `## Wprowadzenie do SEO

SEO (Search Engine Optimization) to zestaw działań mających na celu poprawę pozycji strony w wyszukiwarkach.

## Podstawowe strategie SEO

### 1. Słowa kluczowe

Zbadaj, czego szukają Twoi potencjalni klienci i optymalizuj treści pod te zapytania.

### 2. Optymalizacja techniczna

- Szybkość ładowania
- Responsywny design
- Protokół HTTPS
- Prawidłowa struktura URL

### 3. Content marketing

Regularnie publikuj przydatne treści odpowiadające na pytania Twojej grupy docelowej.

### 4. Lokalne SEO

Dla lokalnego biznesu kluczowa jest optymalizacja Google My Business i lokalnych słów kluczowych.

## Podsumowanie

SEO to maraton, nie sprint. Konsekwentna praca nad optymalizacją przyniesie stabilny ruch organiczny.`,
      de: `## Einführung in SEO

SEO (Suchmaschinenoptimierung) ist eine Reihe von Maßnahmen zur Verbesserung der Website-Positionen in Suchmaschinen.

## Grundlegende SEO-Strategien

### 1. Schlüsselwörter

Recherchieren Sie, wonach Ihre potenziellen Kunden suchen, und optimieren Sie Inhalte für diese Anfragen.

### 2. Technische Optimierung

- Ladegeschwindigkeit
- Responsives Design
- HTTPS-Protokoll
- Richtige URL-Struktur

### 3. Content-Marketing

Veröffentlichen Sie regelmäßig nützliche Inhalte, die die Fragen Ihrer Zielgruppe beantworten.

### 4. Lokales SEO

Für lokale Unternehmen ist es entscheidend, Google My Business und lokale Schlüsselwörter zu optimieren.

## Fazit

SEO ist ein Marathon, kein Sprint. Konsequente Optimierungsarbeit wird stabilen organischen Traffic bringen.`,
    },
    image: '/blog/3.svg',
    categoryKey: 'categorySEO',
    date: '2025-01-05',
    readTime: '7',
    authorKey: 'Marketer',
    authorRole: 'Marketing Team',
    tags: ['SEO', 'marketing', 'Google', 'optimization'],
  },
  'web-performance-optimization': {
    titleKey: 'blogPost4Title',
    excerptKey: 'blogPost4Excerpt',
    content: {
      ua: `## Чому швидкість сайту критично важлива

Швидкість завантаження веб-сайту — один з ключових факторів успіху вашого онлайн-бізнесу. За статистикою, 53% мобільних користувачів покидають сайт, якщо він завантажується більше 3 секунд.

## Вплив на бізнес-показники

### Конверсія та продажі

Кожна секунда затримки знижує конверсію на 7%. Для інтернет-магазину з оборотом 100,000$ на місяць це означає втрату 7,000$ щомісяця.

### SEO та позиції в Google

Google офіційно використовує Core Web Vitals як фактор ранжування. Повільний сайт = нижчі позиції в пошуку = менше органічного трафіку.

### Користувацький досвід

Швидкий сайт створює позитивне враження про ваш бренд та підвищує лояльність клієнтів.

## Як оптимізувати швидкість сайту

### 1. Оптимізація зображень

- Використовуйте сучасні формати (WebP, AVIF)
- Стискайте зображення без втрати якості
- Впроваджуйте lazy loading

### 2. Мінімізація коду

- Мініфікуйте CSS та JavaScript
- Видаляйте невикористаний код
- Об'єднуйте файли для зменшення запитів

### 3. Кешування

- Налаштуйте браузерний кеш
- Використовуйте CDN для статичних файлів
- Впровадьте серверний кеш

### 4. Хостинг

Обирайте якісний хостинг з SSD-накопичувачами та швидким процесором.

## Інструменти для тестування

- **Google PageSpeed Insights** — безкоштовний аналіз від Google
- **GTmetrix** — детальний звіт про продуктивність
- **WebPageTest** — тестування з різних локацій

## Висновок

Інвестиція в оптимізацію швидкості сайту окупається збільшенням конверсії, покращенням SEO-позицій та задоволеністю користувачів.`,
      en: `## Why Website Speed is Critical

Website loading speed is one of the key factors for your online business success. According to statistics, 53% of mobile users leave a site if it takes more than 3 seconds to load.

## Impact on Business Metrics

### Conversion and Sales

Every second of delay reduces conversion by 7%. For an online store with a turnover of $100,000 per month, this means a loss of $7,000 monthly.

### SEO and Google Rankings

Google officially uses Core Web Vitals as a ranking factor. Slow site = lower search positions = less organic traffic.

### User Experience

A fast site creates a positive impression of your brand and increases customer loyalty.

## How to Optimize Website Speed

### 1. Image Optimization

- Use modern formats (WebP, AVIF)
- Compress images without quality loss
- Implement lazy loading

### 2. Code Minimization

- Minify CSS and JavaScript
- Remove unused code
- Combine files to reduce requests

### 3. Caching

- Set up browser cache
- Use CDN for static files
- Implement server cache

### 4. Hosting

Choose quality hosting with SSD drives and fast processor.

## Testing Tools

- **Google PageSpeed Insights** — free analysis from Google
- **GTmetrix** — detailed performance report
- **WebPageTest** — testing from different locations

## Conclusion

Investment in website speed optimization pays off with increased conversion, improved SEO positions, and user satisfaction.`,
      pl: `## Dlaczego szybkość strony jest krytyczna

Szybkość ładowania strony internetowej to jeden z kluczowych czynników sukcesu Twojego biznesu online. Według statystyk 53% użytkowników mobilnych opuszcza stronę, jeśli ładuje się dłużej niż 3 sekundy.

## Wpływ na wskaźniki biznesowe

### Konwersja i sprzedaż

Każda sekunda opóźnienia zmniejsza konwersję o 7%. Dla sklepu internetowego z obrotem 100 000$ miesięcznie oznacza to stratę 7 000$ miesięcznie.

### SEO i pozycje w Google

Google oficjalnie używa Core Web Vitals jako czynnika rankingowego. Wolna strona = niższe pozycje w wyszukiwarce = mniej ruchu organicznego.

### Doświadczenie użytkownika

Szybka strona tworzy pozytywne wrażenie o Twojej marce i zwiększa lojalność klientów.

## Jak zoptymalizować szybkość strony

### 1. Optymalizacja obrazów

- Używaj nowoczesnych formatów (WebP, AVIF)
- Kompresuj obrazy bez utraty jakości
- Wdrażaj lazy loading

### 2. Minimalizacja kodu

- Minifikuj CSS i JavaScript
- Usuwaj nieużywany kod
- Łącz pliki, aby zmniejszyć liczbę zapytań

### 3. Cachowanie

- Skonfiguruj cache przeglądarki
- Używaj CDN dla plików statycznych
- Wdrożyć cache serwera

### 4. Hosting

Wybieraj jakościowy hosting z dyskami SSD i szybkim procesorem.

## Narzędzia do testowania

- **Google PageSpeed Insights** — bezpłatna analiza od Google
- **GTmetrix** — szczegółowy raport wydajności
- **WebPageTest** — testowanie z różnych lokalizacji

## Podsumowanie

Inwestycja w optymalizację szybkości strony zwraca się zwiększoną konwersją, lepszymi pozycjami SEO i zadowoleniem użytkowników.`,
      de: `## Warum Website-Geschwindigkeit entscheidend ist

Die Ladegeschwindigkeit einer Website ist einer der Schlüsselfaktoren für den Erfolg Ihres Online-Geschäfts. Laut Statistik verlassen 53% der mobilen Nutzer eine Website, wenn sie länger als 3 Sekunden zum Laden braucht.

## Auswirkungen auf Geschäftskennzahlen

### Konversion und Verkauf

Jede Sekunde Verzögerung reduziert die Konversion um 7%. Für einen Online-Shop mit einem Umsatz von 100.000$ pro Monat bedeutet dies einen Verlust von 7.000$ monatlich.

### SEO und Google-Rankings

Google verwendet offiziell Core Web Vitals als Ranking-Faktor. Langsame Website = niedrigere Suchpositionen = weniger organischer Traffic.

### Benutzererfahrung

Eine schnelle Website schafft einen positiven Eindruck Ihrer Marke und erhöht die Kundenloyalität.

## Wie Sie die Website-Geschwindigkeit optimieren

### 1. Bildoptimierung

- Verwenden Sie moderne Formate (WebP, AVIF)
- Komprimieren Sie Bilder ohne Qualitätsverlust
- Implementieren Sie Lazy Loading

### 2. Code-Minimierung

- Minifizieren Sie CSS und JavaScript
- Entfernen Sie ungenutzten Code
- Kombinieren Sie Dateien, um Anfragen zu reduzieren

### 3. Caching

- Richten Sie Browser-Cache ein
- Verwenden Sie CDN für statische Dateien
- Implementieren Sie Server-Cache

### 4. Hosting

Wählen Sie qualitativ hochwertiges Hosting mit SSD-Laufwerken und schnellem Prozessor.

## Testing-Tools

- **Google PageSpeed Insights** — kostenlose Analyse von Google
- **GTmetrix** — detaillierter Leistungsbericht
- **WebPageTest** — Tests von verschiedenen Standorten

## Fazit

Die Investition in die Website-Geschwindigkeitsoptimierung zahlt sich durch erhöhte Konversion, verbesserte SEO-Positionen und Benutzerzufriedenheit aus.`,
    },
    image: '/blog/4.svg',
    categoryKey: 'categoryDevelopment',
    date: '2024-12-28',
    readTime: '8',
    authorKey: 'Developer',
    authorRole: 'Tech Lead',
    tags: ['performance', 'optimization', 'speed', 'Core Web Vitals'],
  },
  'ecommerce-trends-2025': {
    titleKey: 'blogPost5Title',
    excerptKey: 'blogPost5Excerpt',
    content: {
      ua: `## Електронна комерція у 2025 році

Ринок e-commerce продовжує стрімко зростати. У 2025 році очікується, що глобальні онлайн-продажі досягнуть 7.4 трильйона доларів. Розглянемо ключові тренди.

## Головні тренди e-commerce

### 1. Штучний інтелект та персоналізація

AI революціонізує онлайн-торгівлю:
- **Персональні рекомендації** — алгоритми аналізують поведінку та пропонують релевантні товари
- **AI-чат-боти** — цілодобова підтримка клієнтів
- **Динамічне ціноутворення** — автоматичне коригування цін залежно від попиту

### 2. Мобільна комерція (M-commerce)

Понад 70% покупок здійснюються з мобільних пристроїв. Обов'язкові елементи:
- PWA (Progressive Web Apps)
- Мобільні платежі (Apple Pay, Google Pay)
- Спрощений checkout для мобільних

### 3. Соціальна комерція

Продажі через соціальні мережі зростають на 30% щорічно:
- Instagram Shopping
- TikTok Shop
- Facebook Marketplace

### 4. Підписочна модель

Все більше бізнесів переходять на підписочну модель для стабільного доходу та лояльності клієнтів.

### 5. Сталий розвиток

Екологічна відповідальність стає важливим фактором вибору:
- Екологічна упаковка
- Локальні виробники
- Прозорість ланцюга постачання

## Технології для успішного інтернет-магазину

- **Headless e-commerce** — гнучкість та швидкість
- **Омніканальність** — єдиний досвід онлайн та офлайн
- **AR/VR** — віртуальна примірка товарів

## Висновок

Успіх в e-commerce 2025 вимагає адаптації до нових технологій та очікувань клієнтів. Інвестуйте в персоналізацію, мобільний досвід та інновації.`,
      en: `## E-commerce in 2025

The e-commerce market continues to grow rapidly. In 2025, global online sales are expected to reach $7.4 trillion. Let's look at the key trends.

## Main E-commerce Trends

### 1. Artificial Intelligence and Personalization

AI is revolutionizing online commerce:
- **Personal recommendations** — algorithms analyze behavior and suggest relevant products
- **AI chatbots** — 24/7 customer support
- **Dynamic pricing** — automatic price adjustments based on demand

### 2. Mobile Commerce (M-commerce)

Over 70% of purchases are made from mobile devices. Essential elements:
- PWA (Progressive Web Apps)
- Mobile payments (Apple Pay, Google Pay)
- Simplified mobile checkout

### 3. Social Commerce

Sales through social networks grow by 30% annually:
- Instagram Shopping
- TikTok Shop
- Facebook Marketplace

### 4. Subscription Model

More businesses are moving to subscription models for stable revenue and customer loyalty.

### 5. Sustainability

Environmental responsibility becomes an important choice factor:
- Eco-friendly packaging
- Local manufacturers
- Supply chain transparency

## Technologies for a Successful Online Store

- **Headless e-commerce** — flexibility and speed
- **Omnichannel** — unified online and offline experience
- **AR/VR** — virtual product try-on

## Conclusion

Success in e-commerce 2025 requires adaptation to new technologies and customer expectations. Invest in personalization, mobile experience, and innovation.`,
      pl: `## E-commerce w 2025 roku

Rynek e-commerce nadal dynamicznie rośnie. W 2025 roku oczekuje się, że globalna sprzedaż online osiągnie 7,4 biliona dolarów. Przyjrzyjmy się kluczowym trendom.

## Główne trendy e-commerce

### 1. Sztuczna inteligencja i personalizacja

AI rewolucjonizuje handel online:
- **Osobiste rekomendacje** — algorytmy analizują zachowanie i sugerują odpowiednie produkty
- **AI chatboty** — całodobowa obsługa klienta
- **Dynamiczne ceny** — automatyczne dostosowanie cen w zależności od popytu

### 2. Handel mobilny (M-commerce)

Ponad 70% zakupów odbywa się z urządzeń mobilnych. Niezbędne elementy:
- PWA (Progressive Web Apps)
- Płatności mobilne (Apple Pay, Google Pay)
- Uproszczony mobilny checkout

### 3. Social commerce

Sprzedaż przez sieci społecznościowe rośnie o 30% rocznie:
- Instagram Shopping
- TikTok Shop
- Facebook Marketplace

### 4. Model subskrypcyjny

Coraz więcej firm przechodzi na model subskrypcyjny dla stabilnych przychodów i lojalności klientów.

### 5. Zrównoważony rozwój

Odpowiedzialność ekologiczna staje się ważnym czynnikiem wyboru:
- Ekologiczne opakowania
- Lokalni producenci
- Przejrzystość łańcucha dostaw

## Technologie dla udanego sklepu internetowego

- **Headless e-commerce** — elastyczność i szybkość
- **Omnichannel** — jednolite doświadczenie online i offline
- **AR/VR** — wirtualne przymierzanie produktów

## Podsumowanie

Sukces w e-commerce 2025 wymaga adaptacji do nowych technologii i oczekiwań klientów. Inwestuj w personalizację, doświadczenie mobilne i innowacje.`,
      de: `## E-Commerce im Jahr 2025

Der E-Commerce-Markt wächst weiterhin rasant. Im Jahr 2025 werden die globalen Online-Verkäufe voraussichtlich 7,4 Billionen Dollar erreichen. Schauen wir uns die wichtigsten Trends an.

## Wichtigste E-Commerce-Trends

### 1. Künstliche Intelligenz und Personalisierung

KI revolutioniert den Online-Handel:
- **Persönliche Empfehlungen** — Algorithmen analysieren das Verhalten und schlagen relevante Produkte vor
- **KI-Chatbots** — 24/7 Kundenbetreuung
- **Dynamische Preisgestaltung** — automatische Preisanpassungen basierend auf der Nachfrage

### 2. Mobile Commerce (M-Commerce)

Über 70% der Einkäufe werden von mobilen Geräten getätigt. Wesentliche Elemente:
- PWA (Progressive Web Apps)
- Mobile Zahlungen (Apple Pay, Google Pay)
- Vereinfachter mobiler Checkout

### 3. Social Commerce

Verkäufe über soziale Netzwerke wachsen jährlich um 30%:
- Instagram Shopping
- TikTok Shop
- Facebook Marketplace

### 4. Abonnement-Modell

Immer mehr Unternehmen wechseln zu Abonnement-Modellen für stabile Einnahmen und Kundenloyalität.

### 5. Nachhaltigkeit

Umweltverantwortung wird zu einem wichtigen Auswahlfaktor:
- Umweltfreundliche Verpackung
- Lokale Hersteller
- Transparenz der Lieferkette

## Technologien für einen erfolgreichen Online-Shop

- **Headless E-Commerce** — Flexibilität und Geschwindigkeit
- **Omnichannel** — einheitliches Online- und Offline-Erlebnis
- **AR/VR** — virtuelle Produktanprobe

## Fazit

Erfolg im E-Commerce 2025 erfordert die Anpassung an neue Technologien und Kundenerwartungen. Investieren Sie in Personalisierung, mobiles Erlebnis und Innovation.`,
    },
    image: '/blog/5.svg',
    categoryKey: 'categoryEcommerce',
    date: '2024-12-20',
    readTime: '6',
    authorKey: 'Analyst',
    authorRole: 'Business Analyst',
    tags: ['e-commerce', 'trends', 'AI', 'mobile commerce'],
  },
  'ui-ux-best-practices': {
    titleKey: 'blogPost6Title',
    excerptKey: 'blogPost6Excerpt',
    content: {
      ua: `## UI/UX дизайн для конверсії

Якісний UI/UX дизайн — це не лише про естетику. Це інструмент, який безпосередньо впливає на продажі та успіх вашого бізнесу.

## Основи ефективного UX дизайну

### 1. Простота та зрозумілість

Правило 3 секунд: користувач повинен зрозуміти, що пропонує сайт, за 3 секунди.

- Чітка ієрархія інформації
- Мінімалістичний дизайн
- Зрозумілі заголовки

### 2. Інтуїтивна навігація

Користувач повинен знаходити потрібну інформацію максимум за 3 кліки:

- Логічна структура меню
- Хлібні крихти для орієнтації
- Видимий пошук

### 3. Заклики до дії (CTA)

Ефективні CTA кнопки підвищують конверсію на 80%:

- Контрастний колір
- Чіткий текст дії ("Замовити зараз", "Отримати консультацію")
- Правильне розміщення

## UI елементи, що збільшують довіру

### Соціальні докази

- Відгуки клієнтів
- Кейси та портфоліо
- Логотипи партнерів

### Безпека

- SSL сертифікат (HTTPS)
- Іконки безпечної оплати
- Політика конфіденційності

## Оптимізація форм

Форми — критична точка конверсії:

- Мінімум полів (тільки необхідні)
- Підказки та автозаповнення
- Валідація в реальному часі
- Прогрес-бар для довгих форм

## Мобільний UX

- Великі кнопки (мінімум 44x44 пікселі)
- Достатній відступ між елементами
- Вертикальна орієнтація контенту

## A/B тестування

Регулярно тестуйте різні варіанти:
- Кольори кнопок
- Тексти CTA
- Розміщення елементів
- Зображення

## Висновок

Інвестиція в UI/UX дизайн — це інвестиція в конверсію. Кожне покращення користувацького досвіду напряму впливає на ваші продажі.`,
      en: `## UI/UX Design for Conversion

Quality UI/UX design is not just about aesthetics. It's a tool that directly impacts your sales and business success.

## Fundamentals of Effective UX Design

### 1. Simplicity and Clarity

The 3-second rule: users should understand what the site offers within 3 seconds.

- Clear information hierarchy
- Minimalist design
- Clear headlines

### 2. Intuitive Navigation

Users should find the needed information in maximum 3 clicks:

- Logical menu structure
- Breadcrumbs for orientation
- Visible search

### 3. Calls to Action (CTA)

Effective CTA buttons increase conversion by 80%:

- Contrasting color
- Clear action text ("Order now", "Get consultation")
- Proper placement

## UI Elements That Build Trust

### Social Proof

- Customer reviews
- Cases and portfolio
- Partner logos

### Security

- SSL certificate (HTTPS)
- Secure payment icons
- Privacy policy

## Form Optimization

Forms are a critical conversion point:

- Minimum fields (only necessary)
- Hints and autofill
- Real-time validation
- Progress bar for long forms

## Mobile UX

- Large buttons (minimum 44x44 pixels)
- Sufficient spacing between elements
- Vertical content orientation

## A/B Testing

Regularly test different variants:
- Button colors
- CTA texts
- Element placement
- Images

## Conclusion

Investment in UI/UX design is an investment in conversion. Every improvement in user experience directly impacts your sales.`,
      pl: `## UI/UX Design dla konwersji

Jakościowy UI/UX design to nie tylko estetyka. To narzędzie, które bezpośrednio wpływa na Twoją sprzedaż i sukces biznesowy.

## Podstawy efektywnego UX designu

### 1. Prostota i przejrzystość

Zasada 3 sekund: użytkownik powinien zrozumieć, co oferuje strona, w ciągu 3 sekund.

- Jasna hierarchia informacji
- Minimalistyczny design
- Zrozumiałe nagłówki

### 2. Intuicyjna nawigacja

Użytkownik powinien znaleźć potrzebne informacje maksymalnie w 3 kliknięciach:

- Logiczna struktura menu
- Breadcrumbs do orientacji
- Widoczna wyszukiwarka

### 3. Wezwania do działania (CTA)

Skuteczne przyciski CTA zwiększają konwersję o 80%:

- Kontrastowy kolor
- Jasny tekst akcji ("Zamów teraz", "Uzyskaj konsultację")
- Właściwe umiejscowienie

## Elementy UI budujące zaufanie

### Dowody społeczne

- Opinie klientów
- Case studies i portfolio
- Logotypy partnerów

### Bezpieczeństwo

- Certyfikat SSL (HTTPS)
- Ikony bezpiecznej płatności
- Polityka prywatności

## Optymalizacja formularzy

Formularze to krytyczny punkt konwersji:

- Minimum pól (tylko niezbędne)
- Podpowiedzi i autouzupełnianie
- Walidacja w czasie rzeczywistym
- Pasek postępu dla długich formularzy

## Mobilny UX

- Duże przyciski (minimum 44x44 pikseli)
- Wystarczające odstępy między elementami
- Pionowa orientacja treści

## Testy A/B

Regularnie testuj różne warianty:
- Kolory przycisków
- Teksty CTA
- Rozmieszczenie elementów
- Obrazy

## Podsumowanie

Inwestycja w UI/UX design to inwestycja w konwersję. Każde ulepszenie doświadczenia użytkownika bezpośrednio wpływa na Twoją sprzedaż.`,
      de: `## UI/UX Design für Konversion

Hochwertiges UI/UX Design ist nicht nur Ästhetik. Es ist ein Werkzeug, das direkt Ihre Verkäufe und Ihren Geschäftserfolg beeinflusst.

## Grundlagen des effektiven UX Designs

### 1. Einfachheit und Klarheit

Die 3-Sekunden-Regel: Benutzer sollten innerhalb von 3 Sekunden verstehen, was die Website bietet.

- Klare Informationshierarchie
- Minimalistisches Design
- Klare Überschriften

### 2. Intuitive Navigation

Benutzer sollten die benötigten Informationen in maximal 3 Klicks finden:

- Logische Menüstruktur
- Breadcrumbs zur Orientierung
- Sichtbare Suche

### 3. Handlungsaufforderungen (CTA)

Effektive CTA-Buttons erhöhen die Konversion um 80%:

- Kontrastfarbe
- Klarer Aktionstext ("Jetzt bestellen", "Beratung erhalten")
- Richtige Platzierung

## UI-Elemente, die Vertrauen schaffen

### Soziale Beweise

- Kundenbewertungen
- Fallstudien und Portfolio
- Partner-Logos

### Sicherheit

- SSL-Zertifikat (HTTPS)
- Sichere Zahlungssymbole
- Datenschutzrichtlinie

## Formularoptimierung

Formulare sind ein kritischer Konversionspunkt:

- Minimale Felder (nur notwendige)
- Hinweise und Autovervollständigung
- Echtzeit-Validierung
- Fortschrittsbalken für lange Formulare

## Mobile UX

- Große Buttons (mindestens 44x44 Pixel)
- Ausreichender Abstand zwischen Elementen
- Vertikale Inhaltsausrichtung

## A/B-Testing

Testen Sie regelmäßig verschiedene Varianten:
- Button-Farben
- CTA-Texte
- Element-Platzierung
- Bilder

## Fazit

Investition in UI/UX Design ist eine Investition in Konversion. Jede Verbesserung der Benutzererfahrung wirkt sich direkt auf Ihre Verkäufe aus.`,
    },
    image: '/blog/6.svg',
    categoryKey: 'categoryDesign',
    date: '2024-12-15',
    readTime: '5',
    authorKey: 'Designer',
    authorRole: 'UX Designer',
    tags: ['UI', 'UX', 'conversion', 'design'],
  },
};

export default function BlogPostClient() {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const params = useParams();
  const locale = params.locale as string;
  const slug = params.slug as string;
  const t = (translations as any)[locale] || translations.ua;

  const postData = blogPosts[slug];
  
  // Build post with translated data
  const post = postData ? {
    ...postData,
    title: t[postData.titleKey] || postData.titleKey,
    excerpt: t[postData.excerptKey] || postData.excerptKey,
    category: t[postData.categoryKey] || postData.categoryKey,
    content: postData.content[locale] || postData.content.ua,
    readTimeFormatted: `${postData.readTime} ${t.blogMinRead}`,
    author: {
      name: postData.authorKey,
      role: postData.authorRole,
    }
  } : null;

  useEffect(() => {
    // Set current URL for share buttons (client-side only)
    setCurrentUrl(window.location.href);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!post) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <WebImpulsHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t.blogPostNotFound}</h1>
            <p className="text-muted-foreground mb-8">{t.blogPostNotFoundDesc}</p>
            <Link href={`/${locale}/blog`}>
              <Button>{t.blogBackButton}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <WebImpulsHeader />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-end overflow-hidden pt-[var(--header-height)]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image})` }}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
            {/* Fog transition to background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="container relative z-10 py-16 text-center md:text-left">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center md:justify-start"
            >
              <Link 
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.blogBackToBlog}
              </Link>
            </motion.div>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6"
            >
              <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'pl' ? 'pl-PL' : 'uk-UA', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-2 text-white/80">
                <Clock className="w-4 h-4" />
                {post.readTimeFormatted} {t.blogReading}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight max-w-4xl text-white"
            >
              {post.title}
            </motion.h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container">
            <div className="grid lg:grid-cols-[1fr_300px] gap-12">
              {/* Article */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-li:text-muted-foreground
                  prose-strong:text-foreground
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              >
                <p className="text-xl text-foreground font-medium !mt-0">
                  {post.excerpt}
                </p>
                
                <div dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} />
              </motion.article>

              {/* Sidebar */}
              <aside className="space-y-8">
                {/* Author */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border/50 shadow-lg shadow-slate-100 dark:shadow-none"
                >
                  <h3 className="text-sm font-medium text-slate-500 dark:text-muted-foreground mb-4">{t.blogAuthor}</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                      {post.author.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-foreground">{post.author.name}</div>
                      <div className="text-sm text-slate-500 dark:text-muted-foreground">{post.author.role}</div>
                    </div>
                  </div>
                </motion.div>

                {/* Share */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border/50 shadow-lg shadow-slate-100 dark:shadow-none"
                >
                  <h3 className="text-sm font-medium text-slate-500 dark:text-muted-foreground mb-4">{t.blogShare}</h3>
                  <div className="flex items-center gap-3">
                    <a 
                      href={currentUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                      href={currentUrl ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a 
                      href={currentUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <button 
                      onClick={copyLink}
                      className="w-10 h-10 rounded-full bg-slate-100 dark:bg-muted flex items-center justify-center text-slate-600 dark:text-foreground hover:bg-slate-200 dark:hover:bg-muted/80 transition-colors"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border/50 shadow-lg shadow-slate-100 dark:shadow-none"
                >
                  <h3 className="text-sm font-medium text-slate-500 dark:text-muted-foreground mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {t.blogTags}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-muted/50 text-sm text-slate-600 dark:text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </aside>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-transparent dark:via-transparent dark:to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-violet-500/5 to-cyan-500/5 dark:from-primary/10 dark:via-violet-500/10 dark:to-cyan-500/10" />
          <div className="container relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-foreground">
                {t.blogCTATitle}
              </h2>
              <p className="text-slate-600 dark:text-muted-foreground mb-8 max-w-xl mx-auto">
                {t.blogCTADesc}
              </p>
              <Link href={`/${locale}/contact`}>
                <Button size="lg" className="hero-cta-primary text-lg">
                  {t.blogCTAButton}
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
