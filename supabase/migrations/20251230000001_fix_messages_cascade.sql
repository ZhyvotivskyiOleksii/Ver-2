-- ============================================
-- FIX: Add ON DELETE CASCADE to messages.chat_id
-- This allows deleting chats with their messages
-- ============================================

-- Drop the existing foreign key constraint (if exists)
DO $$
BEGIN
    -- Try to drop constraint with common naming patterns
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'messages_chat_id_fkey' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT messages_chat_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'fk_messages_chat_id' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT fk_messages_chat_id;
    END IF;
END $$;

-- Re-add the foreign key WITH ON DELETE CASCADE
ALTER TABLE public.messages 
ADD CONSTRAINT messages_chat_id_fkey 
FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;

-- Also fix leads table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'leads_chat_id_fkey' 
               AND table_name = 'leads') THEN
        ALTER TABLE public.leads DROP CONSTRAINT leads_chat_id_fkey;
        ALTER TABLE public.leads 
        ADD CONSTRAINT leads_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Fix chat_feedback table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'chat_feedback_chat_id_fkey' 
               AND table_name = 'chat_feedback') THEN
        ALTER TABLE public.chat_feedback DROP CONSTRAINT chat_feedback_chat_id_fkey;
        ALTER TABLE public.chat_feedback 
        ADD CONSTRAINT chat_feedback_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

COMMENT ON CONSTRAINT messages_chat_id_fkey ON public.messages IS 'Cascade delete messages when chat is deleted';

-- FIX: Add ON DELETE CASCADE to messages.chat_id
-- This allows deleting chats with their messages
-- ============================================

-- Drop the existing foreign key constraint (if exists)
DO $$
BEGIN
    -- Try to drop constraint with common naming patterns
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'messages_chat_id_fkey' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT messages_chat_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'fk_messages_chat_id' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT fk_messages_chat_id;
    END IF;
END $$;

-- Re-add the foreign key WITH ON DELETE CASCADE
ALTER TABLE public.messages 
ADD CONSTRAINT messages_chat_id_fkey 
FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;

-- Also fix leads table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'leads_chat_id_fkey' 
               AND table_name = 'leads') THEN
        ALTER TABLE public.leads DROP CONSTRAINT leads_chat_id_fkey;
        ALTER TABLE public.leads 
        ADD CONSTRAINT leads_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Fix chat_feedback table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'chat_feedback_chat_id_fkey' 
               AND table_name = 'chat_feedback') THEN
        ALTER TABLE public.chat_feedback DROP CONSTRAINT chat_feedback_chat_id_fkey;
        ALTER TABLE public.chat_feedback 
        ADD CONSTRAINT chat_feedback_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

COMMENT ON CONSTRAINT messages_chat_id_fkey ON public.messages IS 'Cascade delete messages when chat is deleted';

-- FIX: Add ON DELETE CASCADE to messages.chat_id
-- This allows deleting chats with their messages
-- ============================================

-- Drop the existing foreign key constraint (if exists)
DO $$
BEGIN
    -- Try to drop constraint with common naming patterns
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'messages_chat_id_fkey' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT messages_chat_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'fk_messages_chat_id' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT fk_messages_chat_id;
    END IF;
END $$;

-- Re-add the foreign key WITH ON DELETE CASCADE
ALTER TABLE public.messages 
ADD CONSTRAINT messages_chat_id_fkey 
FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;

-- Also fix leads table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'leads_chat_id_fkey' 
               AND table_name = 'leads') THEN
        ALTER TABLE public.leads DROP CONSTRAINT leads_chat_id_fkey;
        ALTER TABLE public.leads 
        ADD CONSTRAINT leads_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Fix chat_feedback table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'chat_feedback_chat_id_fkey' 
               AND table_name = 'chat_feedback') THEN
        ALTER TABLE public.chat_feedback DROP CONSTRAINT chat_feedback_chat_id_fkey;
        ALTER TABLE public.chat_feedback 
        ADD CONSTRAINT chat_feedback_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

COMMENT ON CONSTRAINT messages_chat_id_fkey ON public.messages IS 'Cascade delete messages when chat is deleted';





