# 📚 Gemini Chatbot with PDF Upload & History (Full Stack Project)

Welcome to my full stack chatbot application powered by the **Gemini API**! This project allows users to:

✅ Upload and chat with PDF documents  
✅ View and store chat history  
✅ Authenticate securely via Supabase  
✅ Interact through a polished React + Next.js UI  
✅ Experience a persistent session with real-time messaging

🟢 [Live Demo →](https://my-chatbot-bice-omega.vercel.app)

---

## ✨ Features

- 🔐 **User Authentication** using Supabase (Signup, Login, Logout)
- 📄 **PDF Upload** with automatic text extraction using `pdf-parse`
- 🤖 **Chat with AI** via Gemini API integration
- 💬 **Chat History** stored and retrieved per user
- 📁 **Persistent Sessions** across multiple logins
- 🧾 **Database-backed** with PostgreSQL for chats/messages
- 🧠 **Intelligent Context Handling** for more relevant responses
- 🎯 Fully responsive and styled with TailwindCSS
- 🚀 Deployed via **Vercel**

---

## 🔧 Tech Stack

| Frontend     | Backend/API       | Auth & DB        |
|--------------|------------------|------------------|
| Next.js 14   | Next.js App Router | Supabase (PostgreSQL) |
| React        | REST API Routes   | Supabase Auth (JWT) |
| TailwindCSS  | Gemini API        | Prisma-like Supabase queries |

---

## 🧠 How It Works

- **Authentication**: Supabase manages user sessions via JWT tokens.
- **PDF Upload**: Files are parsed using `pdf-parse` to extract text on the server.
- **Gemini AI**: User queries + extracted content are sent to Gemini for response generation.
- **Chat History**: Chats are saved in a Supabase database under each user.
- **Retrieval**: Users can open old conversations via a chat list UI.

---

## 📂 Project Structure Overview

