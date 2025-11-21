import React, { useContext, useRef, useState, useEffect } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Card from '../components/Card' 
import image1 from "../assets/image1.jpg"
import image2 from "../assets/image2.jpg"

// --- ICONS  ---
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

function Customize() {
  const { serverUrl, userData, setUserData, loading } = useContext(userDataContext)
  const navigate = useNavigate()
  
  // State
  const initial = [image1, image2]
  const [items, setItems] = useState(initial)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const fileRef = useRef(null)

  // Auth Check
  useEffect(() => {
    if (!loading && !userData) navigate("/signup", { replace: true });
  }, [loading, userData, navigate]);

  // --- ACTIONS ---
  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setItems((prev) => [url, ...prev])
    setSelectedIndex(0) 
    setPreviewImage(url) 
    e.target.value = null
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) { console.log("Logout Error", err); }
    setUserData(null);
    navigate("/signup", { replace: true });
  };

  
  const handleCardClick = (index) => {
    setSelectedIndex(index);
    setPreviewImage(items[index]); 
  };

  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

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
      <div className="max-w-6xl mx-auto px-4 py-6 grid gap-8 lg:grid-cols-3 items-start relative z-10">
        
        {/* LEFT */}
        <aside className="lg:col-span-1 bg-[#0f0f2e]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-6">
          <h2 className="text-2xl font-bold mb-2 text-white">Customize</h2>
          <p className="text-sm text-gray-400 mb-6">Choose a visual theme for your AI assistant. Upload your own or pick a theme given below.</p>

          <div className="space-y-6">
            
            {/* Preview Box */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</h3>
              <div className="aspect-video w-full bg-black/40 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center relative group">
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover transition duration-500" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs text-white font-medium">Active Selection</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-600">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                      <SettingsIcon />
                    </div>
                    <span className="text-xs">Select an image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action  */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                   setSelectedIndex(null)
                   setPreviewImage(null)
                }}
                className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition text-sm font-medium cursor-pointer"
              >
                Reset
              </button>
              
              <button
                onClick={() => {
                  if (selectedIndex !== null) {
                    navigate('/customize2', { state: { image: items[selectedIndex] } })
                  }
                }}
                disabled={selectedIndex === null}
                className={`flex-1 py-3 px-4 rounded-lg transition text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer
                  ${selectedIndex !== null 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
              >
                Next Step
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN  */}
        <main className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Layouts & Themes</h1>
            <p className="text-gray-400 mt-1">Select an image to serve as your assistant's avatar.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            
            {/* Add New Image Card */}
            <div 
              onClick={() => fileRef.current?.click()}
              className="aspect-3/4 rounded-xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all cursor-pointer flex flex-col items-center justify-center group"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <PlusIcon />
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white">Upload New</span>
              <span className="text-xs text-gray-500 mt-1">JPG, PNG</span>
            </div>

            {/* Image Cards */}
            {items.map((img, i) => (
              <div 
                key={i} 
                onClick={() => handleCardClick(i)}
                className={`relative aspect-3/4 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300
                  ${selectedIndex === i 
                    ? 'ring-4 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]' 
                    : 'hover:scale-[1.02] hover:ring-2 hover:ring-white/20'}`}
              >
                <img src={img} alt={`Theme ${i}`} className="w-full h-full object-cover" />
                
                {/* Overlay gradient */}
                <div className={`absolute inset-0 bg-black/20 group-hover:bg-transparent transition ${selectedIndex === i ? 'bg-transparent' : ''}`}></div>

                {/* Selected Checkmark */}
                {selectedIndex === i && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg animate-scaleIn">
                    <CheckIcon />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Hidden File Input */}
          <input 
            id="add-image-input" 
            ref={fileRef} 
            type="file" 
            accept="image/*" 
            onChange={onFileChange} 
            className="hidden" 
          />
        </main>

      </div>
    </div>
  )
}

export default Customize

















// main code //


// import React, { useContext, useRef, useState } from 'react'
// import Card from '../components/Card'
// import image1 from "../assets/image1.jpg"
// import image2 from "../assets/image2.jpg"
// import { RiImageAddFill } from "react-icons/ri";
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// function Customize() {
//     const {serverUrl,userData,setUserData}=useContext(userDataContext)
//   const navigate=useNavigate()
//     const initial = [image1, image2]
//   const [items, setItems] = useState(initial)
//   const [selectedIndex, setSelectedIndex] = useState(null)
//   const [previewImage, setPreviewImage] = useState(null)
//   const fileRef = useRef(null)

//   const onAddClick = () => {
//     if (fileRef.current) fileRef.current.click()
//   }

//   const onFileChange = (e) => {
//     const f = e.target.files && e.target.files[0]
//     if (!f) return
//     const url = URL.createObjectURL(f)
//     // prepend new image to list and select it
//     setItems((prev) => [url, ...prev])
//     setSelectedIndex(0)
//     // reset input
//     e.target.value = null
//   }

//   return (
//     <div className="w-full min-h-screen bg-linear-to-t from-[black] to-[#020236] py-12">
//       <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-3 items-start">
       
//         <aside className="md:col-span-1 bg-white/5 rounded-lg p-6 backdrop-blur-sm text-white">
//           <h2 className="text-2xl font-semibold mb-2">Customize</h2>
//           <p className="text-sm text-gray-200 mb-4">Choose a layout preview or theme to personalize your assistant. Click a card to select it and then save your preferences.</p>

//           <div className="space-y-3">
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => {
//                   if (selectedIndex === null) return
//                   setPreviewImage(items[selectedIndex])
//                 }}
//                 disabled={selectedIndex === null}
//                 className={`flex-1 py-2 px-3 text-white rounded ${selectedIndex === null ? 'bg-indigo-400/60 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'}`}>
//                 Apply selected
//               </button>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => {
//                   setSelectedIndex(null)
//                   setPreviewImage(null)
//                 }}
//                 className="flex-1 py-2 px-3 bg-transparent border border-white/20 text-white rounded hover:bg-white/5 cursor-pointer">
//                 Reset
//               </button>
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="text-sm font-medium text-gray-200 mb-2">Preview</h3>
//             <div className="h-48 bg-white/3 rounded flex items-center justify-center text-sm text-gray-100 overflow-hidden">
//               {previewImage ? (
//                 <img src={previewImage} alt="Selected preview" className="w-full h-full object-cover" />
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center text-sm text-gray-200">
//                   <span className="mb-1">No selection</span>
//                   <span className="text-xs text-gray-300">Select a card and click Apply selected</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div>
//             {selectedIndex !== null && (
//               <button
//                 onClick={() => navigate('/customize2', { state: { image: items[selectedIndex] } })}
//                 className="min-w-[150px] px-4 mt-2 py-2 bg-white text-black rounded-md shadow-sm hover:shadow-md cursor-pointer"
//               >
//                 Next
//               </button>
//             )}
//           </div>
//         </aside>

//         {/*cards */}
//         <main className="md:col-span-2">
//           <div className="mb-4 text-white">
//             <h1 className="text-3xl font-bold">Layouts & themes</h1>
//             <p className="text-sm text-gray-200 mt-1">Select a card to preview layout options for your assistant.</p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {/* Add new image */}
//             <div className="transform hover:scale-105 transition-shadow duration-200">
//               <label
//                 htmlFor="add-image-input"
//                 role="button"
//                 tabIndex={0}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' || e.key === ' ') {
//                     e.preventDefault()
//                     document.getElementById('add-image-input')?.click()
//                   }
//                 }}
//                 className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg transform transition shadow-black/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer h-64 flex items-center justify-center bg-gray-800"
//               >
//                 <RiImageAddFill className='text-white w-12 h-12' />
//               </label>
//             </div>

//             {items.map((img, i) => (
//               <div key={i} className="transform hover:scale-105 transition-shadow duration-200 cursor-pointer">
//                 <Card image={img} onClick={() => setSelectedIndex(i)} selected={selectedIndex === i} />
//               </div>
//             ))}
//           </div>

//           {/* hidden file input for image upload (label targets this) */}
//           <input id="add-image-input" ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="sr-only" />

//         </main>
//       </div>
//     </div>
//   )
// }

// export default Customize
