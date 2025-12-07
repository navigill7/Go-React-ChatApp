import { motion } from 'framer-motion';

const MessageBubble = ({ message, isOwn }) => {
  const time = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
        isOwn 
          ? 'bg-indigo-600 text-white rounded-br-none' 
          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none shadow'
      }`}>
        <p>{message.text}</p>
        <span className={`text-xs mt-1 block ${
          isOwn ? 'text-indigo-200 text-right' : 'text-gray-500'
        }`}>
          {time}
        </span>
      </div>
    </motion.div>
  );
};

export default MessageBubble;