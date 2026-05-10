import { createContext , useEffect, useState } from "react"
import api from "../api/axios";

export const AuthContext = createContext();

export default function AuthProvider({children}) {
  
  const [user , setUser] = useState(null);


  useEffect(() => {
   async function fetchUser() {
    
      try {
        const res = await api.get("/api/user");
        setUser(res.data);
      } catch{
        setUser(null);
      }
      
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{user, setUser}}>
      {children}
    </AuthContext.Provider>
  )
}