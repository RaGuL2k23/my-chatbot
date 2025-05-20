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

    return (
        <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
            Log Out
        </button>
    );
}

export default SignOutButton