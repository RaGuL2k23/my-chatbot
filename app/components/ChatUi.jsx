'use client'

import { useState } from 'react'

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Upload a PDF or ask me something.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { sender: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })

      const data = await res.json()
      const botReply = { sender: 'bot', text: data.reply }

      setMessages(prev => [...prev, botReply])
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Gemini API error.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg max-w-xl mx-auto">
      <div className="mb-4 h-64 overflow-y-auto bg-gray-100 p-3 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-1 rounded-full ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-grow border px-3 py-2 rounded"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask something..."
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default ChatBox
