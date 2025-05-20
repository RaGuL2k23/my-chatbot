export default function ChatBubble({ message, isUser }) {
  return (
    <div
      className={`
        p-3 rounded-2xl shadow-sm text-base max-w-[80%]
        ${isUser
          ? 'bg-blue-600 text-white self-end ml-auto rounded-br-md'
          : 'bg-gray-100 text-gray-800 self-start mr-auto rounded-bl-md mb-6'
        }
        break-words whitespace-pre-wrap
        transition-all duration-150 ease-in-out
      `}
    >
      {message}
    </div>
  )
}