-- FIX: Add ON DELETE CASCADE to messages.chat_id
-- This allows deleting chats with their messages
-- ============================================

-- Drop the existing foreign key constraint (if exists)
DO $$
BEGIN
    -- Try to drop constraint with common naming patterns
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'messages_chat_id_fkey' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT messages_chat_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'fk_messages_chat_id' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT fk_messages_chat_id;
    END IF;
END $$;

-- Re-add the foreign key WITH ON DELETE CASCADE
ALTER TABLE public.messages 
ADD CONSTRAINT messages_chat_id_fkey 
FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;

-- Also fix leads table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'leads_chat_id_fkey' 
               AND table_name = 'leads') THEN
        ALTER TABLE public.leads DROP CONSTRAINT leads_chat_id_fkey;
        ALTER TABLE public.leads 
        ADD CONSTRAINT leads_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Fix chat_feedback table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'chat_feedback_chat_id_fkey' 
               AND table_name = 'chat_feedback') THEN
        ALTER TABLE public.chat_feedback DROP CONSTRAINT chat_feedback_chat_id_fkey;
        ALTER TABLE public.chat_feedback 
        ADD CONSTRAINT chat_feedback_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

COMMENT ON CONSTRAINT messages_chat_id_fkey ON public.messages IS 'Cascade delete messages when chat is deleted';

-- FIX: Add ON DELETE CASCADE to messages.chat_id
-- This allows deleting chats with their messages
-- ============================================

-- Drop the existing foreign key constraint (if exists)
DO $$
BEGIN
    -- Try to drop constraint with common naming patterns
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'messages_chat_id_fkey' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT messages_chat_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'fk_messages_chat_id' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT fk_messages_chat_id;
    END IF;
END $$;

-- Re-add the foreign key WITH ON DELETE CASCADE
ALTER TABLE public.messages 
ADD CONSTRAINT messages_chat_id_fkey 
FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;

-- Also fix leads table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'leads_chat_id_fkey' 
               AND table_name = 'leads') THEN
        ALTER TABLE public.leads DROP CONSTRAINT leads_chat_id_fkey;
        ALTER TABLE public.leads 
        ADD CONSTRAINT leads_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Fix chat_feedback table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'chat_feedback_chat_id_fkey' 
               AND table_name = 'chat_feedback') THEN
        ALTER TABLE public.chat_feedback DROP CONSTRAINT chat_feedback_chat_id_fkey;
        ALTER TABLE public.chat_feedback 
        ADD CONSTRAINT chat_feedback_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

COMMENT ON CONSTRAINT messages_chat_id_fkey ON public.messages IS 'Cascade delete messages when chat is deleted';

-- FIX: Add ON DELETE CASCADE to messages.chat_id
-- This allows deleting chats with their messages
-- ============================================

-- Drop the existing foreign key constraint (if exists)
DO $$
BEGIN
    -- Try to drop constraint with common naming patterns
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'messages_chat_id_fkey' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT messages_chat_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'fk_messages_chat_id' 
               AND table_name = 'messages') THEN
        ALTER TABLE public.messages DROP CONSTRAINT fk_messages_chat_id;
    END IF;
END $$;

-- Re-add the foreign key WITH ON DELETE CASCADE
ALTER TABLE public.messages 
ADD CONSTRAINT messages_chat_id_fkey 
FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;

-- Also fix leads table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'leads_chat_id_fkey' 
               AND table_name = 'leads') THEN
        ALTER TABLE public.leads DROP CONSTRAINT leads_chat_id_fkey;
        ALTER TABLE public.leads 
        ADD CONSTRAINT leads_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Fix chat_feedback table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'chat_feedback_chat_id_fkey' 
               AND table_name = 'chat_feedback') THEN
        ALTER TABLE public.chat_feedback DROP CONSTRAINT chat_feedback_chat_id_fkey;
        ALTER TABLE public.chat_feedback 
        ADD CONSTRAINT chat_feedback_chat_id_fkey 
        FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
    END IF;
END $$;

COMMENT ON CONSTRAINT messages_chat_id_fkey ON public.messages IS 'Cascade delete messages when chat is deleted';






