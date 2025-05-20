import { NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'

// POST route to handle PDF file uploads
export const POST = async (req) => {
  const formData = await req.formData() // Get form data from the request
  const file = formData.get('file')     // Extract the uploaded file

  const arrayBuffer = await file.arrayBuffer() // Read file as binary data
  const data = await pdfParse(Buffer.from(arrayBuffer)) // Extract text from PDF

  return NextResponse.json({ text: data.text })  
}
