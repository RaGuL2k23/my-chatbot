// ChatHeader.js
'use client';

import { getOrCreateChat } from '../lib/DatabaseQueries/chatManager';

const ChatHeader = ({ userSessionData, setCurrentChatId, setMessages ,refreshChatList }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 text-white font-bold text-2xl text-center shadow-md relative">
<p className='sm:block hidden '>AI Document Chat</p>
      <button
        onClick={async () => {
          try {
            const { chatId, isNew } = await getOrCreateChat(userSessionData.user.id);
            setCurrentChatId(chatId);
            setMessages([]); // clear messages when switching or creating new
            console.log(isNew ? 'Created new chat' : 'Switched to existing chat');
            await refreshChatList()
          } catch (err) {
            console.log('Failed to create or get chat:', err);
          }
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-sm rounded-lg"
      >
        + New Chat
      </button>
    </div>
  );
};

export default ChatHeader;