'use client'

import { useState, useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble'
import { sendTextMessage } from '../lib/sendTextMessage'
import { extractPdfAndAskQuestion } from '../lib/extractPdfAndAskQuestion'
import { Upload, Loader2, SendHorizontal } from 'lucide-react'

const MAX_CONTEXT_MESSAGES = 20

export function ChatUI() {
  const [messages, setMessages] = useState([])
  const [textInput, setTextInput] = useState('')
  const [file, setFile] = useState(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isExtracting])

  const appendMessage = (text, isUser) => {
    setMessages(msgs => [...msgs, { text, isUser }])
  }

  const handleSend = async () => {
    const currentTextInput = textInput.trim()
    const isFileSelected = !!file

    if (!currentTextInput && !isFileSelected) return

    setTextInput('')

    if (isFileSelected) {
      setIsExtracting(true)
      appendMessage(`Extracting information from "${file.name}" and processing your question...`, false)

      await extractPdfAndAskQuestion(
        file,
        currentTextInput,
        appendMessage,
        setFile,
        setIsExtracting,
        messages,
        MAX_CONTEXT_MESSAGES
      )

      if (fileInputRef.current) fileInputRef.current.value = null
    } else {
      await sendTextMessage(
        currentTextInput,
        messages,
        appendMessage,
        sendTextMessage,
        MAX_CONTEXT_MESSAGES
      )
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden bg-gray-900 text-white border border-gray-800">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 text-white font-bold text-2xl text-center shadow-md">
        AI Document Chat
      </div>

      {/* Chat Display Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
        {messages.length === 0 && !isExtracting && (
          <div className="flex items-center justify-center h-full text-center text-gray-400 italic text-lg p-4">
            Start a conversation by typing a message or uploading a PDF to ask questions!
          </div>
        )}
        {messages.map((m, i) => (
          <ChatBubble key={i} message={m.text} isUser={m.isUser} />
        ))}
        {isExtracting && (
          <ChatBubble message="Thinking..." isUser={false} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-3 p-4 border-t border-gray-700 bg-gray-900">
        <input
          type="file"
          accept="application/pdf"
          onChange={e => {
            setFile(e.target.files[0])
            setTextInput('')
          }}
          className="hidden"
          id="file-upload"
          ref={fileInputRef}
          disabled={isExtracting}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition duration-200 ease-in-out ${isExtracting ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={file ? `Change file (${file.name})` : 'Upload PDF'}
        >
          <Upload className="h-6 w-6" />
          {file && <span className="ml-2 text-sm max-w-[100px] truncate">{file.name}</span>}
        </label>

       <textarea
  className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out resize-none min-h-[3rem] max-h-[140px] overflow-y-auto"
  value={textInput}
  onChange={e => setTextInput(e.target.value)}
  placeholder={file ? `Ask about "${file.name}"...` : 'Type your message here...'}
  disabled={isExtracting}
  rows={1}
  onInput={(e) => {
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey && (textInput.trim() || file) && !isExtracting) {
      e.preventDefault()
      handleSend()
    }
  }}
/>



        <button
          onClick={handleSend}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out"
          disabled={isExtracting || (!textInput.trim() && !file)}
        >
          {isExtracting ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <>
              Send
              <SendHorizontal className="h-5 w-5 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
