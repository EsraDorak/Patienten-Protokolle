import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface LoginContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  pflegerId: string | null;
  setPflegerId: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginContext = createContext<LoginContextType | null>(null);

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }: LoginProviderProps) => {
  const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
  const savedPflegerId = localStorage.getItem('pflegerId');
  const savedIsAdmin = localStorage.getItem('isAdmin');
  const [isLoggedIn, setIsLoggedIn] = useState(savedIsLoggedIn === 'true');
  const [pflegerId, setPflegerId] = useState<string | null>(savedPflegerId);
  const [isAdmin, setIsAdmin] = useState(savedIsAdmin === 'true');

  useEffect(() => {
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const savedPflegerId = localStorage.getItem('pflegerId');
    const savedIsAdmin = localStorage.getItem('isAdmin');
    setIsLoggedIn(savedIsLoggedIn === 'true');
    setPflegerId(savedPflegerId);
    setIsAdmin(savedIsAdmin === 'true');
  }, []);

   // Beim ersten Rendern den Zustand aus dem localStorage laden
   useEffect(() => {
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const savedPflegerId = localStorage.getItem('pflegerId');
    const savedIsAdmin = localStorage.getItem('isAdmin');
    setIsLoggedIn(savedIsLoggedIn === 'true');
    setPflegerId(savedPflegerId);
    setIsAdmin(savedIsAdmin === 'true');
  }, []);

  // Wenn sich der Zustand Ãndert, wird es im LocalStorage gespeichert
  useEffect(() => {
    if (isLoggedIn !== null) {
      localStorage.setItem('isLoggedIn', String(isLoggedIn));
    }
    if (pflegerId !== null) {
      localStorage.setItem('pflegerId', pflegerId);
    }
    if (isAdmin !== null) {
      localStorage.setItem('isAdmin', String(isAdmin));
    }
  }, [isLoggedIn, pflegerId, isAdmin]);

  const logout = () => {
    setIsLoggedIn(false);
    setPflegerId(null);
    setIsAdmin(false);
    localStorage.setItem('pflegerId', '');
  };


  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, pflegerId, setPflegerId, logout, isAdmin, setIsAdmin}}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => {
    const context = useContext(LoginContext);
    if (!context) {
      throw new Error('useLoginContext must be used within a LoginProvider');
    }
    return context;
  };
  

export default LoginContext;