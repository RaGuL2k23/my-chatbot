// app/chat/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'

export default async function ChatPage() {
  const cookie = await cookies()
  const supabase = createClient(cookie) 
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    redirect('/auth/login')
  }

  return <p>Welcome to chat</p>
}
