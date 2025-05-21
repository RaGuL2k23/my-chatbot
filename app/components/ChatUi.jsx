'use client';

import { useState, useRef, useEffect } from 'react';
import { sendTextMessage } from '../lib/sendTextMessage';
import { extractPdfAndAskQuestion } from '../lib/extractPdfAndAskQuestion';
import { getUserChats, createNewChat } from '../lib/DatabaseQueries/supabaseChats';
import { getMessagesForChat } from '../lib/DatabaseQueries/supabaseMessage';

import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatDisplay from './ChatDisplay';

const MAX_CONTEXT_MESSAGES = 20;

export const ChatUI = ({
  userSessionData,
  currentChatId,
  setCurrentChatId,
  messages,
  setMessages,
  refreshChatList
}) => {
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages or loading state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isExtracting]);

  // Initialize or fetch user's most recent chat
  useEffect(() => {
    const getCurrentChat = async () => {
      const userId = userSessionData?.user?.id;
      if (!userId) return;

      const res = await getUserChats(userId);
      if (res && res.length > 0) {
        setCurrentChatId(res[0].id);
      } else {
        const now = new Date();
        const title = now.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        const newChatRes = await createNewChat(userId, title);
        setCurrentChatId(newChatRes.id);
      }
    };

    getCurrentChat();
  }, [userSessionData?.user?.id, setCurrentChatId]);

  // Load messages for selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChatId) return;
      const pastMessages = await getMessagesForChat(currentChatId);
      setMessages(pastMessages);
    };

    fetchMessages();
  }, [currentChatId, setMessages]);

  // Append message to local state
  const appendMessage = (text, isUser) => {
    setMessages(msgs => [...msgs, { text, isUser }]);
  };

  // Handle text or file-based submission
  const handleSend = async () => {
    const trimmedInput = textInput.trim();
    const isFileSelected = !!file;

    if (!trimmedInput && !isFileSelected) return;

    setTextInput('');

    if (isFileSelected) {
      setIsExtracting(true);
      appendMessage(`Extracting information from "${file.name}" and processing your question...`, false);

      await extractPdfAndAskQuestion(
        file,
        trimmedInput,
        appendMessage,
        setFile,
        setIsExtracting,
        messages,
        MAX_CONTEXT_MESSAGES,
        currentChatId
      );

      if (fileInputRef.current) fileInputRef.current.value = null;
    } else {
      await sendTextMessage(
        trimmedInput,
        messages,
        appendMessage,
        setTextInput,
        MAX_CONTEXT_MESSAGES,
        currentChatId
      );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <ChatHeader
        userSessionData={userSessionData}
        setCurrentChatId={setCurrentChatId}
        setMessages={setMessages}
        refreshChatList={refreshChatList}
      />

      {/* Display Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatDisplay
          messages={messages}
          isExtracting={isExtracting}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-900">
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
  );
};
