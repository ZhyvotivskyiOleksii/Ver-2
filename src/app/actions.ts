
'use server';

import { cookies } from 'next/headers';
import { webImpulsChat, type WebImpulsChatInput } from '@/ai/flows/web-impuls-chat';
import { getSupabaseClient } from '@/lib/supabase';
import { translations } from '@/lib/translations';

async function getOrCreateChatId() {
  const cookieStore = await cookies();
  const supabase = getSupabaseClient();

  const existing = cookieStore.get('chat_id')?.value;
  if (existing) {
    try {
      // Validate that the chat exists; if not, create a new one
      const { data: chatRow, error: selErr } = await supabase
        .from('chats')
        .select('id')
        .eq('id', existing)
        .maybeSingle();
      if (!selErr && chatRow?.id) return chatRow.id as string;
    } catch {}
  }

  const { data, error } = await supabase
    .from('chats')
    .insert({})
    .select('id')
    .single();

  if (error || !data?.id) {
    throw new Error(`Failed to create chat: ${error?.message || 'unknown error'}`);
  }

  cookieStore.set('chat_id', data.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // 30 days
    maxAge: 60 * 60 * 24 * 30,
  });
  return data.id as string;
}

export async function generateSuggestion(input: WebImpulsChatInput) {
  try {
    const supabase = getSupabaseClient();
    const chatId = await getOrCreateChatId();

    // Check if this is the first message in this chat (new conversation)
    const { count: msgCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chatId);
    
    const isFirstMessage = (msgCount || 0) === 0;

    // Save user message
    const { error: insertUserErr } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, role: 'user', content: input.query });
    if (insertUserErr) {
      console.error('Supabase insert user message error:', insertUserErr);
    }

    // Notify Telegram about new chat conversation
    if (isFirstMessage) {
      try {
        await notifyTelegram(`💬 Новий чат розпочато!\n\nПерше повідомлення: ${input.query.substring(0, 200)}${input.query.length > 200 ? '...' : ''}\n\nchat_id: ${chatId}`);
      } catch (e) {
        console.error('Telegram notify new chat error:', e);
      }
    }

    // Try to capture contact (email/phone) from the user's message
    try {
      const contact = extractContact(input.query);
      if (contact) {
        await upsertLead({ chatId, locale: input.locale, firstMessage: input.query, source: 'chat', ...contact });
      }
    } catch (e) {
      console.error('Lead capture error:', e);
    }

    // Load known lead name to personalize responses
    let customerName: string | undefined = undefined;
    try {
      const { data: leadRow } = await supabase
        .from('leads')
        .select('name')
        .eq('chat_id', chatId)
        .maybeSingle();
      customerName = (leadRow?.name || undefined) as string | undefined;
    } catch {}

    // Get AI response (with optional name)
    const result = await webImpulsChat({ ...input, customerName });
    if (!result?.response) {
      return { success: false, error: 'AI returned an empty response.' };
    }

    // Save assistant message
    const { error: insertAiErr } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, role: 'assistant', content: result.response });
    if (insertAiErr) {
      console.error('Supabase insert assistant message error:', insertAiErr);
    }

    // Heuristic: suggest leaving contact if user intent is clear enough
    let askContact = false;
    try {
      const { data: lead } = await supabase
        .from('leads')
        .select('id')
        .eq('chat_id', chatId)
        .maybeSingle();
      const userMsgs = (input.chatHistory || []).filter((m) => m.role === 'user').length + 1; // include current
      const q = (input.query || '').toLowerCase();
      const priceIntent = /(цена|вартість|скільки|бюджет|стоимость|срок|термін|price|budget|cost|timeline|how long)/i.test(q);
      const contactIntent = /(контакт|email|e-mail|почта|пошта|телефон|phone|номер|contact)/i.test(q);
      const readyIntent = /(заказать|замовити|готов|готовий|start|начать|почати|купить|оплатить|order)/i.test(q);
      // Be less pushy: only suggest contact after more context
      // - immediately if user asks to be contacted or ready to start
      // - or after 3+ user turns AND price/timeline intent observed
      if (!lead && (contactIntent || readyIntent || (userMsgs >= 3 && priceIntent))) askContact = true;
    } catch (e) {
      console.error('askContact heuristic error:', e);
    }

    return { success: true, data: { ...result, askContact } };
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error in generateSuggestion:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function getChatHistory(locale?: string) {
  try {
    const supabase = getSupabaseClient();
    const cookieStore = await cookies();
    const existingChatId = cookieStore.get('chat_id')?.value;
    
    // Check if existing chat_id is valid (exists in DB)
    let chatExists = false;
    if (existingChatId) {
      const { data: chatRow } = await supabase
        .from('chats')
        .select('id')
        .eq('id', existingChatId)
        .maybeSingle();
      chatExists = !!chatRow?.id;
    }
    
    // If chat doesn't exist in DB, signal frontend to reset
    if (existingChatId && !chatExists) {
      // Delete invalid cookie
      cookieStore.delete('chat_id');
      return { success: true, data: { chatId: null, messages: [], needsReset: true } };
    }
    
    const chatId = await getOrCreateChatId();

    const { data, error } = await supabase
      .from('messages')
      .select('role, content, created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase fetch messages error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { chatId, messages: data ?? [], needsReset: false } };
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error in getChatHistory:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

// --- Lead capture helpers ---

export async function appendUserMessage(content: string) {
  try {
    const supabase = getSupabaseClient();
    const chatId = await getOrCreateChatId();
    const { error } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, role: 'user', content });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

function extractContact(text: string): { email?: string; phone?: string } | null {
  if (!text) return null;
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  // phone: allow +, spaces, dashes, parentheses; require at least 8 digits
  const phoneDigits = (text.match(/[+()\d][\d\s().-]{6,}/g) || [])
    .map(s => s.replace(/[^\d+]/g, ''))
    .filter(s => (s.replace(/\D/g, '').length >= 8));
  const phone = phoneDigits[0];
  const email = emailMatch ? emailMatch[0] : undefined;
  if (!email && !phone) return null;
  return { email, phone };
}

// Надсилає повідомлення у Telegram-чат бота.
// Значення беруться з env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
async function notifyTelegram(text: string) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return; // silently skip if not configured
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
      // Avoid caching on some platforms
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('Telegram notify failed', await res.text());
    }
  } catch (e) {
    console.error('Telegram notify error:', e);
  }
}

