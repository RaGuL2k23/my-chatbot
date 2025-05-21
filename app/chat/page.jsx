import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { ChatMain } from '../components/ChatMainUi'

export default async function ChatPage() {
  const cookie = await cookies()
  const supabase = createClient(cookie)
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    redirect('/auth/login')
  }

  return ( 
    <div className="bg-gray-900 min-h-screen   flex flex-col"> 
       
     <div className="flex-1 flex flex-col   max-w-full  p-0 m-0">
      
  <ChatMain userSessionData={data} />
</div>

    </div>
  )
}