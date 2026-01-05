-- ============================================
-- Web Impuls Chat - Supabase Database Schema
-- ============================================
-- Скопіюй цей SQL в Supabase SQL Editor і виконай

-- 1. Включаємо необхідні розширення
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ТАБЛИЦЯ: chats (сесії чатів)
-- ============================================
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Коментар до таблиці
COMMENT ON TABLE public.chats IS 'Сесії чатів з користувачами';

-- ============================================
-- ТАБЛИЦЯ: messages (повідомлення чату)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id BIGSERIAL PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Індекси для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

COMMENT ON TABLE public.messages IS 'Повідомлення чату (user/assistant)';

-- ============================================
-- ТАБЛИЦЯ: leads (контакти клієнтів)
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
    id BIGSERIAL PRIMARY KEY,
    chat_id UUID REFERENCES public.chats(id) ON DELETE SET NULL,
    email TEXT,
    phone TEXT,
    name TEXT,
    locale TEXT DEFAULT 'ua',
    first_message TEXT,
    source TEXT DEFAULT 'unknown' CHECK (source IN ('chat', 'form', 'unknown')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Індекси
CREATE INDEX IF NOT EXISTS idx_leads_chat_id ON public.leads(chat_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- Тригер для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_leads_updated_at ON public.leads;
CREATE TRIGGER trigger_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public.leads IS 'Контакти потенційних клієнтів з чату/форми';

-- ============================================
-- ТАБЛИЦЯ: chat_feedback (оцінки чатів)
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_feedback (
    id BIGSERIAL PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_chat_feedback UNIQUE (chat_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_feedback_chat_id ON public.chat_feedback(chat_id);

COMMENT ON TABLE public.chat_feedback IS 'Оцінки користувачів (1=👎, 5=👍)';

-- ============================================
-- ТАБЛИЦЯ: knowledge_documents (база знань AI)
-- ============================================
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locale TEXT NOT NULL DEFAULT 'ua',
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_knowledge_locale ON public.knowledge_documents(locale);
CREATE INDEX IF NOT EXISTS idx_knowledge_title ON public.knowledge_documents(title);

DROP TRIGGER IF EXISTS trigger_knowledge_updated_at ON public.knowledge_documents;
CREATE TRIGGER trigger_knowledge_updated_at
    BEFORE UPDATE ON public.knowledge_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public.knowledge_documents IS 'База знань для AI-асистента';

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Вимикаємо RLS для серверного доступу (anon key буде працювати)
-- Якщо потрібен більш суворий контроль - налаштуй policies окремо

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;

-- Політики для анонімного доступу (сервер Next.js)
-- Chats: повний доступ
CREATE POLICY "Allow all for chats" ON public.chats
    FOR ALL USING (true) WITH CHECK (true);

-- Messages: повний доступ
CREATE POLICY "Allow all for messages" ON public.messages
    FOR ALL USING (true) WITH CHECK (true);

-- Leads: повний доступ
CREATE POLICY "Allow all for leads" ON public.leads
    FOR ALL USING (true) WITH CHECK (true);

-- Chat Feedback: повний доступ
CREATE POLICY "Allow all for chat_feedback" ON public.chat_feedback
    FOR ALL USING (true) WITH CHECK (true);

-- Knowledge Documents: тільки читання для анонів, запис через dashboard
CREATE POLICY "Allow read for knowledge" ON public.knowledge_documents
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for knowledge" ON public.knowledge_documents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for knowledge" ON public.knowledge_documents
    FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================
-- REALTIME (для live оновлень в чаті)
-- ============================================

-- Включаємо realtime для таблиці messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============================================
-- ТЕСТОВІ ДАНІ (опційно)
-- ============================================

-- Приклад документа для бази знань
INSERT INTO public.knowledge_documents (locale, title, content)
VALUES 
    ('ua', 'Про Web Impuls', 'Web Impuls — це веб-студія, яка створює сучасні сайти та веб-додатки. Ми спеціалізуємося на Landing Page, корпоративних сайтах, E-commerce та редизайні.'),
    ('ua', 'Наші послуги', 'Landing Page (від $300, 5-10 днів), Корпоративний сайт (від $500, 10-20 днів), E-commerce (від $1500, 30-60 днів), Редизайн (від $200, 5-15 днів), SEO-оптимізація (від $150/міс), Технічна підтримка (від $50/міс)'),
    ('ua', 'Контакти', 'Email: contact@web-impuls.com, Телефон: +48 572 245 574, Адреса: Warszawa, Poland, Edwarda Habicha 18')
ON CONFLICT DO NOTHING;

-- ============================================
-- ГОТОВО! 🎉
-- ============================================
-- Після виконання цього скрипта:
-- 1. Переконайся, що в .env є NEXT_PUBLIC_SUPABASE_URL і NEXT_PUBLIC_SUPABASE_ANON_KEY
-- 2. Перезапусти dev сервер
-- 3. Чат має працювати!

