export async function sendFileQuestion(file, question, appendMessage, setFile, setQuestion) {
  console.log('[Frontend] sendFileQuestion start');

  if (!file) {
    console.log('[Frontend] No file provided, aborting.');
    appendMessage('Please select a PDF file.', false);
    return;
  }

  console.log('[Frontend] File info:', file);
  appendMessage(`(Debug - Selected File: ${file.name})`, false);

  try {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        const fileContent = event.target.result;
        console.log('[Frontend] PDF File Content:', fileContent); // <---- PRINT FILE CONTENT HERE
        appendMessage(`(Debug - File Content):\n${fileContent.slice(0, 500)}... (Full content in console)`, false);
      } else {
        console.error('[Frontend] FileReader result is null or undefined.');
        appendMessage('Error reading the file.', false);
      }

      // We are NOT making a fetch request to the backend now.
      // setQuestion(''); // Keep the question for now if you want to inspect it
      // setFile(null);    // Keep the file state for now if you want to inspect it
    };

    reader.onerror = (error) => {
      console.log('[Frontend] FileReader error:', error);
      appendMessage('Error reading the file.', false);
    };

    reader.readAsText(file); // Try reading as text (might not be perfect for raw PDF)

  } catch (error) {
    console.error('[Frontend] Error during file reading:', error);
    appendMessage('An error occurred while trying to read the file.', false);
  }
}