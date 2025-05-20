import axios from 'axios'
import { addMessageToChat } from '@/app/lib/DatabaseQueries/supabaseMessage'

export async function sendTextMessage(
  textInput,
  messages,
  appendMessage,
  setTextInput,
  maxContextMessages,
  chatId // ✅ Pass chatId here
) {
  if (!textInput.trim()) return

  appendMessage(textInput, true)
  await addMessageToChat(chatId, 'user', textInput) // ✅ Save user message

  let context = messages.slice(-maxContextMessages * 2)
  context = context.map(e => (!e.isUser ? { ...e, text: e.text.slice(40) } : e))

  const prompt = [
    ...context.map(m => (m.isUser ? `User: ${m.text}` : `AI: ${m.text}`)),
    `User: ${textInput}`,
    `AI: `,
  ].join('\n')

  try {
    const res = await axios.post('/api/gemini', { message: prompt })
    const reply = res.data.reply || 'No reply.'
    appendMessage(reply, false)
    await addMessageToChat(chatId, 'assistant', reply) // ✅ Save AI reply
  } catch (err) {
    console.log('Gemini Error:', err.message)
    appendMessage('❌ Error: ' + err.message, false)
  } finally {
    setTextInput('')
  }
}
