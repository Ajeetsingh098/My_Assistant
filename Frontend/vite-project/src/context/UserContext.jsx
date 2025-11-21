import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext()

function UserContext({ children }) {
  
  const serverUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true) 

  const refreshUser = async () => {
    setLoading(true);
    try {
     
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
      setUserData(result.data)
      return result.data
    } catch (error) {
      setUserData(null)
      return null
    } finally {
      setLoading(false); 
    }
  }

  const getGeminiResponse = async (prompt) => {
    try {
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, { prompt }, { withCredentials: true })
      return result.data;
    } catch (error) {
      console.log("Gemini API error:", error);
      return null;
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value = { 
    serverUrl, 
    userData, 
    setUserData, 
    refreshUser, 
    getGeminiResponse,
    loading 
  }

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext
