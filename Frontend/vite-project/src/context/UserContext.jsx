import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext()

function UserContext({ children }) {
  const serverUrl = import.meta.env.BACKEND_URL|| 'http://localhost:4000'
  
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true) // NEW: Prevents UI flicker

  const refreshUser = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
      setUserData(result.data)
      return result.data
    } catch (error) {
      // console.error('User not found', error) 
      setUserData(null)
      return null
    } finally {
      setLoading(false); // Stop loading regardless of success/fail
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























// main code ///





// import axios from 'axios'
// import React, { createContext, useEffect, useState } from 'react'

// export const userDataContext = createContext()

// function UserContext({ children }) {
//   const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
//   const [userData, setUserData] = useState(null)

//   const refreshUser = async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
//       setUserData(result.data)
//       return result.data
//     } catch (error) {
//       console.error('fetch current user error', error?.response?.data || error.message || error)
//       setUserData(null)
//       return null
//     }
//   }

//   const getGeminiResponse = async (prompt) => {
//     try {
//       const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, { prompt }, { withCredentials: true })
//       return result.data;
//     } catch (error) {
//       console.log("Gemini API error:", error);
//       return null;
//     }
//   }


//   useEffect(() => {
//     refreshUser()
//   }, [])

//   const value = { serverUrl, userData, setUserData, refreshUser, getGeminiResponse }

//   return (
//     <userDataContext.Provider value={value}>
//       {children}
//     </userDataContext.Provider>
//   )
// }

// export default UserContext
