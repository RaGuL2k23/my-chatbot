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
    // Main container for the page, takes full height and uses flex column
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* Header section with max-width and padding */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Welcome, {data.user.email}!</h1>
      </div>
      {/* Chat section, flex-1 to take remaining height, with max-width and padding */}
     <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 overflow-hidden">
  <ChatMain userSessionData={data} />
</div>

    </div>
  )
}