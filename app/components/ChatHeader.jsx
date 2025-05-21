'use client';

import { getOrCreateChat } from '../lib/DatabaseQueries/chatManager';

const ChatHeader = ({ userSessionData, setCurrentChatId, setMessages, refreshChatList }) => {
  const handleNewChat = async () => {
    try {
      const { chatId, isNew } = await getOrCreateChat(userSessionData.user.id);
      setCurrentChatId(chatId);
      setMessages([]); // Reset chat messages
      await refreshChatList();
      console.log(isNew ? '✅ Created new chat' : '🔁 Switched to existing chat');
    } catch (err) {
      console.error('❌ Failed to create or get chat:', err);
    }
  };

  return (
    <div className="relative p-4 bg-gradient-to-r from-gray-800 to-gray-700 shadow-md text-white text-center">
      {/* Responsive Title */}
      <h1 className="text-xl font-bold sm:text-2xl">
        <span className="block sm:hidden">AI Chat</span>
        <span className="hidden sm:block">AI Document Chat</span>
      </h1>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-600 hover:bg-gray-500 text-sm px-3 py-1 rounded-lg transition"
        aria-label="Start new chat"
      >
        + New Chat
      </button>
    </div>
  );
};

export default ChatHeader;
