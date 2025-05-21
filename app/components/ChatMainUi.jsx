'use client'
import { useState } from "react"
import ChatList from "./ChatList"
import { ChatUI } from "./ChatUi"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getUserChats } from "../lib/DatabaseQueries/supabaseChats"

export const ChatMain = ({ userSessionData }) => {
  const [currentChatId, setCurrentChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [isChatListOpen, setIsChatListOpen] = useState(true)
  const [chats, setChats] = useState([])

const refreshChatList = async () => {
  const result = await getUserChats(userSessionData.user.id)
  console.log('resulsts ' , result);
  
  setChats(result || [])
}
  const toggleChatList = () => {
    setIsChatListOpen(!isChatListOpen)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto text-white">
      {/* Collapse/Open Button (Leftmost) */}
      <button
        onClick={toggleChatList}
        className={`bg-gray-700 hover:bg-gray-600 text-white absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-in-out z-10 left-0 rounded-r-md px-2 py-3`}
        aria-label={isChatListOpen ? 'Collapse Chat List' : 'Open Chat List'}
        title={isChatListOpen ? 'Collapse Chat List' : 'Open Chat List'}
      >
        {isChatListOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>

      {/* Chat List */}
      <div
        className={`bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto transition-all duration-300 ease-in-out ${
          isChatListOpen ? 'w-64' : 'w-0'
        } ${!isChatListOpen && 'invisible'}`}
      >
        {isChatListOpen && (
          <ChatList
            userId={userSessionData.user.id}
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
            setMessages={setMessages}
            chats={chats}
            setChats={setChats}
          />
        )}
      </div>

      {/* Chat UI (Takes remaining wider space) */}
      <div className="flex-1 flex flex-col rounded-xl shadow-2xl overflow-hidden bg-gray-900 border border-gray-800">
        <ChatUI
          userSessionData={userSessionData}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          messages={messages}
          setMessages={setMessages}
          refreshChatList={refreshChatList}
        />
      </div>
    </div>
  )
}