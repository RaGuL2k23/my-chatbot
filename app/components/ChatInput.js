// ChatInput.js
'use client';
 
import { Upload, SendHorizontal, Loader2 } from 'lucide-react';

const ChatInput = ({
  isExtracting,
  file,
  setFile,
  textInput,
  setTextInput,
  fileInputRef,
  handleSend,
}) => {
  return (
    <div className="flex items-end gap-3 p-4 border-t border-gray-700 bg-gray-900">
      <input
        type="file"
        accept="application/pdf"
        onChange={e => {
          setFile(e.target.files[0]);
          setTextInput('');
        }}
        className="hidden"
        id="file-upload"
        ref={fileInputRef}
        disabled={isExtracting}
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition duration-200 ease-in-out ${
          isExtracting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={file ? `Change file (${file.name})` : 'Upload PDF'}
      >
        <Upload className="h-6 w-6" />
        {file && <span className="ml-2 text-sm max-w-[100px] truncate">{file.name}</span>}
      </label>

      <textarea
        className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out resize-none min-h-[3rem] max-h-[140px] overflow-y-auto"
        value={textInput}
        onChange={e => setTextInput(e.target.value)}
        placeholder={file ? `Ask about "${file.name}"...` : 'Type your message here...'}
        disabled={isExtracting}
        rows={1}
        onInput={e => {
          e.target.style.height = 'auto';
          e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
        }}
        onKeyDown={e => {
          if (
            e.key === 'Enter' &&
            !e.shiftKey &&
            (textInput.trim() || file) &&
            !isExtracting
          ) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <button
        onClick={handleSend}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out"
        disabled={isExtracting || (!textInput.trim() && !file)}
      >
        {isExtracting ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          <>
            Send
            <SendHorizontal className="h-5 w-5 ml-2" />
          </>
        )}
      </button>
    </div>
  );
};

export default ChatInput;