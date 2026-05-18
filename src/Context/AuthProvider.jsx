import { createContext , useEffect, useState } from "react"
import api from "../api/axios";

export const AuthContext = createContext();

export default function AuthProvider({children}) {
  
  const [user , setUser] = useState(null);
  const [token , setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {

   async function fetchUser() {

      try {
        const res = await api.get("/api/user");
        setUser(res.data);
      } catch{
        setUser(null);
      }
      
    }
    if(token){
      fetchUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{user , setUser , token , setToken}}>
      {children}
    </AuthContext.Provider>
  )
}