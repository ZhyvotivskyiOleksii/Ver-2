-- ============================================
-- LIVE TYPING INDICATORS
-- ============================================

-- Таблиця для відстеження хто зараз друкує
CREATE TABLE IF NOT EXISTS public.live_typing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL,
    typer_type TEXT NOT NULL CHECK (typer_type IN ('visitor', 'operator')),
    typer_name TEXT,
    is_typing BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Індекси
CREATE INDEX IF NOT EXISTS idx_live_typing_chat_id ON public.live_typing(chat_id);
CREATE INDEX IF NOT EXISTS idx_live_typing_updated_at ON public.live_typing(updated_at);

-- Унікальність: один запис на chat_id + typer_type
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_typing_unique ON public.live_typing(chat_id, typer_type);

-- RLS
ALTER TABLE public.live_typing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for live_typing" ON public.live_typing
    FOR ALL USING (true) WITH CHECK (true);

-- Realtime для typing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'live_typing'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.live_typing;
    END IF;
END $$;

-- Функція для автоматичного видалення старих typing записів (> 30 секунд)
CREATE OR REPLACE FUNCTION cleanup_old_typing()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.live_typing 
    WHERE updated_at < NOW() - INTERVAL '30 seconds';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер для очищення (запускається при кожному INSERT/UPDATE)
DROP TRIGGER IF EXISTS trigger_cleanup_typing ON public.live_typing;
CREATE TRIGGER trigger_cleanup_typing
    AFTER INSERT OR UPDATE ON public.live_typing
    FOR EACH STATEMENT
    EXECUTE FUNCTION cleanup_old_typing();

COMMENT ON TABLE public.live_typing IS 'Індикатори набору тексту в live чаті';

-- LIVE TYPING INDICATORS
-- ============================================

-- Таблиця для відстеження хто зараз друкує
CREATE TABLE IF NOT EXISTS public.live_typing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL,
    typer_type TEXT NOT NULL CHECK (typer_type IN ('visitor', 'operator')),
    typer_name TEXT,
    is_typing BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Індекси
CREATE INDEX IF NOT EXISTS idx_live_typing_chat_id ON public.live_typing(chat_id);
CREATE INDEX IF NOT EXISTS idx_live_typing_updated_at ON public.live_typing(updated_at);

-- Унікальність: один запис на chat_id + typer_type
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_typing_unique ON public.live_typing(chat_id, typer_type);

-- RLS
ALTER TABLE public.live_typing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for live_typing" ON public.live_typing
    FOR ALL USING (true) WITH CHECK (true);

-- Realtime для typing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'live_typing'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.live_typing;
    END IF;
END $$;

-- Функція для автоматичного видалення старих typing записів (> 30 секунд)
CREATE OR REPLACE FUNCTION cleanup_old_typing()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.live_typing 
    WHERE updated_at < NOW() - INTERVAL '30 seconds';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер для очищення (запускається при кожному INSERT/UPDATE)
DROP TRIGGER IF EXISTS trigger_cleanup_typing ON public.live_typing;
CREATE TRIGGER trigger_cleanup_typing
    AFTER INSERT OR UPDATE ON public.live_typing
    FOR EACH STATEMENT
    EXECUTE FUNCTION cleanup_old_typing();

COMMENT ON TABLE public.live_typing IS 'Індикатори набору тексту в live чаті';

-- LIVE TYPING INDICATORS
-- ============================================

-- Таблиця для відстеження хто зараз друкує
CREATE TABLE IF NOT EXISTS public.live_typing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL,
    typer_type TEXT NOT NULL CHECK (typer_type IN ('visitor', 'operator')),
    typer_name TEXT,
    is_typing BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Індекси
CREATE INDEX IF NOT EXISTS idx_live_typing_chat_id ON public.live_typing(chat_id);
CREATE INDEX IF NOT EXISTS idx_live_typing_updated_at ON public.live_typing(updated_at);

-- Унікальність: один запис на chat_id + typer_type
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_typing_unique ON public.live_typing(chat_id, typer_type);

-- RLS
ALTER TABLE public.live_typing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for live_typing" ON public.live_typing
    FOR ALL USING (true) WITH CHECK (true);

-- Realtime для typing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'live_typing'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.live_typing;
    END IF;
END $$;

-- Функція для автоматичного видалення старих typing записів (> 30 секунд)
CREATE OR REPLACE FUNCTION cleanup_old_typing()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.live_typing 
    WHERE updated_at < NOW() - INTERVAL '30 seconds';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер для очищення (запускається при кожному INSERT/UPDATE)
DROP TRIGGER IF EXISTS trigger_cleanup_typing ON public.live_typing;
CREATE TRIGGER trigger_cleanup_typing
    AFTER INSERT OR UPDATE ON public.live_typing
    FOR EACH STATEMENT
    EXECUTE FUNCTION cleanup_old_typing();

COMMENT ON TABLE public.live_typing IS 'Індикатори набору тексту в live чаті';





