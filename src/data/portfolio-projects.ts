type PortfolioLocale = 'ua' | 'pl' | 'en' | 'de';

type BaseProject = {
  id: number;
  title: string;
  mockup: string;
  screenshot?: string;
  tech?: string[];
};

type ProjectCopy = {
  description: string;
  fullDescription: string;
};

export type PortfolioProject = BaseProject & ProjectCopy;

const baseProjects: BaseProject[] = [
  {
    id: 1,
    title: 'Design Business Unity',
    mockup: '/portfolio/Mockup1.webp',
    screenshot: '/portfolio/Desktop_DBU.webp',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 2,
    title: 'Norway',
    mockup: '/portfolio/Mockup2.webp',
    screenshot: '/portfolio/Desktop_Norway.webp',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 3,
    title: 'Beauty Salon',
    mockup: '/portfolio/Mockup3.webp',
    screenshot: '/portfolio/Beauty-Salon.webp',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 4,
    title: 'ELITE AUTO',
    mockup: '/portfolio/Mockup4.webp',
    screenshot: '/portfolio/Desktop_Car.webp',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 5,
    title: 'CRYPTO-VISTA',
    mockup: '/portfolio/Mockup5.webp',
    screenshot: '/portfolio/Desktop_Crypto.webp',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 6,
    title: 'EduFlow',
    mockup: '/portfolio/Mockup6.webp',
    screenshot: '/portfolio/Landing Page - 7.webp',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 7,
    title: 'Barber',
    mockup: '/portfolio/Mockup7.webp',
    screenshot: '/portfolio/1440.webp',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 8,
    title: 'India Cafe',
    mockup: '/portfolio/Mockup8.webp',
    screenshot: '/portfolio/Desctop_MainPage.webp',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 9,
    title: 'Barber Shop',
    mockup: '/portfolio/Mockup9.webp',
    screenshot: '/portfolio/desctop-2variant.webp',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 10,
    title: 'Admin Panel',
    mockup: '/portfolio/Mockup10.webp',
    screenshot: '/portfolio/dashb.webp',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
];

const projectCopy: Record<PortfolioLocale, Record<number, ProjectCopy>> = {
  ua: {
    1: {
      description: 'ІТ покоління',
      fullDescription: 'Design Business Unity — об’єднання українського бізнесу, що допомагає студентам IT Generation знаходити стажування та менторів.',
    },
    2: {
      description: 'Мандрівки Норвегією',
      fullDescription: 'Сайт із маршрутами, турами та бронюванням для тих, хто планує подорож Норвегією.',
    },
    3: {
      description: 'Салон краси з преміальним сервісом',
      fullDescription: 'Онлайн-вітрина салону преміум-догляду з записом, списком послуг та портфоліо майстрів.',
    },
    4: {
      description: 'Преміальні авто та тест-драйви',
      fullDescription: 'Лендінг автосалону з каталогом моделей, вибором комплектацій і записом на тест-драйв.',
    },
    5: {
      description: 'Екосистема для трейдингу',
      fullDescription: 'Дашборд із аналітикою, освітніми матеріалами та віджетами для криптотрейдерів.',
    },
    6: {
      description: 'Освітня платформа для онлайн-курсів',
      fullDescription: 'Маркетплейс курсів із прогресом студента, розкладом занять та оплатою.',
    },
    7: {
      description: 'Барбершоп у центрі Києва',
      fullDescription: 'Сайт із профілями майстрів, цінами та миттєвим записом на зручний час.',
    },
    8: {
      description: 'Автентичний індійський ресторан',
      fullDescription: 'Меню, онлайн-замовлення та програма лояльності для закладу India Cafe.',
    },
    9: {
      description: 'Барбершоп із преміум-сервісом',
      fullDescription: 'Респонсивний сайт із вітриною робіт, відгуками клієнтів та швидким записом.',
    },
    10: {
      description: 'Адаптивна адмін-панель',
      fullDescription: 'Дашборд для управління замовленнями, користувачами та бізнес-аналітикою.',
    },
  },
  pl: {
    1: {
      description: 'Program IT Pokolenie',
      fullDescription: 'Design Business Unity łączy ukraińskie firmy ze studentami programu IT Pokolenie i pomaga im znaleźć staże oraz mentorów.',
    },
    2: {
      description: 'Podróże po Norwegii',
      fullDescription: 'Serwis z trasami, atrakcjami i rezerwacjami dla osób planujących wyprawę do Norwegii.',
    },
    3: {
      description: 'Salon piękności z usługą premium',
      fullDescription: 'Strona salonu urody z rezerwacją online, listą usług i portfolio stylistów.',
    },
    4: {
      description: 'Samochody klasy premium i jazdy próbne',
      fullDescription: 'Landing page salonu samochodowego z katalogiem modeli i formularzem zapisu na jazdę próbną.',
    },
    5: {
      description: 'Ekosystem dla traderów krypto',
      fullDescription: 'Panel z dashboardem, analityką oraz materiałami edukacyjnymi dla inwestorów w kryptowaluty.',
    },
    6: {
      description: 'Platforma edukacyjna online',
      fullDescription: 'Marketplace kursów z systemem rezerwacji i panelem postępów dla studentów.',
    },
    7: {
      description: 'Barbershop w centrum Kijowa',
      fullDescription: 'Serwis z profilami barberów, cennikiem i szybkim zapisem na wizytę.',
    },
    8: {
      description: 'Autentyczna indyjska restauracja',
      fullDescription: 'Menu, zamówienia online oraz program lojalnościowy dla restauracji India Cafe.',
    },
    9: {
      description: 'Barbershop z usługą premium',
      fullDescription: 'Responsywna strona z galerią realizacji i opiniami klientów.',
    },
    10: {
      description: 'Responsywny panel administracyjny',
      fullDescription: 'Panel do zarządzania zamówieniami, użytkownikami i raportami biznesowymi.',
    },
  },
  en: {
    1: {
      description: 'IT Generation program',
      fullDescription: 'Design Business Unity connects Ukrainian companies with IT Generation students to help them find internships and mentorship.',
    },
    2: {
      description: 'Begin your adventure in Norway',
      fullDescription: 'Travel website with routes, highlights and booking options for exploring Norway.',
    },
    3: {
      description: 'Premium beauty salon experience',
      fullDescription: 'Website for a beauty studio with online booking, service list and stylist portfolio.',
    },
    4: {
      description: 'Premium cars & test drives',
      fullDescription: 'Luxury car dealer landing page with catalog, trims and a test-drive booking form.',
    },
    5: {
      description: 'All-in-one crypto ecosystem',
      fullDescription: 'Dashboard with analytics, trading widgets and educational content for crypto investors.',
    },
    6: {
      description: 'Online learning platform',
      fullDescription: 'Course marketplace with student progress tracking and lesson scheduling.',
    },
    7: {
      description: 'Barbershop in Kyiv',
      fullDescription: 'Website with barber profiles, service list and instant booking.',
    },
    8: {
      description: 'Authentic Indian cuisine',
      fullDescription: 'Menu showcase with online ordering and loyalty perks for India Cafe.',
    },
    9: {
      description: 'Premium barbershop experience',
      fullDescription: 'Responsive site with showcase of works, testimonials and quick booking.',
    },
    10: {
      description: 'Responsive admin panel',
      fullDescription: 'Dashboard for managing orders, users and business analytics.',
    },
  },
  de: {
    1: {
      description: 'IT-Generation-Programm',
      fullDescription: 'Design Business Unity verbindet ukrainische Unternehmen mit Teilnehmenden des IT-Generation-Programms und unterstützt sie bei der Suche nach Praktika und Mentoring.',
    },
    2: {
      description: 'Entdecke Norwegen',
      fullDescription: 'Reiseplattform mit Routen, Highlights und Buchungen für eine Tour durch Norwegen.',
    },
    3: {
      description: 'Premium-Beauty-Salon',
      fullDescription: 'Website für einen Beauty-Salon mit Online-Buchung, Serviceübersicht und Teamvorstellung.',
    },
    4: {
      description: 'Premiumfahrzeuge & Probefahrten',
      fullDescription: 'Landingpage für ein Autohaus mit Modellkatalog, Ausstattungen und Probefahrt-Formular.',
    },
    5: {
      description: 'Krypto-Ökosystem aus einer Hand',
      fullDescription: 'Dashboard mit Analysen, Trading-Widgets und Lernmaterial für Krypto-Anleger.',
    },
    6: {
      description: 'Online-Lernplattform',
      fullDescription: 'Kursmarktplatz mit Fortschrittsanzeige und Buchungssystem.',
    },
    7: {
      description: 'Barbershop in Kiew',
      fullDescription: 'Website mit Barber-Profilen, Preisübersicht und schneller Terminbuchung.',
    },
    8: {
      description: 'Authentische indische Küche',
      fullDescription: 'Menüpräsentation mit Online-Bestellung und Treueprogramm für India Cafe.',
    },
    9: {
      description: 'Premium-Barbershop',
      fullDescription: 'Responsives Layout mit Galerie, Kundenstimmen und schneller Buchung.',
    },
    10: {
      description: 'Responsives Admin-Panel',
      fullDescription: 'Dashboard zur Verwaltung von Bestellungen, Nutzern und Analysen.',
    },
  },
};

const SUPPORTED: PortfolioLocale[] = ['ua', 'pl', 'en', 'de'];

export function getPortfolioProjects(locale: string): PortfolioProject[] {
  const lang = SUPPORTED.includes(locale as PortfolioLocale) ? (locale as PortfolioLocale) : 'ua';
  return baseProjects.map(project => {
    const fallback = projectCopy.ua[project.id];
    const localized = projectCopy[lang][project.id] ?? fallback;
    return {
      ...project,
      description: localized.description || fallback.description,
      fullDescription: localized.fullDescription || fallback.fullDescription,
    };
  });
}
