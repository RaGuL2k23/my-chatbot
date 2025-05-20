export async function POST(req) {
  const { message } = await req.json()

  // For now, fake a Gemini reply
  const fakeReply = `This is a dummy Gemini reply to: "${message}"`

  return new Response(JSON.stringify({ reply: fakeReply }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
