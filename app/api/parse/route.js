import { NextResponse } from 'next/server';

export async function POST(request) {
    console.log('hello');
    
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process the buffer here, e.g., upload to S3 or save to a database
    console.log('File buffer:', buffer); 

    return NextResponse.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ message: "Error processing file" }, { status: 500 });
  }
}