import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token){ setLoading(false); return; }
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // JWT fix
      const payload = JSON.parse(atob(base64));
      console.log(payload);
      if (payload.exp * 1000 > Date.now()) {
        setUser({ 
          id: payload.id, 
          username: payload.username 
        });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        logout(); 
      }
    } catch (error) {
      console.error("Invalid token in localStorage:", error);
      logout(); 
    }
    setLoading(false);
  },[])

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    const payload = JSON.parse(atob(newToken.split('.')[1]));
    setUser({ id: payload.id, username: payload.username });
    setToken(newToken);
  }

  const logout = () =>{
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  }

  const value = {
    user, token, login, logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
