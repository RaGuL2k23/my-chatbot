export default function ChatBubble({ message, isUser }) {
  return (
    <div className={`my-2 text-white max-w-xl px-4 py-2 rounded-lg ${isUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-900 self-start'}`}>
      {message}
    </div>
  )
}
