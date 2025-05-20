import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import dynamic from 'next/dynamic'

const ChatUI = dynamic(() => import('../components/ChatUi'), { ssr: true })

export default async function ChatPage() {
  const cookie = await cookies()
  const supabase = createClient(cookie)
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {data.user.email}!</h1>
      <ChatUI />
    </div>
  )
}
