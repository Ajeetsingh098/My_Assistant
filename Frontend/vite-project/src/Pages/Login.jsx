


import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'

// --- ICONS  ---
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const Spinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

function Login() {
  const navigate = useNavigate()
  const { serverUrl, setUserData } = useContext(userDataContext)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${serverUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        setLoading(false)
        setUserData(null)
        return
      }

      const user = data?.user || data
      setUserData(user)
      setSuccess('Login successful!')
      setLoading(false)

      
      setTimeout(() => {
        const hasTheme = (u) => {
          if (!u) return false
          const img = u.assistantImage
          const name = u.assistantName
          return !!(img && typeof img === 'string' && img.trim() !== '' && name && String(name).trim() !== '')
        }

        if (hasTheme(user)) {
          navigate('/', { state: { user } })
        } else {
          navigate('/', { state: { user } }) // Default to home for now
        }
      }, 1000);

    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
      setUserData(null)
    }
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-900 via-[#0f0f2e] to-black text-white font-sans flex flex-col relative overflow-hidden">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full relative z-20">
        <h1 className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500 cursor-pointer" onClick={() => navigate('/')}>
          AI ASSISTANT
        </h1>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        
        {/* Background Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#0f0f2e]/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 animate-scaleIn">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to access your personal assistant</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error / Success Messages */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                {success}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition">
                  <MailIcon />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <><Spinner /> Signing In...</> : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')} 
                className="text-blue-400 hover:text-blue-300 font-semibold transition cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login






















// main code //



// import React, { useContext, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { userDataContext } from '../context/UserContext'

// // const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// function Login() {
//   const navigate = useNavigate()
//   const {serverUrl,userData, setUserData}=useContext(userDataContext)
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')

//   const validateEmail = (value) => /\S+@\S+\.\S+/.test(value)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setSuccess('')

//     if (!email.trim() || !password) {
//       setError('Please fill in all required fields.')
//       return
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address.')
//       return
//     }

//     try {
//       setLoading(true)
//       const res = await fetch(`${serverUrl}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//         credentials: 'include'
//       })

//       const data = await res.json()
//       console.log('login response:', data)

//       if (!res.ok) {
//         setError(data.message || 'Login failed')
//         setLoading(false)
//         setUserData(null)
//         return
//       }

//       // Accept either { user } or direct user object
//       const user = data?.user || data
//       setUserData(user)
//       setSuccess('Login successful! Redirecting...')
//       setLoading(false)

//       const hasTheme = (u) => {
//         if (!u) return false
//         const img = u.assistantImage
//         const name = u.assistantName
//         return !!(img && typeof img === 'string' && img.trim() !== '' && name && String(name).trim() !== '')
//       }

//       if (hasTheme(user)) {
//         navigate('/', { state: { user } })
//       } else {
//         navigate('/customize', { state: { user } })
//       }
//     } catch (err) {
//       setError('Network error. Please try again.')
//       setLoading(false)
//       setUserData(null)
//     }
//   }

//   return (
//     <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-300 p-6">
//       <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2">
//         <div className="hidden md:flex flex-col justify-center px-8 py-10 bg-linear-to-br from-indigo-600 to-indigo-400 text-white">
//           <h2 className="text-3xl font-bold mb-3">Welcome back</h2>
//           <p className="text-gray-100 mb-6">Sign in to continue to your assistant and access your saved settings.</p>
//           <ul className="space-y-2 text-sm">
//             <li className="flex items-start gap-2"><span className="font-semibold">✓</span> Secure sessions</li>
//             <li className="flex items-start gap-2"><span className="font-semibold">✓</span> Quick access</li>
//           </ul>
//         </div>

//         <div className="px-6 py-8 md:px-10 md:py-12">
//           <form
               
//             onSubmit={handleSubmit}
//             className="w-full"
//             aria-label="Login form"
//           >
//             <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">Login</h1>

//             {error && (
//               <div className="text-sm text-red-700 bg-red-100 p-2 rounded mb-3">{error}</div>
//             )}
//             {success && (
//               <div className="text-sm text-green-800 bg-green-100 p-2 rounded mb-3">{success}</div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Username</label>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                   placeholder="you@example.com"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
//                 <div className="relative">
//                   <input
//                     id="password"
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full border rounded px-3 py-2 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                     placeholder="Password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((s) => !s)}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-indigo-600 cursor-pointer"
//                   >
//                     {showPassword ? 'Hide' : 'Show'}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
//                 >
//                   {loading ? 'Signing in...' : 'Sign in'}
//                 </button>
//               </div>

//               <div className="text-center text-sm text-gray-600">
//                 Don't have an account?{' '}
//                 <button type="button" onClick={() => navigate('/signup')} 
//                 className="text-indigo-600 font-medium cursor-pointer">Sign Up</button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login
