import { useState, useEffect, useRef } from 'react';


const Chat = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeUser, setActiveUser] = useState(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const userId = localStorage.getItem('chat_user_id');
  const username = localStorage.getItem('chat_username');

  // Initialize WebSocket
  useEffect(() => {
    if (!userId) return;

    const ws = initSocket(userId);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.eventname === 'chatlist-response') {
        const data = payload.eventpayload;
        if (data.type === 'my-chatlist') {
          setOnlineUsers(data.chatlist || []);
          if (data.chatlist?.length > 0 && !activeUser) {
            setActiveUser(data.chatlist[0]);
          }
        } else if (data.type === 'new-user-joined') {
          setOnlineUsers(prev => [...prev, data.chatlist]);
        } else if (data.type === 'user-disconnected') {
          setOnlineUsers(prev => prev.filter(u => u.userID !== data.chatlist.userID));
        }
      } else if (payload.eventname === 'message-response') {
        const msg = payload.eventpayload;
        const key = [msg.fromUserID, msg.toUserID].sort().join('_');
        const newMsg = {
          id: Date.now().toString(),
          text: msg.message,
          senderId: msg.fromUserID,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => ({
          ...prev,
          [key]: [...(prev[key] || []), newMsg]
        }));
      }
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      if (ws) {
        ws.send(JSON.stringify({
          eventname: "disconnect",
          eventpayload: userId
        }));
        ws.close();
      }
    };
  }, [userId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeUser]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeUser) return;

    const payload = {
      eventname: "message",
      eventpayload: {
        message: inputText,
        toUserID: activeUser.userID,
        fromUserID: userId
      }
    };

    wsRef.current.send(JSON.stringify(payload));

    // Optimistic update
    const key = [userId, activeUser.userID].sort().join('_');
    const newMsg = {
      id: Date.now().toString(),
      text: inputText,
      senderId: userId,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newMsg]
    }));

    setInputText('');
  };

  const currentMessages = activeUser
    ? messages[[userId, activeUser.userID].sort().join('_')] || []
    : [];

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
      <OnlineUsersList
        onlineUsers={onlineUsers}
        activeUserId={activeUser?.userID}
        onSelect={setActiveUser}
      />

      <div className="flex-1 flex flex-col">
        <Header
          user={{ username }}
          onLogout={() => {
            localStorage.removeItem('chat_user_id');
            localStorage.removeItem('chat_username');
            window.location.href = '/login';
          }}
        />

        {activeUser ? (
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.senderId === userId
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                    <div className={`text-xs mt-1 ${msg.senderId === userId ? 'text-indigo-200 text-right' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-full focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 rounded-r-full hover:bg-indigo-700 transition"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">💬</div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Select a user to chat
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Chat;