import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { ChatMessage, ChatStatus } from '../types';
import { generateResponse } from '../services/geminiService';
import Message from './Message';
import CameraModal from './CameraModal';
import { SendIcon } from './icons/SendIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { CameraIcon } from './icons/CameraIcon';
import { GlobeIcon } from './icons/GlobeIcon';


// Polyfill for browser compatibility
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;


interface ChatWindowRef {
  sendMessage: (message: string, useForeignSources?: boolean) => void;
}

interface UploadedFile {
  base64: string;
  mimeType: string;
  name: string;
  previewUrl?: string; // Only for images
}

const ChatWindow = forwardRef<ChatWindowRef>((_props, ref) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: 'Xin chào! Tôi là Trợ lý AI cho Giảng viên Cao đẳng, Đại học, phát triển bởi Trần Tuấn Thành (trantuanthanh.net). Tôi có thể giúp gì cho bạn hôm nay? Hãy chọn một chủ đề bên dưới, nhập câu hỏi, đính kèm tệp hoặc dùng micro để bắt đầu.',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [isListening, setIsListening] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [useForeignSources, setUseForeignSources] = useState(false);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setUserInput(prev => (prev ? prev + ' ' : '') + transcript);
      };
      recognition.onerror = (event: any) => console.error('Speech recognition error:', event.error);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
    return () => recognitionRef.current?.abort();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (messageContent: string, foreignSources = useForeignSources) => {
    if ((!messageContent.trim() && !uploadedFile) || status === 'loading') return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageContent,
      attachmentPreview: uploadedFile ? {
        url: uploadedFile.previewUrl,
        name: uploadedFile.name,
        isImage: uploadedFile.mimeType.startsWith('image/'),
      } : undefined,
    };
    setMessages(prev => [...prev, userMessage]);
    
    const fileToSend = uploadedFile;
    setUserInput('');
    setUploadedFile(null);
    setStatus('loading');

    try {
      const filePart = fileToSend ? {
        inlineData: { mimeType: fileToSend.mimeType, data: fileToSend.base64 }
      } : null;

      const botResponse = await generateResponse(messageContent, filePart, foreignSources);
      const modelMessage: ChatMessage = { role: 'model', content: botResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'model',
        content: 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setStatus('idle');
    }
  };
  
  useImperativeHandle(ref, () => ({
    sendMessage: (message: string, foreignSources?: boolean) => handleSendMessage(message, foreignSources),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(userInput);
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) return alert('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.');
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setUploadedFile({
          base64: base64String,
          mimeType: file.type,
          name: file.name,
          previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        });
      };
      reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = ''; // Allow re-uploading the same file
  };
  
  const handleCameraCapture = ({ base64, mimeType }: { base64: string; mimeType: string }) => {
    const fileName = `capture-${Date.now()}.jpg`;
    const previewUrl = `data:${mimeType};base64,${base64}`;
    setUploadedFile({
        base64,
        mimeType,
        name: fileName,
        previewUrl,
    });
    setIsCameraOpen(false);
  };


  return (
    <>
      <CameraModal 
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
      <div className="flex flex-col h-full bg-slate-50">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => <Message key={index} message={msg} />)}
          {status === 'loading' && (
             <div className="flex items-center justify-start space-x-3">
               <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full flex-shrink-0">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
               </div>
               <div className="bg-white p-3 rounded-lg shadow-sm text-slate-500">
                 <span className="animate-pulse">AI đang soạn câu trả lời...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200 shadow-inner">
          {uploadedFile && (
            <div className="mb-3 p-2 bg-slate-100 rounded-lg relative w-auto max-w-sm inline-flex items-center gap-3 shadow-sm">
                {uploadedFile.previewUrl ? (
                    <img src={uploadedFile.previewUrl} alt="Preview" className="w-16 h-16 rounded object-cover border border-slate-200" />
                ) : (
                    <div className="w-16 h-16 bg-slate-200 rounded flex items-center justify-center flex-shrink-0">
                        <PaperclipIcon className="w-8 h-8 text-slate-500" />
                    </div>
                )}
                <span className="text-sm font-medium text-slate-700 truncate flex-1" title={uploadedFile.name}>
                  {uploadedFile.name}
                </span>
                <button onClick={() => setUploadedFile(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors">&times;</button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 hover:text-blue-600 rounded-full hover:bg-slate-100 transition-colors" aria-label="Attach file">
              <PaperclipIcon className="w-6 h-6" />
            </button>
             <button type="button" onClick={() => setIsCameraOpen(true)} className="p-2 text-slate-500 hover:text-blue-600 rounded-full hover:bg-slate-100 transition-colors" aria-label="Use camera">
              <CameraIcon className="w-6 h-6" />
            </button>
             <button type="button" onClick={handleMicClick} className={`p-2 rounded-full transition-colors ${isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'}`} aria-label="Use microphone">
              <MicrophoneIcon className="w-6 h-6" />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Nhập câu hỏi của bạn ở đây..."
                className="w-full py-3 pl-4 pr-12 text-slate-700 bg-slate-100 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading' || (!userInput.trim() && !uploadedFile)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Send message"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
            <button 
              type="button" 
              onClick={() => setUseForeignSources(!useForeignSources)} 
              className={`p-2 rounded-full transition-colors ${useForeignSources ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`} 
              aria-label="Toggle foreign sources"
              title="Sử dụng nguồn tham khảo quốc tế"
            >
              <GlobeIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
});

export default ChatWindow;