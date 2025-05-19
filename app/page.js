import SignOutButton from "./components/Logout";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <div className="mb-6">
        <SignOutButton />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Welcome to Gemini Chatbot App
      </h1>
    </main>
  );
}
