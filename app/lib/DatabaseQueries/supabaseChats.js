import { createClient } from '../../utils/supabase/client';

const supabase = createClient(); //    actual client instance

// Get all chats for a user
export async function getUserChats(userId, limit) {
  let query = supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// Create a new chat for a user
export async function createNewChat(userId, title = null) {
  const { data, error } = await supabase
    .from('chats')
    .insert([{ user_id: userId, title }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteChat(chatId) {
  // First delete messages related to this chat
  const { error: msgError } = await supabase
    .from('messages')
    .delete()
    .eq('chat_id', chatId)

  if (msgError) throw msgError

  // Then delete the chat itself
  const { error: chatError } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId)

  if (chatError) throw chatError

  return true
}


// Rename a chat
export async function updateChatTitle(chatId, newTitle) {
  const { data, error } = await supabase
    .from('chats')
    .update({ title: newTitle })
    .eq('id', chatId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
