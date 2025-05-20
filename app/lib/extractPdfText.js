// app/lib/extractPdfText.js
'use client'

import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

export async function extractPdfTextFromFile(file) {
  const arrayBuffer = await file.arrayBuffer()

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise

  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map(item => item.str).join(' ')
    fullText += `\n\nPage ${i}:\n${pageText}`
  }
  console.log('full text' , fullText);
  
  return fullText
}