// Створює або оновлює лід у таблиці public.leads
// Сповіщення у Telegram надсилається тільки при створенні нового ліда (status = created)
type LeadUpsertInput = {
  chatId: string;
  email?: string;
  phone?: string;
  name?: string;
  locale?: string;
  firstMessage?: string;
  source?: 'chat' | 'form' | 'unknown';
  notify?: boolean; // default true only for created
};
async function upsertLead({ chatId, email, phone, name, locale, firstMessage, source = 'unknown', notify = true }: LeadUpsertInput) {
  const supabase = getSupabaseClient();
  // Check if lead exists for this chat
  const { data: existing, error: selErr } = await supabase
    .from('leads')
    .select('id, email, phone, name')
    .eq('chat_id', chatId)
    .maybeSingle();
  if (selErr) {
    console.error('Select lead error:', selErr);
    return { status: 'error' as const };
  }
  if (!existing) {
    const { data: insData, error } = await supabase
      .from('leads')
      .insert({ chat_id: chatId, email, phone, name, locale: locale || 'ua', first_message: firstMessage || null })
      .select('id')
      .single();
    if (error) {
      console.error('Insert lead error:', error);
      return { status: 'error' as const };
    }
    if (notify) {
      // Сповіщення у Telegram про новий лід (одне, з чітким джерелом)
      const isEmail = (s?: string) => !!(s && /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(s.trim()));
      const isPhone = (s?: string) => !!(s && (s.replace(/\D/g, '').length >= 8));
      const looksLikePureContact = (s?: string) => {
        if (!s) return false;
        const t = s.trim();
        if (!t) return false;
        if (isEmail(t) || isPhone(t)) return true; // чистий email або телефон
        return false;
      };
      const isStructuredBlock = (s?: string) => !!(s && /(Ім'я\s*:|Контакт\s*:|Повідомлення\s*:)/i.test(s));

      const sourceLabel = source === 'chat' ? 'чат' : source === 'form' ? 'форма' : 'чат/форма';
      const parts = [
        '🔔 Новий лід',
        `Джерело: ${sourceLabel}`,
        `chat_id: ${chatId}`,
        name ? `ім'я: ${name}` : null,
        email ? `email: ${email}` : null,
        phone ? `phone: ${phone}` : null,
        // Якщо firstMessage схожий на чистий контакт — не дублюємо його як "Повідомлення"
        // Якщо це структурований блок (форма Hero) — додаємо окремим блоком "Анкета:"
        (firstMessage && isStructuredBlock(firstMessage)) ? `Анкета:\n${firstMessage}`
          : (firstMessage && !looksLikePureContact(firstMessage)) ? `Повідомлення: ${firstMessage}`
          : null,
      ].filter(Boolean);
      await notifyTelegram(parts.join('\n'));
    }
    return { status: 'created' as const, id: insData?.id };
  }
  // Оновлюємо тільки якщо з'явилась нова інформація
  const next: any = {};
  if (email && !existing.email) next.email = email;
  if (phone && !existing.phone) next.phone = phone;
  if (name && !existing.name) next.name = name;
  if (Object.keys(next).length === 0) return { status: 'noop' as const };
  const { error: updErr } = await supabase.from('leads').update(next).eq('id', existing.id);
  if (updErr) {
    console.error('Update lead error:', updErr);
    return { status: 'error' as const };
  }
  return { status: 'updated' as const, id: existing.id };
}

export async function saveContact(value: string, locale?: string) {
  try {
    const chatId = await getOrCreateChatId();
    const detected = extractContact(value);
    if (!detected) {
      return { success: false, error: 'Введите корректный e-mail или телефон.' };
    }
    // Зберігаємо як лід (телефон/e‑mail). Сповіщення лише в upsertLead (created), джерело — чат.
    await upsertLead({ chatId, locale, firstMessage: value, source: 'chat', ...detected });
    return { success: true };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error('saveContact error:', err);
    return { success: false, error: err.message };
  }
}

// Зберігає ім'я та контакт одним запитом з чату
export async function saveLeadDetails(input: { name?: string; contact: string; locale?: string }) {
  try {
    const currentChatId = await getOrCreateChatId();
    const detected = extractContact(input.contact);
    const name = input.name?.trim() || undefined;
    if (!detected) return { success: false, error: 'Вкажіть коректний e-mail або телефон.' };

    const supabase = getSupabaseClient();

    // 1) Спробувати знайти існуючий лід за email/телефоном і прийняти пов'язаний чат
    try {
      const candidates: Array<{ id: number; chat_id: string; updated_at: string; created_at: string }> = [] as any;
      if (detected.email) {
        const { data: byEmail } = await supabase
          .from('leads')
          .select('id, chat_id, updated_at, created_at')
          .eq('email', detected.email)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (Array.isArray(byEmail) && byEmail.length > 0) candidates.push(byEmail[0] as any);
      }
      if (detected.phone) {
        const { data: byPhone } = await supabase
          .from('leads')
          .select('id, chat_id, updated_at, created_at')
          .eq('phone', detected.phone)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (Array.isArray(byPhone) && byPhone.length > 0) candidates.push(byPhone[0] as any);
      }
      if (candidates.length > 0) {
        const best = candidates.sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())[0];
        const foundChatId = best.chat_id;
        if (foundChatId && foundChatId !== currentChatId) {
          const adopted = await adoptChatSession(foundChatId);
          if (adopted?.success) {
            // Опційно доповнимо ім'я, якщо його ще не було
            if (name) {
              try { await supabase.from('leads').update({ name }).eq('id', best.id); } catch {}
            }
            return { success: true, data: { adopted: true as const, chatId: foundChatId } };
          }
        }
      }
    } catch (e) {
      // Не критично – продовжимо зі створенням/оновленням ліда для поточного чату
      console.error('match lead by contact failed:', e);
    }

    // 2) Якщо нічого не знайшли — звична поведінка: створити/оновити лід у поточному чаті
    await upsertLead({ chatId: currentChatId, ...detected, name, locale: input.locale, firstMessage: input.contact, source: 'chat' });
    return { success: true, data: { adopted: false as const, chatId: currentChatId } };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

// saveLeadForm was removed in revert

export async function getLeadStatus() {
  try {
    const chatId = await getOrCreateChatId();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .select('id, email, phone, name')
      .eq('chat_id', chatId)
      .maybeSingle();
    if (error) {
      console.error('getLeadStatus error:', error);
      return { success: false, error: error.message };
    }
    return { 
      success: true, 
      data: { 
        hasLead: !!data, 
        name: data?.name || null,
        email: data?.email || null, 
        phone: data?.phone || null 
      } 
    };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

export async function insertAssistantMessage(content: string) {
  try {
    const supabase = getSupabaseClient();
    const chatId = await getOrCreateChatId();
    const { error } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, role: 'assistant', content });
    if (error) {
      console.error('insertAssistantMessage error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

// Додає повідомлення асистента ТІЛЬКИ якщо чат вже існує (без створення нового)
export async function insertAssistantMessageIfExists(content: string) {
  try {
    const cookieStore = await cookies();
    const existing = cookieStore.get('chat_id')?.value;
    if (!existing) return { success: false, error: 'No chat session' };
    const supabase = getSupabaseClient();
    const { data: chat } = await supabase.from('chats').select('id').eq('id', existing).maybeSingle();
    if (!chat?.id) return { success: false, error: 'Chat not found' };
    const { error } = await supabase.from('messages').insert({ chat_id: existing, role: 'assistant', content });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

export async function getChatSession() {
  try {
    const chatId = await getOrCreateChatId();
    return { success: true, data: { chatId } };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

// Повертає існуючий chat_id, якщо він вже є у cookie та існує в БД. Не створює новий чат.
export async function getExistingChatSession() {
  try {
    const cookieStore = await cookies();
    const existing = cookieStore.get('chat_id')?.value;
    if (!existing) return { success: true, data: { chatId: null as string | null } };
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('chats').select('id').eq('id', existing).maybeSingle();
    if (error || !data?.id) return { success: true, data: { chatId: null as string | null } };
    return { success: true, data: { chatId: data.id as string } };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

// Прив'язує поточну сесію до наявного chat_id (для синхронізації між вкладками)
export async function adoptChatSession(chatId: string) {
  try {
    if (!chatId) return { success: false, error: 'chatId is required' };
    const cookieStore = await cookies();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('chats')
      .select('id')
      .eq('id', chatId)
      .maybeSingle();
    if (error) return { success: false, error: error.message };
    if (!data?.id) return { success: false, error: 'Chat not found' };

    // Set cookie to provided chatId to ensure server actions use shared session
    cookieStore.set('chat_id', chatId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return { success: true, data: { chatId } };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

export async function getChatMeta() {
  try {
    const supabase = getSupabaseClient();
    const chatId = await getOrCreateChatId();

    const [{ data: lead }, { data: lastMsg, error: lastErr }] = await Promise.all([
      supabase.from('leads').select('id').eq('chat_id', chatId).maybeSingle(),
      supabase
        .from('messages')
        .select('created_at, role')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false })
        .limit(1)
    ]);

    if (lastErr) {
      // not critical
      console.error('getChatMeta last message error:', lastErr);
    }

    return {
      success: true,
      data: {
        chatId,
        hasLead: !!lead,
        lastMessageAt: lastMsg?.[0]?.created_at || null,
        lastMessageRole: lastMsg?.[0]?.role || null,
      },
    };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

// Вертає метадані лише якщо чат вже існує; не створює новий
export async function getChatMetaIfExists() {
  try {
    const cookieStore = await cookies();
    const existing = cookieStore.get('chat_id')?.value;
    if (!existing) {
      return { success: true, data: { chatId: null as string | null, hasLead: false, lastMessageAt: null as any, lastMessageRole: null as any } };
    }
    const supabase = getSupabaseClient();
    const [{ data: lead }, { data: lastMsg, error: lastErr }] = await Promise.all([
      supabase.from('leads').select('id').eq('chat_id', existing).maybeSingle(),
      supabase
        .from('messages')
        .select('created_at, role')
        .eq('chat_id', existing)
        .order('created_at', { ascending: false })
        .limit(1)
    ]);
    if (lastErr) {
      console.error('getChatMetaIfExists last message error:', lastErr);
    }
    return { success: true, data: { chatId: existing, hasLead: !!lead, lastMessageAt: lastMsg?.[0]?.created_at || null, lastMessageRole: lastMsg?.[0]?.role || null } };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

// Створює нову сесію чату (новий chat_id) і встановлює cookie.
export async function resetChatSession() {
  try {
    const cookieStore = await cookies();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('chats')
      .insert({})
      .select('id')
      .single();
    if (error || !data?.id) throw new Error(error?.message || 'Failed to create chat');

    cookieStore.set('chat_id', data.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return { success: true, data: { chatId: data.id as string } };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

// Створення ліда із форми на головній (Hero)
export async function createLeadFromForm(input: { name: string; contact: string; description: string; locale?: string }) {
  try {
    const chatId = await getOrCreateChatId();
    const detected = extractContact(input.contact);
    if (!detected) return { success: false, error: 'Вкажіть коректний e-mail або телефон.' };

    const firstMessage = `Ім'я: ${input.name}\nКонтакт: ${input.contact}\nПовідомлення: ${input.description}`;
    await upsertLead({ chatId, locale: input.locale, firstMessage, source: 'form', ...detected });

    // Якщо виникла помилка — вона буде прокинута в catch
    return { success: true };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error('createLeadFromForm error:', err);
    return { success: false, error: err.message };
  }
}

// Зберігає оцінку чату (1 = вподобалось, 0 = ні)
export async function submitChatFeedback(rating: 'up' | 'down') {
  try {
    const supabase = getSupabaseClient();
    const chatId = await getOrCreateChatId();
    const value = rating === 'up' ? 5 : 1;

    // Upsert feedback so один чат має одну оцінку
    let upsertOk = false;
    const { error: upsertErr } = await supabase
      .from('chat_feedback')
      .upsert({ chat_id: chatId, rating: value }, { onConflict: 'chat_id' });
    if (!upsertErr) {
      upsertOk = true;
    } else {
      // Fallback path: handle cases when unique constraint or update policy is missing in prod
      try {
        const { data: existingArr, error: selErr } = await supabase
          .from('chat_feedback')
          .select('id')
          .eq('chat_id', chatId)
          .order('id', { ascending: false })
          .limit(1);
        const existing = Array.isArray(existingArr) && existingArr.length > 0 ? existingArr[0] : null;
        if (!selErr && existing?.id) {
          const { error: updErr } = await supabase
            .from('chat_feedback')
            .update({ rating: value })
            .eq('id', existing.id);
          if (!updErr) upsertOk = true;
        } else {
          const { error: insErr } = await supabase
            .from('chat_feedback')
            .insert({ chat_id: chatId, rating: value });
          if (!insErr) upsertOk = true;
        }
      } catch (e) {
        // fall through with error
      }
    }
    if (!upsertOk) return { success: false, error: upsertErr?.message || 'Failed to save feedback' };

    // Запишемо маркер у стрічку повідомлень, щоб було видно в історії
    const marker = rating === 'up' ? '::feedback_up::' : '::feedback_down::';
    const { error: msgErr } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, role: 'assistant', content: marker });
    if (msgErr) {
      // Не критично: лог і продовжуємо
      console.error('Insert feedback marker error:', msgErr);
    }

    await notifyTelegram(`⭐️ Оцінка чату: ${rating === 'up' ? '👍' : '👎'}\nchat_id: ${chatId}`);
    return { success: true };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: err.message };
  }
}

// Сповіщення в Telegram про перехід на живий чат з AI
export async function notifyLiveChatTransfer(source: 'ai_button' | 'menu' = 'menu') {
  try {
    const supabase = getSupabaseClient();
    const chatId = await getOrCreateChatId();
    
    // Get lead info if exists
    const { data: lead } = await supabase
      .from('leads')
      .select('name, email, phone')
      .eq('chat_id', chatId)
      .maybeSingle();
    
    // Get last few messages for context
    const { data: messages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(3);
    
    const lastUserMessage = messages?.find(m => m.role === 'user')?.content;
    
    const sourceLabel = source === 'ai_button' ? 'кнопка в AI чаті' : 'меню чату';
    const parts = [
      '🔄 Перехід на живий чат',
      `Джерело: ${sourceLabel}`,
      `chat_id: ${chatId}`,
      lead?.name ? `Ім'я: ${lead.name}` : null,
      lead?.email ? `Email: ${lead.email}` : null,
      lead?.phone ? `Телефон: ${lead.phone}` : null,
      lastUserMessage ? `Останнє повідомлення: ${lastUserMessage.substring(0, 150)}${lastUserMessage.length > 150 ? '...' : ''}` : null,
    ].filter(Boolean);
    
    await notifyTelegram(parts.join('\n'));
    return { success: true };
  } catch (e) {
    console.error('notifyLiveChatTransfer error:', e);
    return { success: false };
  }
}
