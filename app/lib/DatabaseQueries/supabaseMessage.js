import { createClient } from '../../utils/supabase/client';

const supabase = createClient(); //    actual client instance


// Get all messages for a chat
export async function getMessagesForChat(chatId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// Add a new message (user or assistant)
export async function addMessage(chatId, role, content) {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      { chat_id: chatId, role, content },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// (Optional) Add multiple messages in a batch
export async function addMessagesBatch(chatId, messages) {
  const payload = messages.map(({ role, content }) => ({
    chat_id: chatId,
    role,
    content,
  }));

  const { data, error } = await supabase
    .from('messages')
    .insert(payload);

  if (error) throw error;
  return data;
}
