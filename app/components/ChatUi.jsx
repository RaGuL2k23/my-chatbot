'use client'
import { useState, useRef } from 'react'
import ChatBubble from './ChatBubble'
import { sendText } from '../lib/sendText'
import { sendFileQuestion } from '../lib/sendFileQuestion'

export function ChatUI() {
  const [messages, setMessages] = useState([])
  const [textInput, setTextInput] = useState('')
  const [file, setFile] = useState(null)
  const [question, setQuestion] = useState('')
  const fileInputRef = useRef(null) // ✅ For resetting file input

  const appendMessage = (text, isUser) => {
    setMessages(msgs => [...msgs, { text, isUser }])
  }
  
  return (
    <div className="flex flex-col gap-4">
      {/* Chat display */}
      <div className="h-80 overflow-y-auto p-4 bg-black rounded shadow text-white flex flex-col">
        {messages.map((m, i) => (
          <ChatBubble key={i} message={m.text} isUser={m.isUser} />
        ))}
      </div>

      {/* Text chat */}
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={() => {
            sendText(textInput, messages, appendMessage)
            setTextInput('')
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>

      {/* File chat */}
      <div className="flex items-center gap-2 pt-4 border-t">
        <input
          type="file"
          accept="application/pdf"
          onChange={e => setFile(e.target.files[0])}
          className="p-2 border rounded"
          ref={fileInputRef} // ✅ Reference to file input
        />
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Question about the PDF..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <button
          onClick={async () => {
            await sendFileQuestion(file, question, appendMessage, setFile, setQuestion)
            if (fileInputRef.current) fileInputRef.current.value = null // ✅ Reset file input
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Ask File
        </button>
      </div>
    </div>
  )
}
