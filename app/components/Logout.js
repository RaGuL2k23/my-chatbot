'use client'

import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client"

const SignOutButton = () =>{
    const supabase = createClient();
    const router = useRouter();
    const logout = ()=>{
        supabase.auth.signOut();
        router.push('/auth/login');
    }

    return <>
        <button onClick={logout}
         className="border border-1 bg-red-800 text-white "> LogOut
         </button>
    </>
}

export default SignOutButton