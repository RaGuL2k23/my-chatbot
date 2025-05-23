'use client'
import { useEffect, useState } from 'react'
import { deleteChat, getUserChats } from '@/app/lib/DatabaseQueries/supabaseChats'
import { getMessagesForChat } from '@/app/lib/DatabaseQueries/supabaseMessage'
import { Trash2 } from 'lucide-react'

const ChatList = ({
  userId,        // string: Supabase user ID
  currentChatId,   // string or null: currently active chat ID
  setCurrentChatId, // function: sets current chat ID in parent
  setMessages ,     // function: sets messages in parent
  chats ,
  setChats
}) => {
  const [loading, setLoading] = useState(false)

  // Load chats on mount or when userId changes
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true)
      try {
        const result = await getUserChats(userId)
        setChats(result || [])
      } catch (err) {
        console.error('Failed to fetch chats:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchChats()
  }, [userId])

  // Handle clicking on a chat to switch context
  const handleChatClick = async (chat) => {
    if (chat.id === currentChatId) return

    setCurrentChatId(chat.id)
    const msgs = await getMessagesForChat(chat.id)
    setMessages(msgs)
  }

  // Handle deleting a chat
  const handleDeleteChat = async (chatId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this chat?')
    if (!confirmDelete) return

    try {
      await deleteChat(chatId)
      console.log(`Deleted chat ${chatId}`)

      // If user deleted the current chat, reset or fallback
      if (chatId === currentChatId) {
        setCurrentChatId(null)
        setMessages([])

        const remaining = await getUserChats(userId)
        setChats(remaining || [])

        if (remaining.length > 0) {
          setCurrentChatId(remaining[0].id)
          const msgs = await getMessagesForChat(remaining[0].id)
          setMessages(msgs)
        }
      } else {
        // Just refresh chat list
        const updated = await getUserChats(userId)
        setChats(updated || [])
      }
    } catch (err) {
      console.error('Failed to delete chat:', err.message)
      alert('Something went wrong while deleting the chat.')
    }
  }

  return (
    <div className="space-y-2">
      {loading && <p className="text-gray-400 text-sm">Loading chats...</p>}
      {!loading && chats.length === 0 && (
        <p className="text-gray-500 text-sm">No chats available.</p>
      )}

      <ul>
        {chats.map(chat => (
          <li key={chat.id} className="flex items-center justify-between rounded-md">
            <button
              onClick={() => handleChatClick(chat)}
              className={`w-full text-left py-2 px-3 rounded-md transition-colors duration-200 focus:outline-none ${
                chat.id === currentChatId
                  ? 'bg-indigo-500 text-white'
                  : 'hover:bg-gray-600 text-gray-300'
              }`}
            >
              {chat.title}
            </button>
            <button
              onClick={() => handleDeleteChat(chat.id)}
              className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none transition-colors duration-200"
              aria-label={`Delete chat "${chat.title}"`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatList