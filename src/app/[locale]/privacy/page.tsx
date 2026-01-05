'use client';

import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';
import { WebImpulsHeader } from '@/components/layout/web-impuls-header';
import { Footer } from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail, Clock, FileText, AlertTriangle, Settings, Trash2 } from 'lucide-react';

const sections = [
  { id: 'intro', icon: Shield, titleKey: 'privacyIntro' },
  { id: 'data-collection', icon: Database, titleKey: 'privacyDataCollection' },
  { id: 'data-usage', icon: Eye, titleKey: 'privacyDataUsage' },
  { id: 'cookies', icon: Settings, titleKey: 'privacyCookies' },
  { id: 'data-sharing', icon: Globe, titleKey: 'privacyDataSharing' },
  { id: 'data-security', icon: Lock, titleKey: 'privacyDataSecurity' },
  { id: 'user-rights', icon: UserCheck, titleKey: 'privacyUserRights' },
  { id: 'data-retention', icon: Clock, titleKey: 'privacyDataRetention' },
  { id: 'children', icon: AlertTriangle, titleKey: 'privacyChildren' },
  { id: 'changes', icon: FileText, titleKey: 'privacyChanges' },
  { id: 'contact', icon: Mail, titleKey: 'privacyContact' },
];

export default function PrivacyPage() {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (visible.length > 0) {
          const currentId = visible[0].target.getAttribute('id');
          if (currentId) {
            setActiveSection((prev) => (prev === currentId ? prev : currentId));
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <WebImpulsHeader />
      <main className="flex-1 pt-[var(--header-height)]">
        <div className="container py-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            {/* Main Content */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-black mb-4">
                  {t.privacyTitle || 'Політика конфіденційності'}
                </h1>
                <p className="text-muted-foreground">
                  {t.privacyLastUpdated || 'Останнє оновлення'}: 14.12.2024
                </p>
              </motion.div>

              <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
                {/* 1. Introduction */}
                <section id="intro">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                    {t.privacyIntro || '1. Вступ'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t.privacyIntroText1 || 'Ласкаво просимо до Web Impuls. Ми поважаємо вашу конфіденційність і прагнемо захистити ваші персональні дані. Ця Політика конфіденційності пояснює, як ми збираємо, використовуємо, зберігаємо та захищаємо інформацію, яку ви надаєте нам при використанні нашого веб-сайту та послуг.'}
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t.privacyIntroText2 || 'Використовуючи наш веб-сайт, ви погоджуєтесь з умовами цієї Політики конфіденційності. Якщо ви не згодні з будь-яким положенням цієї політики, будь ласка, припиніть використання нашого веб-сайту.'}
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t.privacyIntroText3 || 'Ця політика застосовується до всіх відвідувачів, користувачів та інших осіб, які мають доступ до нашого веб-сайту або користуються нашими послугами. Ми є контролером даних відповідно до Загального регламенту захисту даних (GDPR) Європейського Союзу.'}
                  </p>
                </section>

                {/* 2. Data Collection */}
                <section id="data-collection">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Database className="w-6 h-6 text-primary" />
                    {t.privacyDataCollection || '2. Збір даних'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.privacyDataCollectionText1 || 'Ми збираємо різні типи інформації для надання та покращення наших послуг:'}
                  </p>
                  <h3 className="text-xl font-semibold mb-2">{t.privacyPersonalData || '2.1. Персональні дані'}</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.privacyPersonalData1 || "Ім'я та прізвище"}</li>
                    <li>{t.privacyPersonalData2 || 'Електронна адреса'}</li>
                    <li>{t.privacyPersonalData3 || 'Номер телефону'}</li>
                    <li>{t.privacyPersonalData4 || 'Назва компанії (якщо застосовно)'}</li>
                    <li>{t.privacyPersonalData5 || 'Адреса для виставлення рахунків'}</li>
                    <li>{t.privacyPersonalData6 || 'Платіжна інформація (оброблюється через захищені платіжні системи)'}</li>
                  </ul>
                  <h3 className="text-xl font-semibold mb-2 mt-6">{t.privacyTechnicalData || '2.2. Технічні дані'}</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.privacyTechnicalData1 || 'IP-адреса'}</li>
                    <li>{t.privacyTechnicalData2 || 'Тип та версія браузера'}</li>
                    <li>{t.privacyTechnicalData3 || 'Операційна система'}</li>
                    <li>{t.privacyTechnicalData4 || 'Часовий пояс'}</li>
                    <li>{t.privacyTechnicalData5 || 'Інформація про пристрій'}</li>
                    <li>{t.privacyTechnicalData6 || 'Дані геолокації (приблизні)'}</li>
                  </ul>
                  <h3 className="text-xl font-semibold mb-2 mt-6">{t.privacyUsageData || '2.3. Дані використання'}</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.privacyUsageData1 || 'Сторінки, які ви відвідуєте'}</li>
                    <li>{t.privacyUsageData2 || 'Час, проведений на сторінках'}</li>
                    <li>{t.privacyUsageData3 || 'Посилання, на які ви натискаєте'}</li>
                    <li>{t.privacyUsageData4 || 'Джерело переходу на наш сайт'}</li>
                    <li>{t.privacyUsageData5 || 'Дії на веб-сайті'}</li>
                  </ul>
                </section>

                {/* 3. Data Usage */}
                <section id="data-usage">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Eye className="w-6 h-6 text-primary" />
                    {t.privacyDataUsage || '3. Використання даних'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.privacyDataUsageText1 || 'Ми використовуємо зібрану інформацію для таких цілей:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.privacyDataUsage1 || 'Надання, підтримка та покращення наших послуг'}</li>
                    <li>{t.privacyDataUsage2 || 'Обробка замовлень та платежів'}</li>
                    <li>{t.privacyDataUsage3 || "Зв'язок з вами щодо ваших запитів та проектів"}</li>
                    <li>{t.privacyDataUsage4 || 'Надсилання технічних повідомлень та оновлень'}</li>
                    <li>{t.privacyDataUsage5 || 'Надсилання маркетингових матеріалів (за вашою згодою)'}</li>
                    <li>{t.privacyDataUsage6 || 'Аналіз та покращення користувацького досвіду'}</li>
                    <li>{t.privacyDataUsage7 || 'Захист від шахрайства та зловживань'}</li>
                    <li>{t.privacyDataUsage8 || 'Виконання юридичних зобов\'язань'}</li>
                  </ul>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.privacyDataUsageText2 || 'Правовою основою для обробки ваших персональних даних є: виконання договору, законні інтереси, юридичні зобов\'язання та ваша згода (де це застосовно).'}
                  </p>
                </section>

                {/* 4. Cookies */}
                <section id="cookies">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Settings className="w-6 h-6 text-primary" />
                    {t.privacyCookies || '4. Файли cookie'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.privacyCookiesText1 || 'Ми використовуємо файли cookie та подібні технології відстеження для покращення вашого досвіду на нашому веб-сайті. Файли cookie — це невеликі текстові файли, які зберігаються на вашому пристрої.'}
                  </p>
                  <h3 className="text-xl font-semibold mb-2">{t.privacyCookiesTypes || 'Типи файлів cookie:'}</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>{t.privacyCookiesNecessary || 'Необхідні cookie'}</strong>: {t.privacyCookiesNecessaryDesc || 'Потрібні для функціонування веб-сайту. Без них сайт не працюватиме належним чином.'}</li>
                    <li><strong>{t.privacyCookiesAnalytics || 'Аналітичні cookie'}</strong>: {t.privacyCookiesAnalyticsDesc || 'Допомагають нам зрозуміти, як відвідувачі взаємодіють з веб-сайтом (Google Analytics, Vercel Analytics).'}</li>
                    <li><strong>{t.privacyCookiesMarketing || 'Маркетингові cookie'}</strong>: {t.privacyCookiesMarketingDesc || 'Використовуються для показу релевантної реклами та відстеження ефективності рекламних кампаній.'}</li>
                    <li><strong>{t.privacyCookiesPreferences || 'Cookie налаштувань'}</strong>: {t.privacyCookiesPreferencesDesc || 'Зберігають ваші налаштування, такі як мова та тема оформлення.'}</li>
                  </ul>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.privacyCookiesText2 || 'Ви можете керувати налаштуваннями cookie через банер cookie на нашому сайті або через налаштування вашого браузера. Зверніть увагу, що відключення деяких cookie може вплинути на функціональність веб-сайту.'}
                  </p>
                </section>

                {/* 5. Data Sharing */}
                <section id="data-sharing">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-primary" />
                    {t.privacyDataSharing || '5. Передача даних третім особам'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.privacyDataSharingText1 || 'Ми не продаємо ваші персональні дані. Ми можемо передавати ваші дані таким категоріям одержувачів:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>{t.privacyDataSharingProviders || 'Постачальники послуг'}</strong>: {t.privacyDataSharingProvidersDesc || 'Хостинг (Vercel), платіжні системи (Stripe), email-сервіси, аналітика.'}</li>
                    <li><strong>{t.privacyDataSharingLegal || 'Юридичні вимоги'}</strong>: {t.privacyDataSharingLegalDesc || 'Державні органи на вимогу закону або судового рішення.'}</li>
                    <li><strong>{t.privacyDataSharingBusiness || 'Бізнес-партнери'}</strong>: {t.privacyDataSharingBusinessDesc || 'У разі злиття, придбання або продажу активів.'}</li>
                  </ul>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.privacyDataSharingText2 || 'Всі наші постачальники послуг зобов\'язані захищати ваші дані відповідно до GDPR та інших застосовних законів про захист даних.'}
                  </p>
                </section>

                {/* 6. Data Security */}
                <section id="data-security">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                    {t.privacyDataSecurity || '6. Безпека даних'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.privacyDataSecurityText1 || 'Ми впроваджуємо відповідні технічні та організаційні заходи для захисту ваших персональних даних:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.privacyDataSecurity1 || 'SSL/TLS шифрування всіх передач даних'}</li>
                    <li>{t.privacyDataSecurity2 || 'Шифрування даних у стані спокою'}</li>
                    <li>{t.privacyDataSecurity3 || 'Регулярні оновлення безпеки'}</li>
                    <li>{t.privacyDataSecurity4 || 'Обмежений доступ до персональних даних'}</li>
                    <li>{t.privacyDataSecurity5 || 'Регулярне резервне копіювання'}</li>
                    <li>{t.privacyDataSecurity6 || 'Моніторинг підозрілої активності'}</li>
                  </ul>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.privacyDataSecurityText2 || 'Незважаючи на наші зусилля, жоден метод передачі через Інтернет або електронного зберігання не є на 100% безпечним. Ми не можемо гарантувати абсолютну безпеку ваших даних.'}
                  </p>
                </section>

                {/* 7. User Rights */}
                <section id="user-rights">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <UserCheck className="w-6 h-6 text-primary" />
                    {t.privacyUserRights || '7. Ваші права'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.privacyUserRightsText1 || 'Відповідно до GDPR та інших законів про захист даних, ви маєте такі права:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>{t.privacyRightAccess || 'Право на доступ'}</strong>: {t.privacyRightAccessDesc || 'Ви можете запросити копію ваших персональних даних.'}</li>
                    <li><strong>{t.privacyRightRectification || 'Право на виправлення'}</strong>: {t.privacyRightRectificationDesc || 'Ви можете вимагати виправлення неточних даних.'}</li>
                    <li><strong>{t.privacyRightErasure || 'Право на видалення'}</strong>: {t.privacyRightErasureDesc || 'Ви можете вимагати видалення ваших даних ("право бути забутим").'}</li>
                    <li><strong>{t.privacyRightRestriction || 'Право на обмеження обробки'}</strong>: {t.privacyRightRestrictionDesc || 'Ви можете вимагати обмеження обробки ваших даних.'}</li>
                    <li><strong>{t.privacyRightPortability || 'Право на переносимість даних'}</strong>: {t.privacyRightPortabilityDesc || 'Ви можете отримати свої дані у структурованому форматі.'}</li>
                    <li><strong>{t.privacyRightObjection || 'Право на заперечення'}</strong>: {t.privacyRightObjectionDesc || 'Ви можете заперечити проти обробки ваших даних.'}</li>
                    <li><strong>{t.privacyRightWithdraw || 'Право відкликати згоду'}</strong>: {t.privacyRightWithdrawDesc || 'Ви можете відкликати свою згоду в будь-який час.'}</li>
                  </ul>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.privacyUserRightsText2 || 'Для реалізації своїх прав зверніться до нас за контактними даними, вказаними нижче. Ми відповімо на ваш запит протягом 30 днів.'}
                  </p>
                </section>

                {/* 8. Data Retention */}
                <section id="data-retention">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                    {t.privacyDataRetention || '8. Зберігання даних'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.privacyDataRetentionText1 || 'Ми зберігаємо ваші персональні дані лише стільки, скільки необхідно для цілей, описаних у цій політиці:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.privacyDataRetention1 || 'Дані клієнтів: протягом терміну дії договору + 5 років для юридичних цілей'}</li>
                    <li>{t.privacyDataRetention2 || 'Дані запитів: 2 роки з моменту останнього контакту'}</li>
                    <li>{t.privacyDataRetention3 || 'Аналітичні дані: 26 місяців'}</li>
                    <li>{t.privacyDataRetention4 || 'Маркетингові дані: до відкликання згоди'}</li>
                  </ul>
                </section>

                {/* 9. Children */}
                <section id="children">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                    {t.privacyChildren || '9. Діти'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t.privacyChildrenText || 'Наші послуги не призначені для осіб молодше 16 років. Ми свідомо не збираємо персональні дані від дітей. Якщо ви вважаєте, що ми отримали дані від дитини, будь ласка, зв\'яжіться з нами негайно, і ми видалимо цю інформацію.'}
                  </p>
                </section>

                {/* 10. Changes */}
                <section id="changes">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                    {t.privacyChanges || '10. Зміни до політики'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t.privacyChangesText || 'Ми можемо оновлювати цю Політику конфіденційності час від часу. Про будь-які суттєві зміни ми повідомимо вас через електронну пошту або повідомлення на нашому веб-сайті. Ми рекомендуємо періодично переглядати цю політику для отримання актуальної інформації про те, як ми захищаємо ваші дані.'}
                  </p>
                </section>

                {/* 11. Contact */}
                <section id="contact">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                    {t.privacyContact || '11. Контактна інформація'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.privacyContactText || 'Якщо у вас є питання щодо цієї Політики конфіденційності або ви хочете реалізувати свої права, зв\'яжіться з нами:'}
                  </p>
                  <div className="bg-card p-6 rounded-2xl border border-border/50">
                    <p className="font-semibold mb-2">Web Impuls</p>
                    <p className="text-muted-foreground">Email: privacy@webimpuls.com</p>
                    <p className="text-muted-foreground">Email: contact@webimpuls.com</p>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.privacyContactText2 || 'Ви також маєте право подати скаргу до наглядового органу з захисту даних у вашій країні.'}
                  </p>
                </section>
              </div>
            </div>

            {/* Right Sidebar - Navigation */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card/50 border border-border/50 rounded-2xl p-6"
                >
                  <h3 className="font-bold text-lg mb-4">{t.tableOfContents || 'Зміст'}</h3>
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm transition-all ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{t[section.titleKey] || section.titleKey}</span>
                        </button>
                      );
                    })}
                  </nav>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}











