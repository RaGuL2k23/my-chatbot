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
    console.log('results ', result)
    setChats(result || [])
  }

  const toggleChatList = () => {
    setIsChatListOpen(!isChatListOpen)
  }

  return (
    <section className="flex flex-col "> 
        <div className="flex relative flex-1     text-white bg-gray-800 rounded-lg shadow-md overflow-hidden">

      {/* Collapse/Open Button */}
      <button
        onClick={toggleChatList}
        className={`bg-gray-700 hover:bg-gray-600 text-white absolute top-2 left-2 rounded-md p-2 transition-all duration-300 ease-in-out z-20 focus:outline-none`}
        aria-label={isChatListOpen ? 'Collapse Chat List' : 'Open Chat List'}
        title={isChatListOpen ? 'Collapse Chat List' : 'Open Chat List'}
      >
        {isChatListOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>

      {/* Chat List Sidebar */}
      <aside
        className={`bg-gray-700 border-r border-gray-600 overflow-y-auto transition-all duration-300 ease-in-out ${
          isChatListOpen ? 'w-64' : 'w-0'
        } ${!isChatListOpen && 'invisible'}`}
      >
        {isChatListOpen && (
          <div className="p-3">
            <h2 className="text-lg font-semibold mb-3 text-gray-300 text-center">Chats</h2>
            <ChatList
              userId={userSessionData.user.id}
              currentChatId={currentChatId}
              setCurrentChatId={setCurrentChatId}
              setMessages={setMessages}
              chats={chats}
              setChats={setChats}
              refreshChatList={refreshChatList} // Passing the function here
            />
          </div>
        )}
      </aside>

      {/* Chat UI Panel - takes remaining space */}
      <main className="flex-1 flex flex-col bg-gray-800">
        <ChatUI
          userSessionData={userSessionData}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          messages={messages}
          setMessages={setMessages}
          refreshChatList={refreshChatList}
        />
      </main>
    </div>
    </section>
  )
}