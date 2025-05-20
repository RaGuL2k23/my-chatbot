import axios from 'axios'

export async function extractPdfAndAskQuestion(
  file,
  question,
  appendMessage,
  setFile,
  setIsExtracting,
  messages,
  maxContextMessages
) {
  if (!file) {
    appendMessage('Please select a PDF file.', false)
    return
  }

  if (!question.trim()) {
    appendMessage('Please enter a question about the PDF.', false)
    return
  }

  appendMessage(`📎 (File Selected: ${file.name})`, false)

  try {
    setIsExtracting(true) // Set extracting state at the beginning

    // 1. Extract text from the PDF
    const formData = new FormData()
    formData.append('file', file)

    const extractRes = await axios.post('/api/extract-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const extractedText = extractRes.data.text
    appendMessage(`📄 (Preview of Extracted Text):\n${extractedText.slice(0, 300)}...`, false)

    // 2. Create the prompt for Gemini with PDF context AND chat history
    const context = messages.slice(-maxContextMessages);
    const contextString = context
      .map(m => (m.isUser ? `User: ${m.text}` : `AI: ${m.text}`))
      .join('\n');

    const prompt = `
You are an AI assistant. The user has the following chat history:
"""
${contextString}
"""

The user has now uploaded a PDF and asked a question about it.

Here is the extracted text from the PDF:
"""
${extractedText}
"""

Here is the user's question:
"${question}"

Please provide a helpful answer based only on the above PDF content, while also considering the prior conversation if relevant.
    `.trim()

    // 3. Send prompt to Gemini
    const geminiRes = await axios.post('/api/gemini', { message: prompt })
    const reply = geminiRes.data.reply || 'No reply from Gemini.'

    appendMessage(reply, false)

    // 4. Clear file state
    setFile(null)

  } catch (error) {
    console.error('❌ extractPdfAndAskQuestion error:', error)
    const msg = error.response?.data?.message || 'An error occurred during file analysis or Gemini request.'
    appendMessage(msg, false)
  } finally {
    setIsExtracting(false)
  }
}