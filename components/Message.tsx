import React from 'react';
import type { ChatMessage } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  
  const bubbleClasses = isModel
    ? 'bg-white text-slate-800'
    : 'bg-blue-600 text-white';
  
  const containerClasses = isModel 
    ? 'justify-start' 
    : 'justify-end';

  return (
    <div className={`flex items-start gap-3 ${containerClasses}`}>
      {isModel && (
        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full flex-shrink-0 border-2 border-blue-200">
          <BotIcon className="w-6 h-6 text-blue-600" />
        </div>
      )}
      
      <div className={`max-w-3xl p-4 rounded-xl shadow-md ${bubbleClasses}`}>
        {message.attachmentPreview && (
          <div className="mb-2">
            {message.attachmentPreview.isImage && message.attachmentPreview.url ? (
              <img src={message.attachmentPreview.url} alt={message.attachmentPreview.name} className="rounded-lg max-w-xs border" />
            ) : (
              <div className={`flex items-center space-x-2 p-2 rounded-lg ${isModel ? 'bg-slate-100' : 'bg-blue-500'}`}>
                <PaperclipIcon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{message.attachmentPreview.name}</span>
              </div>
            )}
          </div>
        )}
        {message.content && (
           <div className="prose prose-sm prose-slate max-w-none prose-a:text-blue-500 hover:prose-a:text-blue-400 prose-p:text-current prose-ul:text-current prose-ol:text-current prose-li:text-current">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
              }}
            >
              {message.content}
            </ReactMarkdown>
           </div>
        )}
      </div>

      {!isModel && (
        <div className="w-10 h-10 flex items-center justify-center bg-slate-200 rounded-full flex-shrink-0">
          <UserIcon className="w-6 h-6 text-slate-600" />
        </div>
      )}
    </div>
  );
};

export default Message;