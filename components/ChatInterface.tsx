import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, Feature } from '../types';
import { SendIcon, PaperclipIcon, CloseIcon, CopyIcon, BotIcon } from './icons/Icons';
import Loader from './Loader';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  feature: Feature;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (text: string, image: File | null) => void;
}

const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';

  const renderText = (text: string) => {
    // Basic markdown to HTML conversion
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-800 text-white p-3 rounded-md my-2"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-600 text-slate-200 px-1 py-0.5 rounded-sm">$1</code>')
      .replace(/^\s*[-*]\s+(.*)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, '<br />');
    return { __html: html };
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
  };
  
  const messageVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
        className={`flex items-start gap-3 my-6 ${isUser ? 'flex-row-reverse' : ''}`}
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
        layout
    >
        {!isUser && (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <BotIcon />
            </div>
        )}
      <div className={`p-4 rounded-lg max-w-2xl prose prose-sm prose-invert ${isUser ? 'bg-indigo-600 text-white' : 'bg-slate-700'}`}>
        {message.image && (
          <img src={message.image} alt="User upload" className="rounded-md mb-2 max-h-60" />
        )}
        <div dangerouslySetInnerHTML={renderText(message.text)} />
         {!isUser && message.text && (
            <div className="mt-3 border-t border-slate-600 pt-2">
                <button onClick={handleCopy} className="text-slate-400 hover:text-indigo-400 p-1 rounded-full">
                    <CopyIcon className="w-4 h-4" />
                </button>
            </div>
        )}
      </div>
    </motion.div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ feature, messages, isLoading, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [inputText, resizeTextarea]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || (!inputText.trim() && !imageFile)) return;
    onSendMessage(inputText, imageFile);
    setInputText('');
    removeImage();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="p-4 border-b border-slate-700 bg-slate-800/80 backdrop-blur-lg">
        <h2 className="text-lg font-semibold text-slate-100">{feature.name}</h2>
      </header>
      <div className="flex-1 overflow-y-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
            <AnimatePresence>
            {messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
            ))}
            </AnimatePresence>
            {isLoading && (
                <motion.div 
                    className="flex items-start gap-3 my-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400 flex-shrink-0">
                        <BotIcon />
                    </div>
                    <div className="p-4 rounded-lg bg-slate-700">
                        <Loader />
                    </div>
                </motion.div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-slate-800/60 backdrop-blur-lg border-t border-slate-700">
        <div className="max-w-4xl mx-auto">
            {imagePreview && (
            <div className="relative inline-block mb-2">
                <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-slate-600 text-white rounded-full p-1 hover:bg-slate-800"
                aria-label="Remove image"
                >
                <CloseIcon className="w-4 h-4" />
                </button>
            </div>
            )}
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${feature.name}...`}
                className="flex-1 px-12 py-3 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={1}
                style={{maxHeight: '150px'}}
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-3 p-2 rounded-full text-slate-400 hover:bg-slate-600"
                aria-label="Attach image"
            >
                <PaperclipIcon />
            </button>
            <motion.button
                type="submit"
                disabled={isLoading || (!inputText.trim() && !imageFile)}
                className="absolute right-2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-500 disabled:cursor-not-allowed"
                aria-label="Send message"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <SendIcon />
            </motion.button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;