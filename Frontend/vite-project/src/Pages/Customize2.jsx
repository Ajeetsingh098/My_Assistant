import React, { useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'

// --- ICONS ---
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const Spinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

function Customize2() {
  const { userData, setUserData, serverUrl, refreshUser, loading: authLoading } = useContext(userDataContext)
  const navigate = useNavigate()
  const { state } = useLocation()
  
  const [assistantName, setAssistantName] = useState(userData?.assistantName || '')
  const image = state?.image || null
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  // Auth Check
  useEffect(() => {
    if (!authLoading && !userData) navigate("/signup", { replace: true });
  }, [authLoading, userData, navigate]);

  // --- HANDLERS ---
  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) { console.log("Logout Error", err); }
    setUserData(null);
    navigate("/signup", { replace: true });
  };

  const handleSave = async () => {
    setError('')
    setLoading(true)
    try {
      const body = {
        assistantName: assistantName || userData?.assistantName,
       
        assistantImage: image || userData?.assistantImage || ''
      }

     
      const res = await axios.post(`${serverUrl}/api/user/update`, body, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })

    
      if (typeof setUserData === 'function') {
          setUserData(prev => ({
              ...prev,
              assistantName: body.assistantName,
              assistantImage: body.assistantImage
          }));
      }
      
      // Background refresh
      if (typeof refreshUser === 'function') await refreshUser()
      
      setLoading(false)
      navigate('/')

    } catch (err) {
      console.error("Save error", err)
      setError(err.response?.data?.message || 'Network error. Please try again.')
      setLoading(false)
    }
  }

  if (authLoading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-900 via-[#0f0f2e] to-black text-white font-sans relative overflow-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto relative z-20">
        <h1 className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500 cursor-pointer" onClick={() => navigate('/')}>
          AI ASSISTANT
        </h1>
        
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-full transition border border-transparent hover:border-white/10">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold cursor-pointer">
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
            {/* <span className="hidden sm:block text-sm font-medium text-gray-200">{userData?.name}</span> */}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-sm text-white font-semibold truncate">{userData?.name}</p>
                <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
              </div>
              <button onClick={() => navigate('/')} className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3 transition cursor-pointer">
                <SettingsIcon /> Dashboard
              </button>
              <button onClick={handleLogout} className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition border-t border-white/5 cursor-pointer">
                <LogOutIcon /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid gap-8 md:grid-cols-3 items-start relative z-10">
        
        {/* LEFT SIDEBAR  */}
        <aside className="md:col-span-1 bg-[#0f0f2e]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-6">
          <h2 className="text-2xl font-bold mb-2 text-white">Final Step</h2>
          <p className="text-sm text-gray-400 mb-6">Give your assistant a name and confirm your theme selection.</p>

          <div className="space-y-6">
            
            {/* Error Message */}
            {error && (
               <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                 {error}
               </div>
            )}

            {/* Name Input */}
            <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Assistant Name</label>
                <input
                    type="text"
                    placeholder="e.g. Jarvis, Friday..."
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition"
                    required
                />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button 
                    onClick={handleSave} 
                    disabled={!assistantName || loading}
                    className="w-full py-3 px-4 rounded-lg transition text-sm font-bold shadow-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? <Spinner /> : <SaveIcon />} 
                    {loading ? 'Saving...' : 'Save & Finish'}
                </button>

                <button 
                    onClick={() => navigate(-1)} 
                    disabled={loading}
                    className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                    <ArrowLeftIcon /> Go Back
                </button>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN  */}
        <main className="md:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Confirm Appearance</h1>
            <p className="text-gray-400 mt-1">This is how your assistant will appear on the dashboard.</p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black relative group">
            {image ? (
              <>
                <img src={image} alt="Selected Theme" className="w-full h-[500px] object-cover opacity-90" />
                <div className="absolute inset-0 bg-linear-to-t from-[#0f0f2e] via-transparent to-transparent opacity-60"></div>
                
                {/* Name  */}
                <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-black to-transparent">
                    <h3 className="text-4xl font-bold text-white drop-shadow-lg">{assistantName || "Assistant"}</h3>
                    <p className="text-blue-400 text-sm font-medium tracking-wider uppercase mt-1">AI Companion</p>
                </div>
              </>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-gray-500 bg-white/5">
                  <p>No image selected.</p>
                  <button onClick={() => navigate(-1)} className="mt-4 text-blue-400 hover:underline cursor-pointer">Go back to select one</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Customize2












// main code //

// import React, { useContext, useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { userDataContext } from '../context/UserContext'

// function Customize2() {
//   const { userData, setUserData, serverUrl, refreshUser } = useContext(userDataContext)
//   const [assistantName, setAssistantName] = useState(userData?.assistantName || '')
//   const { state } = useLocation()
//   const navigate = useNavigate()
//   const image = state?.image || null
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleSave = async () => {
//     setError('')
//     setLoading(true)
//     try {
//       const body = {
//         assistantName: assistantName || userData?.assistantName,
//         imageUrl: image || userData?.assistantImage || ''
//       }

//       const res = await fetch(`${serverUrl}/api/user/update`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(body)
//       })

//       const data = await res.json()
//       if (!res.ok) {
//         setError(data.message || 'Failed to save selection')
//         setLoading(false)
//         return
//       }

//       // server returns updated user
//       if (typeof setUserData === 'function') setUserData(data)
//       // refreshUser if available
//       if (typeof refreshUser === 'function') await refreshUser()
//       setLoading(false)
//       navigate('/')
//     } catch (err) {
//       setError('Network error. Please try again.')
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="w-full min-h-screen bg-linear-to-t from-[black] to-[#020236] py-12">
//       <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-3 items-start">
//         <aside className="md:col-span-1 bg-white/5 rounded-lg p-6 backdrop-blur-sm text-white sticky top-24">
//           <h2 className="text-2xl font-semibold mb-2">Customize — Step 2</h2>
//           <p className="text-sm text-gray-200 mb-4">Confirm the selection and details before saving. Use Back to change your selection.</p>
//           <div className="space-y-3">
//             <label className="block text-sm text-gray-200">Assistant name</label>
//             <input
//               type="text"
//               placeholder="eg: Sifra"
//               required
//               onChange={(e) => setAssistantName(e.target.value)}
//               value={assistantName}
//               className="w-full px-3 py-2 rounded bg-white/5 text-white placeholder:text-gray-400 border border-white/10"
//             />
//            {assistantName && <button onClick={handleSave} className="w-full py-2 px-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer">Save selection</button>}
//             <button onClick={() => navigate(-1)} className="w-full py-2 px-3 bg-transparent border border-white/20 text-white rounded hover:bg-white/5 cursor-pointer">Back</button>
//           </div>
//         </aside>

//         <main className="md:col-span-2">
//           <div className="mb-4 text-white">
//             <h1 className="text-3xl font-bold">Confirm Selection</h1>
//             <p className="text-sm text-gray-200 mt-1">Preview and confirm the layout or upload you'd like to use for your assistant.</p>
//           </div>

//           <div className="rounded-lg overflow-hidden shadow-lg bg-gray-900">
//             {image ? (
//               <img src={image} alt="Selected" className="w-full h-[560px] sm:h-96 object-cover" />
//             ) : (
//               <div className="h-96 flex items-center justify-center text-gray-300">No image passed — go back and select one.</div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default Customize2
