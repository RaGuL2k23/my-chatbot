import { GoogleGenAI } from '@google/genai'

export async function POST(req) {
  try {
    const { question, pdfText } = await req.json()

    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent([pdfText, `\n\nQuestion: ${question}`])
    const response = await result.response
    const answer = await response.text()

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
