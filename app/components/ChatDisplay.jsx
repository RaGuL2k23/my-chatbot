// ChatDisplay.js
'use client';

import ChatBubble from './ChatBubble'; 
// chat icon reusable for both user and ai 
const ChatDisplay = ({ messages, isExtracting, messagesEndRef }) => {
  return (        
     <div className="flex flex-col h-full overflow-y-auto p-6 space-y-4 bg-gray-800 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">

      {messages.length === 0 && !isExtracting && (
        <div className="flex items-center justify-center h-full text-center text-gray-400 italic text-lg p-4">
          Start a conversation by typing a message or uploading a PDF to ask questions!
        </div>
      )} 
      {messages.map((m, i) => (
        <ChatBubble key={i} message={m.text} isUser={m?.isUser || m?.is_user } />
      ))}

      {isExtracting && <ChatBubble message="Thinking..." isUser={false} />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatDisplay;
