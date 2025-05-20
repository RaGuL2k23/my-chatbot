'use client'

import { useState, useRef } from 'react'
import ChatBubble from './ChatBubble'
import { sendTextMessage } from '../lib/sendTextMessage'
import { extractPdfAndAskQuestion } from '../lib/extractPdfAndAskQuestion'

const MAX_CONTEXT_MESSAGES = 23 // Define your window size here

export function ChatUI() {
  const [messages, setMessages] = useState([])
  const [textInput, setTextInput] = useState('')
  const [file, setFile] = useState(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const fileInputRef = useRef(null) // ✅ For resetting file input

  const appendMessage = (text, isUser) => {
    setMessages(msgs => [...msgs, { text, isUser }])
  }

  const handleSend = async () => {
    if (file) {
      setIsExtracting(true)
      await extractPdfAndAskQuestion(
        file,
        textInput,
        appendMessage,
        setFile,
        setIsExtracting,
        messages, // Pass the 'messages' state
        MAX_CONTEXT_MESSAGES // Pass the context window size
      )
      if (fileInputRef.current) fileInputRef.current.value = null // ✅ Reset file input
      setTextInput('') // Clear input after sending file question
    } else {
      await sendTextMessage(textInput, messages, appendMessage, setTextInput, MAX_CONTEXT_MESSAGES) // Pass the context window size
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Chat display */}
      <div className="h-80 overflow-y-auto p-4 bg-black rounded shadow text-white flex flex-col">
        {messages.map((m, i) => (
          <ChatBubble key={i} message={m.text} isUser={m.isUser} />
        ))}
        {isExtracting && <ChatBubble message="Extracting and processing file..." isUser={false} />}
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          type="file"
          accept="application/pdf"
          onChange={e => {
            setFile(e.target.files[0])
            setTextInput('') // Clear text input when a file is selected
          }}
          className="p-2 border rounded"
          ref={fileInputRef}
        />
        <input
          className="flex-1 p-2 border rounded"
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          placeholder={file ? 'Ask a question about the PDF...' : 'Type a message or select a PDF'}
          disabled={isExtracting}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={isExtracting}
        >
          {isExtracting ? 'Processing...' : 'Send'}
        </button>
      </div>
    </div>
  )
}