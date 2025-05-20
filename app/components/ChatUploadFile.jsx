'use client'

import { useState } from 'react'
import axios from 'axios'

const ChatPage = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [textPreview, setTextPreview] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null)
  }

  const handleUpload = async () => {
    if (!file) return alert('Please upload a PDF file')

    setLoading(true)

    try {
      // Upload file to /api/extract-pdf
      const formData = new FormData()
      formData.append('file', file)

      const extractRes = await axios.post('/api/extract-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const extractedText = extractRes.data.text
      setTextPreview(extractedText.slice(0, 500)) // Show preview

      // Send extracted text to /api/gemini
      const geminiRes = await axios.post('/api/gemini', {
        prompt: extractedText,
      })

      setResponse(geminiRes.data.reply)
    } catch (error) {
      console.error('Error during upload:', error)
      alert('Something went wrong while processing the file.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Upload and Analyze'}
      </button>

      {textPreview && (
        <div className="bg-gray-100 p-2 rounded text-sm">
          <strong>PDF Text Preview:</strong>
          <p>{textPreview}...</p>
        </div>
      )}

      {response && (
        <div className="bg-green-100 p-2 rounded mt-4">
          <strong>Gemini Reply:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  )
}

export default ChatPage
