import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Convert uploaded file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF from buffer (not from file path)
    const pdfData = await pdfParse(buffer);

    // console.log('Extracted Text:', pdfData.text);

    return NextResponse.json({ message: 'Success', text: pdfData.text });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Error processing file' }, { status: 500 });
  }
}
