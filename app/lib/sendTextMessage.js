import axios from 'axios'

export async function sendTextMessage(textInput, messages, appendMessage, setTextInput, maxContextMessages) {
  if (!textInput.trim()) return

  appendMessage(textInput, true)

  // Take last few messages (user + AI) to use as context
  const context = messages.slice(-maxContextMessages)

  const prompt = [
    ...context.map(m => (m.isUser ? `User: ${m.text}` : `AI: ${m.text}`)),
    `User: ${textInput}`,
    `AI:`
  ].join('\n')

  try {
    const res = await axios.post('/api/gemini', { message: prompt })
    const reply = res.data.reply || 'No reply.'
    appendMessage(reply, false)
  } catch (err) {
    console.error('Error from Gemini API:', err, err.message)
    appendMessage('❌ Error: Something went wrong. Try again.', false)
  } finally {
    setTextInput('')
  }
}