import { createClient } from '../../utils/supabase/client';

const supabase = createClient(); //    actual client instance


// Get all messages for a chat
export async function getMessagesForChat(chatId) {
  const { data, error } = await supabase
    .from('messages')
    .select('role, content') // adapt column names if yours are different
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }
  console.log('mesages ' , data );
  
  // Ensure consistent shape for UI
  return data.map(msg => {
    return {text:msg.content , is_user:msg.role === 'user'?true:false}
  })
}

// Add a new message (user or assistant)
export async function addMessageToChat(chatId, role, content) {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      { chat_id: chatId, 
          role,      // 'user' or 'assistant'
        content,   // message text
      }, 
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
