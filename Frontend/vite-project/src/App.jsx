
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import SignUp from './Pages/SignUp'
import Login from './Pages/Login'
import Customize from './Pages/Customize'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext'
import Home from './Pages/Home'
import Customize2 from "./Pages/Customize2"


function App() {
  const { userData } = useContext(userDataContext)
  const location = useLocation()

  
  const navUser = location.state?.user
  const hasTheme = (u) => {
    if (!u) return false
    const img = u.assistantImage
    const name = u.assistantName
    return !!(img && typeof img === 'string' && img.trim() !== '' && name && String(name).trim() !== '')
  }
  const hasAssistant = hasTheme(userData) || hasTheme(navUser)
  const authUser = userData || navUser

  return (
    <Routes>
      <Route path='/' element={hasAssistant ? <Home/> : <Navigate to={'/customize'} />} />

      <Route path='/signup' element={!authUser ? <SignUp/> : <Navigate to={'/'} />} />
      <Route path='/login' element={!authUser ? <Login/> : <Navigate to={'/'} />} />
      
      <Route path='/customize' element={authUser ? <Customize/> : <Navigate to={'/login'} />} />
      <Route path='/customize2' element={authUser ? <Customize2/> : <Navigate to={'/login'} />} />
    </Routes>
  )
}

export default App
