-- Live Chat Tables for visitor-operator communication

-- Create live_chats table
CREATE TABLE IF NOT EXISTS public.live_chats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id text NOT NULL,
    visitor_name text,
    visitor_contact text,
    status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'closed')),
    locale text DEFAULT 'ua',
    unread_count integer DEFAULT 0,
    operator_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create live_messages table
CREATE TABLE IF NOT EXISTS public.live_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id uuid REFERENCES public.live_chats(id) ON DELETE CASCADE NOT NULL,
    sender_type text NOT NULL CHECK (sender_type IN ('visitor', 'operator')),
    sender_name text,
    content text NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_live_chats_visitor_id ON public.live_chats(visitor_id);
CREATE INDEX IF NOT EXISTS idx_live_chats_status ON public.live_chats(status);
CREATE INDEX IF NOT EXISTS idx_live_chats_updated_at ON public.live_chats(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_messages_chat_id ON public.live_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_live_messages_created_at ON public.live_messages(created_at);

-- Enable RLS
ALTER TABLE public.live_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for live_chats
DROP POLICY IF EXISTS "Allow all for live_chats" ON public.live_chats;
CREATE POLICY "Allow all for live_chats" ON public.live_chats
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policies for live_messages
DROP POLICY IF EXISTS "Allow all for live_messages" ON public.live_messages;
CREATE POLICY "Allow all for live_messages" ON public.live_messages
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Enable Realtime for live_chats
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'live_chats'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chats;
    END IF;
END $$;

-- Enable Realtime for live_messages  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'live_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.live_messages;
    END IF;
END $$;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_live_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_live_chat_updated_at ON public.live_chats;
CREATE TRIGGER trigger_update_live_chat_updated_at
    BEFORE UPDATE ON public.live_chats
    FOR EACH ROW
    EXECUTE FUNCTION update_live_chat_updated_at();

COMMENT ON TABLE public.live_chats IS 'Live chat sessions between visitors and operators';
COMMENT ON TABLE public.live_messages IS 'Messages in live chat sessions';


