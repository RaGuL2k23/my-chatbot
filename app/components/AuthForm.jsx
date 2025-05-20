'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { createClient } from '../utils/supabase/client';

/* reusable component for login/signup form  */
const AuthForm = ({ type }) => {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const result = type === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setErrorMsg(result.error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto pt-8 px-4"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {type === 'login' ? 'Login' : 'Sign Up'}
      </h2>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {errorMsg && (
        <p className="text-red-500 text-sm mb-4">{errorMsg}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {type === 'login' ? 'Log In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;
