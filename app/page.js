import SignOutButton from "./components/Logout";

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div><SignOutButton /></div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Welcome to Gemini Chatbot App</h1>
    </main>
  );
}
