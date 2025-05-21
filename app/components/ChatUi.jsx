'use client'

import { useState, useRef, useEffect } from 'react'
import { sendTextMessage } from '../lib/sendTextMessage'
import { extractPdfAndAskQuestion } from '../lib/extractPdfAndAskQuestion'
import { getUserChats, createNewChat } from '../lib/DatabaseQueries/supabaseChats'
import { getMessagesForChat } from '../lib/DatabaseQueries/supabaseMessage'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import ChatDisplay from './ChatDisplay'

const MAX_CONTEXT_MESSAGES = 20

export const ChatUI = ({ userSessionData ,currentChatId ,setCurrentChatId , messages , setMessages , refreshChatList}) => {
  const [textInput, setTextInput] = useState('')
  const [file, setFile] = useState(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isExtracting])

  useEffect(() => {
    const getCurrentChat = async () => {
      const userId = userSessionData?.user?.id
      if (!userId) return

      const res = await getUserChats(userId)

      if (res && res.length > 0) {
        const mostRecentChat = res[0]
        console.log('Using existing chat:', mostRecentChat)
        setCurrentChatId(mostRecentChat.id)
      } else {
        const now = new Date()
        const title = now.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
        const newChatRes = await createNewChat(userId, title)
        console.log('New chat created:', newChatRes)
        setCurrentChatId(newChatRes.id)
      }
    }

    getCurrentChat()
  }, [userSessionData?.user?.id, setCurrentChatId])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChatId) return
      const pastMessages = await getMessagesForChat(currentChatId)
      setMessages(pastMessages)
    }

    fetchMessages()
  }, [currentChatId, setMessages])

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
        MAX_CONTEXT_MESSAGES,
        currentChatId
      )

      if (fileInputRef.current) fileInputRef.current.value = null
    } else {
      await sendTextMessage(
        currentTextInput,
        messages,
        appendMessage,
        setTextInput,
        MAX_CONTEXT_MESSAGES,
        currentChatId
      )
    }
  }

  return (
    //h-screen flex flex-col overflow-hidden
<div className="flex border border-blue-400 overflow-hidden flex-col h-screen ">
      {/* Chat Header */}
      <ChatHeader
        userSessionData={userSessionData}
        setCurrentChatId={setCurrentChatId}
        setMessages={setMessages}
        refreshChatList={refreshChatList}
      />
      {/* Chat Display Area  flex-1 overflow-y-auto p-4 min-h-0 */}
      <div className="
      flex-1 min-h-0 overflow-hidden">
        <ChatDisplay
          messages={messages}
          isExtracting={isExtracting}
          messagesEndRef={messagesEndRef}
        />
      </div>
      {/* Input Area */}
      <div className="p-4 border-t border-gray-700">
        <ChatInput
          isExtracting={isExtracting}
          file={file}
          setFile={setFile}
          textInput={textInput}
          setTextInput={setTextInput}
          fileInputRef={fileInputRef}
          handleSend={handleSend}
        />
      </div>
    </div>
  )
}