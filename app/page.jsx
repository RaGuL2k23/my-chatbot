import Link from "next/link";
import SignOutButton from "./components/Logout";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-zinc-800 text-white px-4 py-8">
      <div className="absolute top-4 right-4">
        <SignOutButton />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-500 mb-6">
          Gemini Chatbot
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Experience seamless conversations powered by Gemini.
        </p>
        <Link
          href={'/chat'}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Go to Chat
        </Link>
      </div>
      <footer className="absolute bottom-4 text-sm text-gray-500">
        Powered by Gemini & Supabase
      </footer>
    </main>
  );
}