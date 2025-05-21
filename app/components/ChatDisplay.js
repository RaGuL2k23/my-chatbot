// ChatDisplay.js
'use client';

import ChatBubble from './ChatBubble';
import { Loader2 } from 'lucide-react';

const ChatDisplay = ({ messages, isExtracting, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
      {messages.length === 0 && !isExtracting && (
        <div className="flex items-center justify-center h-full text-center text-gray-400 italic text-lg p-4">
          Start a conversation by typing a message or uploading a PDF to ask questions!
        </div>
      )}
      {messages.map((m, i) => (
        <ChatBubble key={i} message={m.text} isUser={m.isUser} />
      ))}
      {isExtracting && <ChatBubble message="Thinking..." isUser={false} />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatDisplay;