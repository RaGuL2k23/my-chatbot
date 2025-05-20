'use client'

import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client"

const SignOutButton = () =>{
    const supabase = createClient();
    const router = useRouter();
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
      
        if (!error) {
          // Optional: force reload if you're still "logged in"
          router.refresh(); // If using App Router
          router.push('/auth/login');
        } else {
          console.error("Logout error:", error.message);
        }
      };

    return <>
        <button onClick={logout}
         className="border border-1 bg-red-800 text-white "> LogOut
         </button>
    </>
}

export default SignOutButton