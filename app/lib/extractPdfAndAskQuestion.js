import axios from 'axios'

import { addMessageToChat } from '@/app/lib/DatabaseQueries/supabaseMessage'

export async function extractPdfAndAskQuestion(
  file,
  question,
  appendMessage,
  setFile,
  setIsExtracting,
  messages,
  maxContextMessages,
  chatId // ✅ New param
) {
  if (!file || !question.trim()) {
    appendMessage('❌ Please select a file and ask a question.', false)
    return
  }

  appendMessage(`📎 (File Selected: ${file.name})`, false)
  await addMessageToChat(chatId, 'user', question) // ✅ Save question

  try {
    setIsExtracting(true)

    const formData = new FormData()
    formData.append('file', file)

    const extractRes = await axios.post('/api/extract-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    const extractedText = extractRes.data.text
    appendMessage(`📄 Extracted Preview:\n${extractedText.slice(0, 300)}...`, false)

    const context = messages.slice(-maxContextMessages * 2)
    const contextString = context
      .map(m => (m.isUser ? `User: ${m.text}` : `AI: ${m.text}`))
      .join('\n')

    const prompt = `
You are an assistant named Rocky's AI. Here's the chat history:
"""
${contextString}
"""
PDF content:
"""
${extractedText}
"""
Question: "${question}"
Answer based on the PDF and conversation.
    `.trim()

    const geminiRes = await axios.post('/api/gemini', { message: prompt })
    const reply = geminiRes.data.reply || 'No reply.'

    appendMessage(reply, false)
    await addMessageToChat(chatId, 'assistant', reply) // ✅ Save response

    setFile(null)
  } catch (error) {
    console.error('extractPdfAndAskQuestion error:', error)
    appendMessage('❌ Error: ' + error.message, false)
  } finally {
    setIsExtracting(false)
  }
}
