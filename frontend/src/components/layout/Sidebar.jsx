import { motion } from 'framer-motion';
import { BiUserCircle, BiLogOut } from 'react-icons/bi';

const Sidebar = ({ onlineUsers, activeChat, onSelectUser }) => {
  return (
    <div className="w-80 bg-indigo-900 text-white flex flex-col shadow-2xl">
      <div className="p-6 border-b border-indigo-800">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="mr-2">💬</span>
          GopherChat
        </h1>
        <p className="text-indigo-200 mt-1">Real-time messaging</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-4">
          <div className="flex items-center text-green-400">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span>Online Users ({onlineUsers.length})</span>
          </div>
        </div>
        
        {onlineUsers.map((user) => (
          <motion.div
            key={user.userID}
            whileHover={{ x: 5 }}
            onClick={() => onSelectUser(user)}
            className={`flex items-center p-4 cursor-pointer transition-colors ${
              activeChat?.userID === user.userID 
                ? 'bg-indigo-800 border-l-4 border-purple-400' 
                : 'hover:bg-indigo-800/70'
            }`}
          >
            <div className="relative">
              <BiUserCircle className="text-3xl text-purple-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-900"></div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-medium">{user.username}</h3>
              <p className="text-xs text-indigo-300">Online now</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-4 border-t border-indigo-800">
        <button 
          onClick={() => onSelectUser(null)}
          className="w-full flex items-center justify-center py-2 bg-indigo-800 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          <BiLogOut className="mr-2" />
          Clear Selection
        </button>
      </div>
    </div>
  );
};

export default Sidebar;