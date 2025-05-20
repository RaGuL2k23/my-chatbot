import { getUserChats, createNewChat } from './supabaseChats'
import { getMessagesForChat } from './supabaseMessage'

/**
 * Checks the most recent chat of the user and either
 * - switches to that chat if it has no messages,
 * - or creates a new chat otherwise.
 * 
 * @param {string} userId - ID of the current user
 * @returns {Promise<{chatId: string, isNew: boolean}>} - chat ID to switch to, and whether it's new
 */
export async function getOrCreateChat(userId) {
  if (!userId) throw new Error('User ID is required')

  const userChats = await getUserChats(userId , 1 )

  if (!userChats || userChats.length === 0) {
    // No chats exist, create new
    const now = new Date()
    const title = now.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    const newChat = await createNewChat(userId, title)
    return { chatId: newChat.id, isNew: true }
  }

  const mostRecentChat = userChats[0]
  const recentMessages = await getMessagesForChat(mostRecentChat.id)

  if (recentMessages.length === 0) {
    // No messages, return existing chat
    return { chatId: mostRecentChat.id, isNew: false }
  }

  // Messages exist, create new chat
  const now = new Date()
  const title = now.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const newChat = await createNewChat(userId, title)
  return { chatId: newChat.id, isNew: true }
}
