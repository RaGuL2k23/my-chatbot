import axios from 'axios';
import { addMessageToChat } from '@/app/lib/DatabaseQueries/supabaseMessage';

/**
 * Extracts text from a PDF file and sends a user question with context
 * to the Gemini API, updating UI and saving messages to Supabase.
 *
 * @param {File} file - PDF file selected by the user.
 * @param {string} question - The user's question.
 * @param {Function} appendMessage - Function to add a message to the UI.
 * @param {Function} setFile - Setter to clear the file input.
 * @param {Function} setIsExtracting - Setter to control loading state.
 * @param {Array} messages - Chat history (user and assistant messages).
 * @param {number} maxContextMessages - Number of messages to include as context.
 * @param {string} chatId - ID of the chat session (for Supabase storage).
 */
export async function extractPdfAndAskQuestion(
  file,
  question,
  appendMessage,
  setFile,
  setIsExtracting,
  messages,
  maxContextMessages,
  chatId
) {
  if (!file || !question.trim()) {
    appendMessage('❌ Please select a file and ask a question.', false);
    return;
  }

  appendMessage(`📎 (File Selected: ${file.name})`, false);
  await addMessageToChat(chatId, 'user', question); // Save user message

  try {
    setIsExtracting(true);

    const formData = new FormData();
    formData.append('file', file);

    // Send file to API for extraction
    const extractRes = await axios.post('/api/extract-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const extractedText = extractRes.data.text;
    appendMessage(`📄 Extracted Preview:\n${extractedText.slice(0, 300)}...`, false);

    // Build chat context string
    const context = messages.slice(-maxContextMessages * 2);
    const contextString = context
      .map(m => (m.isUser ? `User: ${m.text}` : `AI: ${m.text}`))
      .join('\n');

    // Prompt sent to Gemini API
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
    `.trim();

    const geminiRes = await axios.post('/api/gemini', { message: prompt });
    const reply = geminiRes.data.reply || 'No reply.';

    appendMessage(reply, false);
    await addMessageToChat(chatId, 'assistant', reply); // Save assistant reply

    setFile(null);
  } catch (error) {
    console.error('extractPdfAndAskQuestion error:', error);
    appendMessage('❌ Error: ' + error.message, false);
  } finally {
    setIsExtracting(false);
  }
}
