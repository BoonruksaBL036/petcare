import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  function loginWithData({ token, user: u }){
    if(token) localStorage.setItem('token', token);
    if(u) localStorage.setItem('user', JSON.stringify(u));
    setUser(u || null);
  }

  function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loginWithData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
  return useContext(AuthContext);
}
