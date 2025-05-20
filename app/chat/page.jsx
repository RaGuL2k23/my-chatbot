import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server' 
import { ChatUI } from '../components/ChatUi'


export default async function ChatPage() {
  const cookie = await cookies()
  const supabase = createClient(cookie)
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {data.user.email}!</h1>
      <ChatUI />
    </div>
  )
}