-- LIVE TYPING INDICATORS
-- ============================================

-- Таблиця для відстеження хто зараз друкує
CREATE TABLE IF NOT EXISTS public.live_typing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL,
    typer_type TEXT NOT NULL CHECK (typer_type IN ('visitor', 'operator')),
    typer_name TEXT,
    is_typing BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Індекси
CREATE INDEX IF NOT EXISTS idx_live_typing_chat_id ON public.live_typing(chat_id);
CREATE INDEX IF NOT EXISTS idx_live_typing_updated_at ON public.live_typing(updated_at);

-- Унікальність: один запис на chat_id + typer_type
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_typing_unique ON public.live_typing(chat_id, typer_type);

-- RLS
ALTER TABLE public.live_typing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for live_typing" ON public.live_typing
    FOR ALL USING (true) WITH CHECK (true);

-- Realtime для typing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'live_typing'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.live_typing;
    END IF;
END $$;

-- Функція для автоматичного видалення старих typing записів (> 30 секунд)
CREATE OR REPLACE FUNCTION cleanup_old_typing()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.live_typing 
    WHERE updated_at < NOW() - INTERVAL '30 seconds';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер для очищення (запускається при кожному INSERT/UPDATE)
DROP TRIGGER IF EXISTS trigger_cleanup_typing ON public.live_typing;
CREATE TRIGGER trigger_cleanup_typing
    AFTER INSERT OR UPDATE ON public.live_typing
    FOR EACH STATEMENT
    EXECUTE FUNCTION cleanup_old_typing();

COMMENT ON TABLE public.live_typing IS 'Індикатори набору тексту в live чаті';

-- LIVE TYPING INDICATORS
-- ============================================

-- Таблиця для відстеження хто зараз друкує
CREATE TABLE IF NOT EXISTS public.live_typing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL,
    typer_type TEXT NOT NULL CHECK (typer_type IN ('visitor', 'operator')),
    typer_name TEXT,
    is_typing BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Індекси
CREATE INDEX IF NOT EXISTS idx_live_typing_chat_id ON public.live_typing(chat_id);
CREATE INDEX IF NOT EXISTS idx_live_typing_updated_at ON public.live_typing(updated_at);

-- Унікальність: один запис на chat_id + typer_type
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_typing_unique ON public.live_typing(chat_id, typer_type);

-- RLS
ALTER TABLE public.live_typing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for live_typing" ON public.live_typing
    FOR ALL USING (true) WITH CHECK (true);

-- Realtime для typing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'live_typing'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.live_typing;
    END IF;
END $$;

-- Функція для автоматичного видалення старих typing записів (> 30 секунд)
CREATE OR REPLACE FUNCTION cleanup_old_typing()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.live_typing 
    WHERE updated_at < NOW() - INTERVAL '30 seconds';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер для очищення (запускається при кожному INSERT/UPDATE)
DROP TRIGGER IF EXISTS trigger_cleanup_typing ON public.live_typing;
CREATE TRIGGER trigger_cleanup_typing
    AFTER INSERT OR UPDATE ON public.live_typing
    FOR EACH STATEMENT
    EXECUTE FUNCTION cleanup_old_typing();

COMMENT ON TABLE public.live_typing IS 'Індикатори набору тексту в live чаті';

-- LIVE TYPING INDICATORS
-- ============================================

-- Таблиця для відстеження хто зараз друкує
CREATE TABLE IF NOT EXISTS public.live_typing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL,
    typer_type TEXT NOT NULL CHECK (typer_type IN ('visitor', 'operator')),
    typer_name TEXT,
    is_typing BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Індекси
CREATE INDEX IF NOT EXISTS idx_live_typing_chat_id ON public.live_typing(chat_id);
CREATE INDEX IF NOT EXISTS idx_live_typing_updated_at ON public.live_typing(updated_at);

-- Унікальність: один запис на chat_id + typer_type
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_typing_unique ON public.live_typing(chat_id, typer_type);

-- RLS
ALTER TABLE public.live_typing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for live_typing" ON public.live_typing
    FOR ALL USING (true) WITH CHECK (true);

-- Realtime для typing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'live_typing'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.live_typing;
    END IF;
END $$;

-- Функція для автоматичного видалення старих typing записів (> 30 секунд)
CREATE OR REPLACE FUNCTION cleanup_old_typing()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.live_typing 
    WHERE updated_at < NOW() - INTERVAL '30 seconds';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер для очищення (запускається при кожному INSERT/UPDATE)
DROP TRIGGER IF EXISTS trigger_cleanup_typing ON public.live_typing;
CREATE TRIGGER trigger_cleanup_typing
    AFTER INSERT OR UPDATE ON public.live_typing
    FOR EACH STATEMENT
    EXECUTE FUNCTION cleanup_old_typing();

COMMENT ON TABLE public.live_typing IS 'Індикатори набору тексту в live чаті';






