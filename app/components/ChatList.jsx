'use client'

import { useEffect, useState } from 'react'
import { getUserChats } from '@/app/lib/DatabaseQueries/supabaseChats' 

const ChatList = ({ userId, currentChatId , setCurrentChatId }) => {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true)
      const result = await getUserChats(userId)
      setChats(result || [])
      setLoading(false)
    }

    if (userId) fetchChats()
  }, [userId])

  const handleChatClick = async (chat) => {
    if (chat.id === currentChatId) {
    // Same chat clicked, do nothing
    return
  }
    setCurrentChatId(chat.id)
 
  }

  return (
    <div className="bg-gray-800 text-white p-4 border-r border-gray-700 w-full max-w-xs">
      <h2 className="text-lg font-semibold mb-4">Your Chats</h2>
      {loading && <p>Loading...</p>}
      {chats.length === 0 && !loading && (
        <p className="text-gray-400 text-sm">No chats yet.</p>
      )}
      <ul className="space-y-2">
        {chats.map(chat => (
          <li key={chat.id}>
            <button
              onClick={() => handleChatClick(chat)}
              className="w-full text-left p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
            >
              {chat.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatList
