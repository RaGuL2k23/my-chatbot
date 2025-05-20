import { createClient } from '../../utils/supabase/client';

const supabase = createClient(); //    actual client instance

// Get all chats for a user
export async function getUserChats(userId) {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

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
