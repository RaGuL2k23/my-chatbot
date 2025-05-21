import axios from 'axios';
import { addMessageToChat } from '@/app/lib/DatabaseQueries/supabaseMessage';

/**
 * Sends a user text message with recent chat context to the Gemini API,
 * appends messages to the UI, and saves them to Supabase.
 *
 * @param {string} textInput - The user’s input message.
 * @param {Array} messages - The current chat history.
 * @param {Function} appendMessage - Function to append a message to the UI.
 * @param {Function} setTextInput - Setter to clear input after sending.
 * @param {number} maxContextMessages - Number of past messages to include in the prompt.
 * @param {string} chatId - Chat session ID (for Supabase storage).
 */
export async function sendTextMessage(
  textInput,
  messages,
  appendMessage,
  setTextInput,
  maxContextMessages,
  chatId
) {
  if (!textInput.trim()) return;

  appendMessage(textInput, true);
  await addMessageToChat(chatId, 'user', textInput); // Save user message

  // Limit context and optionally trim older assistant replies
  let context = messages.slice(-maxContextMessages * 2);
  context = context.map(m =>
    m.isUser ? m : { ...m, text: m.text.slice(40) } // Trim AI replies
  );

  const prompt = [
    ...context.map(m => (m.isUser ? `User: ${m.text}` : `AI: ${m.text}`)),
    `User: ${textInput}`,
    `AI:`
  ].join('\n');

  try {
    const res = await axios.post('/api/gemini', { message: prompt });
    const reply = res.data.reply || 'No reply.';
    appendMessage(reply, false);
    await addMessageToChat(chatId, 'assistant', reply); // Save AI reply
  } catch (err) {
    console.error('Gemini Error:', err.message);
    appendMessage('❌ Error: ' + err.message, false);
  } finally {
    setTextInput('');
  }
}
