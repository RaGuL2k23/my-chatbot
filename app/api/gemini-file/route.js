import { IncomingForm } from 'formidable'
import fs from 'fs'
import pdf from 'pdf-parse'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req) {
  const form = new IncomingForm()

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })

  if (!files.file) {
    return new Response(JSON.stringify({ reply: 'No file uploaded' }), { status: 400 })
  }

  // Use formidable's temp path, **do NOT hardcode file paths**
  const filePath = files.file.filepath || files.file.path

  // Read the uploaded file from temp path
  const dataBuffer = fs.readFileSync(filePath)

  const pdfData = await pdf(dataBuffer)

  return new Response(
    JSON.stringify({
      reply: `Extracted text:\n${pdfData.text.slice(0, 500)}`,
    }),
    { status: 200 }
  )
}
