import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import MessageBubble from './MessageBubble';
import { IoSend } from 'react-icons/io5';

const ChatWindow = ({ user, recipient, messages, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-tl-3xl shadow-xl">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tl-3xl">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-purple-300 flex items-center justify-center text-2xl">
              {recipient.username[0].toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="ml-3">
            <h2 className="font-bold text-lg">{recipient.username}</h2>
            <p className="text-xs opacity-90">Online now</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <span>ⓘ</span>
          </button>
          <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <span>⋮</span>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === user.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 shadow-sm">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-500"
          />
          <button 
            type="submit"
            disabled={!message.trim()}
            className={`p-2 rounded-full transition-colors ${
              message.trim() 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'text-gray-400 cursor-not-allowe'
            }`}
          >
            <IoSend className="text-xl" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;