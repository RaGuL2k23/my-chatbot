import axios from 'axios'

export async function sendFileQuestion(file, question, appendMessage, setFile, setQuestion) {
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

    // 2. Create the prompt for Gemini
    const prompt = `
You are an AI assistant. A user has uploaded a PDF and asked a question about it.

Here is the extracted text from the PDF:
"""
${extractedText}
"""

Here is the user's question:
"${question}"

Please provide a helpful answer based only on the above content.
    `.trim()

    // 3. Send prompt to Gemini
    const geminiRes = await axios.post('/api/gemini', { message: prompt })
    const reply = geminiRes.data.reply || 'No reply from Gemini.'

    appendMessage(reply, false)

    // 4. Clear inputs
    setFile(null)
    setQuestion('')

  } catch (error) {
    console.error('❌ sendFileQuestion error:', error)
    const msg = error.response?.data?.message || 'An error occurred during file analysis or Gemini request.'
    appendMessage(msg, false)
  }
}
