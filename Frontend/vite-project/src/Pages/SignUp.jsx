
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext.jsx'

// --- ICONS  ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const Spinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

function SignUp() {
  const navigate = useNavigate()
  const { serverUrl, setUserData } = useContext(userDataContext)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${serverUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      })
      
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Signup failed')
        setLoading(false)
        setUserData(null)
        return
      }

      setUserData(data.data || data.user)
      setSuccess('Account created successfully!')
      setLoading(false)
      
     
      setTimeout(() => navigate('/customize'), 1000)

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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10 pb-10">
        
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#0f0f2e]/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 animate-scaleIn">
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400 text-sm">Join us to personalize your AI assistant</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Feedback Messages */}
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

            {/* Name Input */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition">
                  <UserIcon />
                </div>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition">
                  <MailIcon />
                </div>
                <input
                  id="email"
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
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition"
                  placeholder="Create a password"
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
              <p className="text-[10px] text-gray-500 mt-1 ml-1">Min 8 chars, mix of letters & numbers.</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition">
                  <LockIcon />
                </div>
                <input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {loading ? <><Spinner /> Creating...</> : 'Create Account'}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="text-blue-400 hover:text-blue-300 font-semibold transition cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SignUp





















// main code //


// import React, { useContext, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { userDataContext } from '../context/UserContext.jsx'
// import axios from "axios"

// // const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// function SignUp() {
//   const navigate = useNavigate()
//   const {serverUrl,userData, setUserData}=useContext(userDataContext)
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')

//   const validateEmail = (value) => {
//     return /\S+@\S+\.\S+/.test(value)
//   }

//   const passwordStrength = (pw) => {
//     let score = 0
//     if (!pw) return 0
//     if (pw.length >= 8) score += 1
//     if (/[A-Z]/.test(pw)) score += 1
//     if (/[0-9]/.test(pw)) score += 1
//     if (/[^A-Za-z0-9]/.test(pw)) score += 1
//     return score
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setSuccess('')

//     if (!name.trim() || !email.trim() || !password) {
//       setError('Please fill in all required fields.')
//       return
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address.')
//       return
//     }
//     if (password.length < 8) {
//       setError('Password must be at least 8 characters long.')
//       return
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords don't match.")
//       return
//     }

//     try {
//       setLoading(true)
//       const res = await fetch(`${serverUrl}/api/auth/signup`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password }),
//         credentials: 'include'
//       })
//       const data = await res.json()
//       setUserData(res.data)
//       if (!res.ok) {
//         setError(data.message || 'Signup failed')
//         setLoading(false)
//         setUserData(null)
//         return
//       }
//       setSuccess('Account created successfully! Redirecting to login...')
//       //  console.log(data)
//       setLoading(false)
//       setTimeout(() => navigate('/customize'),1000)
//     } catch (err) {
//       setError('Network error. Please try again.')
//       setLoading(false)
//       setUserData(null)
//     }
   
//   }

//   const strength = passwordStrength(password)

//   return (
//   <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-300 p-6">
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-4"
//         aria-label="Sign up form"
//       >
//         <h1 className="text-2xl font-semibold text-gray-800">Create an account</h1>

//         {error && (
//           <div className="text-sm text-red-700 bg-red-100 p-2 rounded">{error}</div>
//         )}
//         {success && (
//           <div className="text-sm text-green-800 bg-green-100 p-2 rounded">{success}</div>
//         )}

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Full name</label>
//           <input
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             placeholder="Your full name"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             placeholder="you@example.com"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
//           <div className="relative">
//             <input
//               id="password"
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border rounded px-3 py-2 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Create a password"
//               aria-describedby="pw-help"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((s) => !s)}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-indigo-600 cursor-pointer"
//             >
//               {showPassword ? 'Hide' : 'Show'}
//             </button>
//           </div>
//           <div id="pw-help" className="mt-2">
//             {/* <div className="h-2 bg-gray-200 rounded overflow-hidden">
//               <div
//                 className={`h-full bg-linear-to-r from-red-400 to-green-500 transition-all`} 
//                 style={{ width: `${(strength / 4) * 100}%` }}
//                 aria-hidden
//               />
//             </div> */}
//             <p className="text-xs text-gray-600 mt-1">Use at least 8 characters, mix letters, numbers & symbols.</p>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm">Confirm password</label>
//           <input
//             id="confirm"
//             type={showPassword ? 'text' : 'password'}
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             placeholder="Confirm your password"
//             required
//           />
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
//           >
//             {loading ? 'Creating account...' : 'Create account'}
//           </button>
//         </div>

//         <div className="text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <button type="button" onClick={() => navigate('/login')} 
//           className="text-indigo-600 font-medium cursor-pointer">Sign in</button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default SignUp
