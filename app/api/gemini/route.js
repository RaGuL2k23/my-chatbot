import { NextResponse } from 'next/server'
import axios from 'axios'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent'

export const POST = async (req) => {
  const body = await req.json()
  const userInput = body.message
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.error('❌ API key not found in environment variables.')
    return NextResponse.json({ reply: 'Server misconfiguration: API key missing.' }, { status: 500 })
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: userInput }] }],
      }
    )

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.'
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('❌ Gemini API error:', err.message)
    console.error('📦 Error response:', err.response?.data || err)

    return NextResponse.json(
      { reply: 'Something went wrong while contacting Gemini API. May be check wifi' },
      { status: 500 }
    )
  }
}
