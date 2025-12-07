import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister, checkSession } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      try {
        const userId = localStorage.getItem('chat_user_id');
        if (userId) {
          const response = await checkSession(userId);
          if (response.data.Response) {
            setUser({ id: userId, username: localStorage.getItem('chat_username') });
          } else {
            logout();
          }
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = async (credentials) => {
    const response = await apiLogin(credentials);
    const { userID, username } = response.data.Response;
    
    localStorage.setItem('chat_user_id', userID);
    localStorage.setItem('chat_username', username);
    
    setUser({ id: userID, username });
    navigate('/chat');
  };

  const register = async (credentials) => {
    const response = await apiRegister(credentials);
    const { userID, username } = response.data.Response;
    
    localStorage.setItem('chat_user_id', userID);
    localStorage.setItem('chat_username', username);
    
    setUser({ id: userID, username });
    navigate('/chat');
  };

  const logout = () => {
    localStorage.removeItem('chat_user_id');
    localStorage.removeItem('chat_username');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);