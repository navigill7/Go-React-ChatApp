import { createContext, useContext, useEffect, useState } from 'react';
import { initSocket } from '../utils/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    if (!user) return;

    const newSocket = initSocket(user.id);
    setSocket(newSocket);

    // Handle chatlist responses
    newSocket.on('chatlist-response', (payload) => {
      if (payload.type === 'my-chatlist') {
        setOnlineUsers(payload.chatlist || []);
      } else if (payload.type === 'new-user-joined') {
        setOnlineUsers(prev => [...prev, payload.chatlist].filter(
          (user, i, arr) => arr.findIndex(u => u.userID === user.userID) === i
        ));
      } else if (payload.type === 'user-disconnected') {
        setOnlineUsers(prev => prev.filter(u => u.userID !== payload.chatlist.userID));
      }
    });

    // Handle incoming messages
    newSocket.on('message-response', (payload) => {
      const { fromUserID, message, toUserID } = payload;
      const conversationId = [fromUserID, toUserID].sort().join('_');
      
      setMessages(prev => ({
        ...prev,
        [conversationId]: [
          ...(prev[conversationId] || []),
          { 
            id: Date.now().toString(), 
            text: message, 
            senderId: fromUserID,
            timestamp: new Date().toISOString()
          }
        ]
      }));
    });

    return () => {
      if (newSocket) {
        newSocket.emit('disconnect', user.id);
        newSocket.disconnect();
      }
    };
  }, [user]);

  const sendMessage = (toUserId, message) => {
    if (!socket || !user) return;
    
    const payload = {
      eventname: 'message',
      eventpayload: {
        message,
        toUserID: toUserId,
        fromUserID: user.id
      }
    };
    
    socket.emit('message', payload);
    
    // Optimistic update
    const conversationId = [user.id, toUserId].sort().join('_');
    setMessages(prev => ({
      ...prev,
      [conversationId]: [
        ...(prev[conversationId] || []),
        { 
          id: Date.now().toString(), 
          text: message, 
          senderId: user.id,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, messages, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);