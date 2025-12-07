const OnlineUsersList = ({ onlineUsers, activeUserId, onSelect }) => (
  <div className="bg-indigo-900 text-white w-64 flex flex-col h-full">
    <div className="p-4 border-b border-indigo-800">
      <h2 className="text-xl font-bold flex items-center">
        <span className="mr-2">💬</span> Online ({onlineUsers.length})
      </h2>
    </div>
    <div className="flex-1 overflow-y-auto py-2">
      {onlineUsers.map(user => (
        <div
          key={user.userID}
          onClick={() => onSelect(user)}
          className={`flex items-center p-3 cursor-pointer hover:bg-indigo-800/70 ${
            activeUserId === user.userID ? 'bg-indigo-800 border-l-4 border-purple-400' : ''
          }`}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-indigo-900"></div>
          </div>
          <span className="ml-3 truncate">{user.username}</span>
        </div>
      ))}
    </div>
  </div>
);

export default OnlineUsersList;