import React, { useContext, useEffect, useState, useRef } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- ICONS ---
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>;
const MicOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Spinner = () => <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;

const Typewriter = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    if (!text) return;

    const cleanText = text
      .replace(/\\n/g, '\n') 
      .replace(/(\.)([A-Z])/g, '$1\n$2') 
      .replace(/(?<!\n)\* /g, '\n* '); 

    setDisplayedText(""); 
    let i = 0;
    
    const timer = setInterval(() => {
      if (i < cleanText.length) {
        setDisplayedText((prev) => prev + cleanText.charAt(i));
        i++; 
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);

  return <div className="whitespace-pre-wrap leading-relaxed break-words">{displayedText}</div>;
};

function Home() {
  const { userData, setUserData, serverUrl, getGeminiResponse, loading } = useContext(userDataContext);
  const navigate = useNavigate();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("chat");
  const [status, setStatus] = useState("idle");
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [updating, setUpdating] = useState(false);

  // --- NEW: State for Video Player ---
  const [videoPrompt, setVideoPrompt] = useState(null);

  // Settings Form
  const [username, setUsername] = useState("");
  const [assistantName, setAssistantName] = useState("");
  const [assistantImage, setAssistantImage] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const activeTabRef = useRef(activeTab);

   useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);
  
  // Initialize form
  useEffect(() => {
    if (userData) {
      setUsername(userData.name || "");
      setAssistantName(userData.assistantName || "Jarvis");
      setAssistantImage(userData.assistantImage || "");
    }
  }, [userData]);

  // Auth Check
  useEffect(() => {
    if (!loading && !userData) navigate("/signup", { replace: true });
  }, [loading, userData, navigate]);

  // Auto-Scroll Effect
 useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status, activeTab]);
  
  // --- geminidata ---
  const parseGeminiResponse = (raw) => {
    try {
      if (typeof raw === 'object' && raw !== null) return raw;
      const rawString = String(raw);
      const cleanString = rawString.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanString);
    } catch (err) { 
      return { type: "general", response: typeof raw === 'string' ? raw : "I didn't understand that." }; 
    }
  };

  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  };

  // --- HANDLE FILE ---//
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      setAssistantImage(URL.createObjectURL(file)); 
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET_NAME 

    let finalImageUrl = assistantImage;

    try {
      if (fileToUpload) {
        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("upload_preset", uploadPreset); 
        
        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        finalImageUrl = uploadRes.data.secure_url;
      }

      await axios.post(`${serverUrl}/api/user/update`, {
        name: username,
        assistantName: assistantName,
        assistantImage: finalImageUrl
      }, { withCredentials: true });

      const newUserData = {
        ...userData, 
        name: username,
        assistantName: assistantName,
        assistantImage: finalImageUrl 
      };

      setUserData(newUserData); 
      setShowSettings(false);
      alert("Profile Updated Successfully!");

    } catch (error) {
      console.error("CLOUDINARY ERROR DETAIL:", error.response?.data);
      if (error.response?.data?.error?.message) {
        alert(`Cloudinary Error: ${error.response.data.error.message}`);
      } else {
        alert("Upload failed. Check the console for 'CLOUDINARY ERROR DETAIL'");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (serverUrl) {
        await fetch(`${serverUrl}/api/auth/logout`, {
          method: "GET",
          credentials: "include",
        });
      }
    } catch (err) {
      console.error("logout error", err);
    }

    setUserData(null);
    navigate("/signup", { replace: true });
  };

  const speak = (text) => {
    if (!text) return;
    setStatus("speaking");
    stopListening();
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    
    const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google US English")) || voices[0];
        if (preferredVoice) utter.voice = preferredVoice;
        window.speechSynthesis.speak(utter);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
        setVoice();
    }
  
    utter.onend = () => { 
      setStatus("idle"); 
      if (activeTabRef.current === 'voice') {
        startListening(); 
      }
    };
  };
  
  // --- EXECUTE COMMAND (FIXED) ---
  const executeCommand = (data, isVoice) => {
    if (!data) { 
      if (isVoice) speak("Sorry, I missed that."); 
      return; 
    }

    const respond = (text) => { 
      addMessage("ai", text); 
      if (isVoice) speak(text); 
      else setStatus("idle"); 
    };

    const searchTerm = data.video || data.query || "music";
    const assistantName = userData?.assistantName || "Jarvis";

    switch (data.type) {
      case "general": 
        respond(data.response); 
        break;

      case "youtube_search": 
        const searchRegex = new RegExp(`hey|${assistantName}|search|youtube|find|on|for|please`, "gi");
        const cleanYoutubeQuery = searchTerm.replace(searchRegex, "").trim();
        
        respond(`Searching YouTube for ${cleanYoutubeQuery}`); 
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(cleanYoutubeQuery)}`, "_blank"); 
        break;

     case "youtube_play": 
        const playRegex = new RegExp(`hey|${assistantName}|play|open|want|to|listen|youtube|please`, "gi");
        const song = searchTerm.replace(playRegex, '').trim();
        
        if (!song) {
             respond("I couldn't hear a song name.");
             return;
        }

        respond(`Playing ${song}`); 

        
        try {
           
            const response = await axios.get(`https://pipedapi.kavin.rocks/search?q=${song}&filter=music_videos`);
            
            if (response.data && response.data.items.length > 0) {
                const firstVideo = response.data.items[0];
            
                const videoId = firstVideo.url.split("v=")[1]; 
                setVideoPrompt(videoId); // Store the ID, not the name
            } else {
                respond("I couldn't find that song.");
            }
        } catch (error) {
            console.error("Video fetch failed", error);
            respond("I had trouble finding the video ID.");
        }
        break;
        

      case "google_search": 
        const googleRegex = new RegExp(`hey|${assistantName}|google|search|find|for`, "gi");
        const cleanGoogleQuery = (data.query || searchTerm).replace(googleRegex, "").trim();
        
        respond(`Searching Google for ${cleanGoogleQuery}`); 
        window.open(`https://www.google.com/search?q=${encodeURIComponent(cleanGoogleQuery)}`, "_blank"); 
        break;

      case "weather_show": 
        respond(`Checking weather for ${data.city}`); 
        window.open(`https://www.google.com/search?q=weather+${encodeURIComponent(data.city)}`, "_blank"); 
        break;

      case "get_time": 
        respond(`It is ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`); 
        break;

      case "get_date": 
        respond(`Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}`); 
        break;

      case "instagram_open": 
        respond("Opening Instagram"); 
        window.open("https://www.instagram.com", "_blank"); 
        break;

      case "facebook_open": 
        respond("Opening Facebook"); 
        window.open("https://www.facebook.com", "_blank"); 
        break;

      case "calculator_open": 
        respond("Opening Calculator"); 
        window.open("https://www.google.com/search?q=calculator", "_blank"); 
        break;

      default: 
        respond(data.response || "I'm not sure how to handle that.");
    }
  };

  
  const handleUserRequest = async (text, isVoice = false) => {
    if (!text.trim()) return;
    addMessage("user", text);
    setStatus("processing");
    const raw = await getGeminiResponse(text);
    const data = parseGeminiResponse(raw);
    // executeCommand(data, isVoice);
    await executeCommand(data, isVoice);
    
  };

  // --- SPEECH RECOGNITION ---
  const startListening = () => { try { recognitionRef.current?.start(); setStatus("listening"); } catch(e){} };
  const stopListening = () => { recognitionRef.current?.stop(); };
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().includes((userData?.assistantName || "assistant").toLowerCase())) {
        stopListening();
        handleUserRequest(transcript, true);
      }
    };
    recognitionRef.current = recognition;
    
    if (activeTab === 'voice') {
      startListening();
    } else {
      stopListening();
    }
    return () => recognitionRef.current?.stop();
  }, [userData, activeTab]); 


  const handleTextSubmit = (e) => { e.preventDefault(); handleUserRequest(textInput, false); setTextInput(""); };
  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-900 via-[#0f0f2e] to-black text-white font-sans relative overflow-hidden">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto relative z-20">
        <h1 className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">AI ASSISTANT</h1>
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-full transition border border-transparent hover:border-white/10 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">{userData?.name?.charAt(0).toUpperCase()}</div>
            {/* <span className="hidden sm:block text-sm font-medium text-gray-200">{userData?.name}</span> */}
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-sm text-white font-semibold truncate">{userData?.name}</p>
                <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
              </div>
              <button onClick={() => setShowSettings(true)} className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3 transition cursor-pointer"><SettingsIcon /> Settings</button>
              <button onClick={handleLogout} className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition border-t border-white/5 cursor-pointer"><LogOutIcon /> Logout</button>
            </div>
          )}
        </div>
      </nav>

       {/* TAB TOGGLE */}
      <div className="w-full flex justify-center mb-4 z-20 relative">
        <div className="bg-white/10 p-1 rounded-full flex gap-1 backdrop-blur-md border border-white/5">
          <button 
            onClick={() => setActiveTab('chat')} 
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <ChatIcon /> Chat
          </button>
          <button 
            onClick={() => setActiveTab('voice')} 
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeTab === 'voice' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <MicIcon /> Voice
          </button>
        </div>
      </div>

      {/* --- SETTINGS  --- */}
      {showSettings && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f2e] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-scaleIn">
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><CloseIcon /></button>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><SettingsIcon /> Profile Settings</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Your Name</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Assistant Name</label>
                <input type="text" value={assistantName} onChange={(e) => setAssistantName(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none" />
              </div>

              {/* --- IMAGE UPLOAD --- */}
              <div>
                 <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Assistant Image</label>
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-black border border-white/20 shrink-0">
                       {assistantImage ? (
                         <img src={assistantImage} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                       )}
                    </div>
                    <label className="flex-1 cursor-pointer">
                      <div className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-3 transition group">
                        <UploadIcon />
                        <span className="text-sm text-gray-300 group-hover:text-white">Click to Upload</span>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                 </div>
              </div>

              <button type="submit" disabled={updating} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-2 cursor-pointer">
                {updating ? "Uploading & Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

       {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full max-w-6xl mx-auto p-4 flex items-center justify-center relative z-10">
        
        {/* 1. VOICE MODE VIEW */}
        {activeTab === 'voice' && (
          <div className="flex flex-col items-center justify-center space-y-10 animate-fadeIn w-full h-full">
            <div className="relative group">
              <div className={`absolute -inset-1 rounded-full blur-xl opacity-75 transition-all duration-500 ${status === 'listening' ? 'bg-green-500' : status === 'speaking' ? 'bg-blue-500' : status === 'processing' ? 'bg-purple-500' : 'bg-gray-700'}`}></div>
              <div className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-black">
                {userData?.assistantImage ? ( <img src={userData.assistantImage} alt="AI" className="w-full h-full object-cover opacity-90" /> ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black"><div className={`w-48 h-48 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 opacity-80 transition-all duration-1000 ${status === 'speaking' ? 'animate-pulse scale-110' : 'scale-100'}`}></div></div>
                )}
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-8 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-sm tracking-widest uppercase font-semibold shadow-xl text-white">{status}</div>
            </div>
            
            <div className="text-center space-y-4 max-w-lg">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">I'm Listening</h2>
              <p className="text-gray-400 text-lg">Just say "{userData?.assistantName || "Assistant"}" to wake me up, or tap the mic below.</p>
            </div>

            <button onClick={() => status === 'listening' ? stopListening() : startListening()} className={`p-6 rounded-full transition-all border border-white/10 shadow-lg transform hover:scale-105 cursor-pointer ${status === 'listening' ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
               {status === 'listening' ? <MicIcon /> : <MicOffIcon />}
            </button>
          </div>
        )}

        {/* 2. CHAT MODE VIEW */}
        {activeTab === 'chat' && (
          <div className="w-full max-w-3xl h-[80vh] flex flex-col bg-[#1a1a2e]/80 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
            
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-black border border-white/20">
                 {userData?.assistantImage ? <img src={userData.assistantImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs bg-blue-600">AI</div>}
              </div>
              <div>
                <h3 className="font-semibold text-white">{userData?.assistantName || "Assistant"}</h3>
                <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/20">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                  <div className="p-4 bg-white/5 rounded-full"><ChatIcon /></div>
                  <p className="text-sm">Start a conversation...</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm shadow-md leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white/10 text-gray-100 rounded-bl-none border border-white/5'
                  }`}>
                    {msg.role === 'ai' ? <Typewriter text={msg.text} /> : msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleTextSubmit} className="p-4 bg-black/40 border-t border-white/10 flex gap-3 items-center">
              <input 
                type="text" 
                value={textInput} 
                onChange={(e) => setTextInput(e.target.value)} 
                placeholder="Type your message..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-white placeholder-gray-500" 
              />
              <button 
                type="submit" 
                className="p-3 bg-blue-600 rounded-full hover:bg-blue-500 transition shadow-lg disabled:opacity-50 text-white cursor-pointer flex-shrink-0" 
                disabled={!textInput.trim()}
              >
                <SendIcon />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* --- YOUTUBE VIDEO OVERLAY --- */}
      {videoPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-4xl bg-[#0f0f2e] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative animate-scaleIn">
            
            {/* Close Button */}
            <button 
              onClick={() => setVideoPrompt(null)} 
              className="absolute top-4 right-4 z-10 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition cursor-pointer"
            >
              <CloseIcon />
            </button>

            {/* The Player */}
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(videoPrompt)}&autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-4 bg-white/5 flex justify-between items-center">
               <h3 className="text-white font-semibold text-lg">Playing Video</h3>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;










// import React, { useContext, useEffect, useState, useRef } from 'react';
// import { userDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';


// // --- ICONS ---
// const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>;
// const MicOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>;
// const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
// const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
// const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
// const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
// const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
// const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
// const Spinner = () => <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
// const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;

// const Typewriter = ({ text, speed = 10 }) => {
//   const [displayedText, setDisplayedText] = useState("");
  
//   useEffect(() => {
//     if (!text) return;

   
//     const cleanText = text
//       .replace(/\\n/g, '\n') 
//       .replace(/(\.)([A-Z])/g, '$1\n$2') 
//       .replace(/(?<!\n)\* /g, '\n* '); 

//     setDisplayedText(""); 
//     let i = 0;
    
  
//     const timer = setInterval(() => {
//       if (i < cleanText.length) {
//         setDisplayedText((prev) => prev + cleanText.charAt(i));
//         i++; 
//       } else {
//         clearInterval(timer);
//       }
//     }, speed);
    
//     return () => clearInterval(timer);
//   }, [text, speed]);

  
//   return <div className="whitespace-pre-wrap leading-relaxed break-words">{displayedText}</div>;
// };

// function Home() {
//   const { userData, setUserData, serverUrl, getGeminiResponse, loading } = useContext(userDataContext);
//   const navigate = useNavigate();

//   // --- STATE ---

 
//   const [activeTab, setActiveTab] = useState("chat");
//   const [status, setStatus] = useState("idle");
//   const [messages, setMessages] = useState([]);
//   const [textInput, setTextInput] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [updating, setUpdating] = useState(false);

//   // Settings Form
//   const [username, setUsername] = useState("");
//   const [assistantName, setAssistantName] = useState("");
//   const [assistantImage, setAssistantImage] = useState("");
//   const [fileToUpload, setFileToUpload] = useState(null);

//   const recognitionRef = useRef(null);
//   const messagesEndRef = useRef(null);
//    const activeTabRef = useRef(activeTab);

//    useEffect(() => {
//     activeTabRef.current = activeTab;
//   }, [activeTab]);
  
//   // Initialize form
//   useEffect(() => {
//     if (userData) {
//       setUsername(userData.name || "");
//       setAssistantName(userData.assistantName || "Jarvis");
//       setAssistantImage(userData.assistantImage || "");
//     }
//   }, [userData]);

//   // Auth Check
//   useEffect(() => {
//     if (!loading && !userData) navigate("/signup", { replace: true });
//   }, [loading, userData, navigate]);

//   // Auto-Scroll Effect
//  useEffect(() => {
//     if (activeTab === 'chat') {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages, status, activeTab]);
  
//   // --- geminidata ---
//   const parseGeminiResponse = (raw) => {
//     try {
//       if (typeof raw === 'object' && raw !== null) return raw;
//       const rawString = String(raw);
//       const cleanString = rawString.replace(/```json|```/g, '').trim();
//       return JSON.parse(cleanString);
//     } catch (err) { 
//       return { type: "general", response: typeof raw === 'string' ? raw : "I didn't understand that." }; 
//     }
//   };

//   const addMessage = (role, text) => {
//     setMessages(prev => [...prev, { role, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
//   };

//   // --- HANDLE FILE ---//
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFileToUpload(file);
//       setAssistantImage(URL.createObjectURL(file)); 
//     }
//   };

  
//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setUpdating(true);


//     const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
//     const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET_NAME 

//     let finalImageUrl = assistantImage;

//     try {
    
//       if (fileToUpload) {
//         const formData = new FormData();
//         formData.append("file", fileToUpload);
//         formData.append("upload_preset", uploadPreset); 
        
//         const uploadRes = await axios.post(
//           `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//           formData
//         );
//         finalImageUrl = uploadRes.data.secure_url;
//       }

      
//       await axios.post(`${serverUrl}/api/user/update`, {
//         name: username,
//         assistantName: assistantName,
//         assistantImage: finalImageUrl
//       }, { withCredentials: true });

      
//       const newUserData = {
//         ...userData, 
//         name: username,
//         assistantName: assistantName,
//         assistantImage: finalImageUrl 
//       };

//       setUserData(newUserData); 
//       setShowSettings(false);
//       alert("Profile Updated Successfully!");

//     } catch (error) {
    
//       console.error("CLOUDINARY ERROR DETAIL:", error.response?.data);
      
//       if (error.response?.data?.error?.message) {
//         alert(`Cloudinary Error: ${error.response.data.error.message}`);
//       } else {
//         alert("Upload failed. Check the console for 'CLOUDINARY ERROR DETAIL'");
//       }
//     } finally {
//       setUpdating(false);
//     }
//   };


//   const handleLogout = async () => {
//     try {
//       if (serverUrl) {
//         await fetch(`${serverUrl}/api/auth/logout`, {
//           method: "GET",
//           credentials: "include",
//         });
//       }
//     } catch (err) {
//       console.error("logout error", err);
//     }

//     setUserData(null);
//     navigate("/signup", { replace: true });
//   };

 
//   // const speak = (text) => {
//   //   if (!text) return;
//   //   setStatus("speaking");
//   //   stopListening();
//   //   window.speechSynthesis.cancel();
//   //   const utter = new SpeechSynthesisUtterance(text);
//   //   const voices = window.speechSynthesis.getVoices();
//   //   const preferredVoice = voices.find(v => v.name.includes("Google US English")) || voices[0];
//   //   if (preferredVoice) utter.voice = preferredVoice;
//   //   utter.onend = () => { setStatus("idle"); startListening(); };
//   //   window.speechSynthesis.speak(utter);
//   // };

// const speak = (text) => {
//     if (!text) return;
//     setStatus("speaking");
//     stopListening();
//     window.speechSynthesis.cancel();
//     const utter = new SpeechSynthesisUtterance(text);
    
//     const setVoice = () => {
//         const voices = window.speechSynthesis.getVoices();
//         const preferredVoice = voices.find(v => v.name.includes("Google US English")) || voices[0];
//         if (preferredVoice) utter.voice = preferredVoice;
//         window.speechSynthesis.speak(utter);
//     };

//     if (window.speechSynthesis.getVoices().length === 0) {
//         window.speechSynthesis.onvoiceschanged = setVoice;
//     } else {
//         setVoice();
//     }
  
//  utter.onend = () => { 
//       setStatus("idle"); 
//       if (activeTabRef.current === 'voice') {
//         startListening(); 
//       }
//     };
//   };
  
  
//  const executeCommand = (data, isVoice) => {
//     if (!data) { 
//       if (isVoice) speak("Sorry, I missed that."); 
//       return; 
//     }

//     const respond = (text) => { 
//       addMessage("ai", text); 
//       if (isVoice) speak(text); 
//       else setStatus("idle"); 
//     };

//     const searchTerm = data.video || data.query || "music";
    
 
//     const assistantName = userData?.assistantName || "Jarvis";

//     switch (data.type) {
//       case "general": 
//         respond(data.response); 
//         break;

//       case "youtube_search": 
       
//         const searchRegex = new RegExp(`hey|${assistantName}|search|youtube|find|on|for|please`, "gi");
//         const cleanYoutubeQuery = searchTerm.replace(searchRegex, "").trim();
        
//         respond(`Searching YouTube for ${cleanYoutubeQuery}`); 
//         window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(cleanYoutubeQuery)}`, "_blank"); 
//         break;
        

//        case "youtube_play":
        
//         const playRegex = new RegExp(`hey|${assistantName}|play|open|want|to|listen|youtube|please`, "gi");
        
       
//         const song = searchTerm.replace(playRegex, '').trim();
        
//         respond(`Playing ${song}`);
        
      
       
//         window.open(`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(song)}&autoplay=1`, "_blank");
//         break;
        

//         case "google_search": 
      
//         const googleRegex = new RegExp(`hey|${assistantName}|google|search|find|for`, "gi");
//         const cleanGoogleQuery = (data.query || searchTerm).replace(googleRegex, "").trim();
        
//         respond(`Searching Google for ${cleanGoogleQuery}`); 
//         window.open(`https://www.google.com/search?q=${encodeURIComponent(cleanGoogleQuery)}`, "_blank"); 
//         break;

//       case "weather_show": 
//         respond(`Checking weather for ${data.city}`); 
//         window.open(`https://www.google.com/search?q=weather+${encodeURIComponent(data.city)}`, "_blank"); 
//         break;

//       case "get_time": 
//         respond(`It is ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`); 
//         break;

//       case "get_date": 
//         respond(`Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}`); 
//         break;

//       case "instagram_open": 
//         respond("Opening Instagram"); 
//         window.open("https://www.instagram.com", "_blank"); 
//         break;

//       case "facebook_open": 
//         respond("Opening Facebook"); 
//         window.open("https://www.facebook.com", "_blank"); 
//         break;

//       case "calculator_open": 
//         respond("Opening Calculator"); 
//         window.open("https://www.google.com/search?q=calculator", "_blank"); 
//         break;

//       default: 
//         respond(data.response || "I'm not sure how to handle that.");
//     }
//   };

  
//   const handleUserRequest = async (text, isVoice = false) => {
//     if (!text.trim()) return;
//     addMessage("user", text);
//     setStatus("processing");
//     const raw = await getGeminiResponse(text);
//     const data = parseGeminiResponse(raw);
//     executeCommand(data, isVoice);
//   };

//   // --- SPEECH RECOGNITION ---
//   const startListening = () => { try { recognitionRef.current?.start(); setStatus("listening"); } catch(e){} };
//   const stopListening = () => { recognitionRef.current?.stop(); };
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;
//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.onresult = (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       if (transcript.toLowerCase().includes((userData?.assistantName || "assistant").toLowerCase())) {
//         stopListening();
//         handleUserRequest(transcript, true);
//       }
//     };
//   //   recognitionRef.current = recognition;
//   //   startListening();
//   //   return () => recognitionRef.current?.stop();
//   // }, [userData]);

// recognitionRef.current = recognition;
   
//     if (activeTab === 'voice') {
//       startListening();
//     } else {
//       stopListening();
//     }
//     return () => recognitionRef.current?.stop();
//   }, [userData, activeTab]); 


  

//   const handleTextSubmit = (e) => { e.preventDefault(); handleUserRequest(textInput, false); setTextInput(""); };
//   if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

//   return (
//     <div className="min-h-screen w-full bg-linear-to-br from-gray-900 via-[#0f0f2e] to-black text-white font-sans relative overflow-hidden">
      
//       {/* Navbar */}
//       <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto relative z-20">
//         <h1 className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">AI ASSISTANT</h1>
//         <div className="relative">
//           <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-full transition border border-transparent hover:border-white/10 cursor-pointer">
//             <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">{userData?.name?.charAt(0).toUpperCase()}</div>
//             {/* <span className="hidden sm:block text-sm font-medium text-gray-200">{userData?.name}</span> */}
//           </button>
//           {showDropdown && (
//             <div className="absolute right-0 mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
//               <div className="px-4 py-3 border-b border-white/5">
//                 <p className="text-sm text-white font-semibold truncate">{userData?.name}</p>
//                 <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
//               </div>
//               <button onClick={() => setShowSettings(true)} className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3 transition cursor-pointer"><SettingsIcon /> Settings</button>
//               <button onClick={handleLogout} className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition border-t border-white/5 cursor-pointer"><LogOutIcon /> Logout</button>
//             </div>
//           )}
//         </div>
//       </nav>

//        {/* TAB TOGGLE */}
//       <div className="w-full flex justify-center mb-4 z-20 relative">
//         <div className="bg-white/10 p-1 rounded-full flex gap-1 backdrop-blur-md border border-white/5">
//           <button 
//             onClick={() => setActiveTab('chat')} 
//             className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
//           >
//             <ChatIcon /> Chat
//           </button>
//           <button 
//             onClick={() => setActiveTab('voice')} 
//             className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeTab === 'voice' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
//           >
//             <MicIcon /> Voice
//           </button>
//         </div>
//       </div>



      
//       {/* --- SETTINGS  --- */}
//       {showSettings && (
//         <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
//           <div className="bg-[#0f0f2e] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-scaleIn">
//             <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><CloseIcon /></button>
//             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><SettingsIcon /> Profile Settings</h2>
            
//             <form onSubmit={handleUpdateProfile} className="space-y-5">
//               <div>
//                 <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Your Name</label>
//                 <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none" />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Assistant Name</label>
//                 <input type="text" value={assistantName} onChange={(e) => setAssistantName(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none" />
//               </div>

//               {/* --- IMAGE UPLOAD --- */}
//               <div>
//                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Assistant Image</label>
//                  <div className="flex items-center gap-4">
//                     <div className="w-16 h-16 rounded-full overflow-hidden bg-black border border-white/20 shrink-0">
//                        {assistantImage ? (
//                          <img src={assistantImage} alt="Preview" className="w-full h-full object-cover" />
//                        ) : (
//                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Img</div>
//                        )}
//                     </div>
//                     <label className="flex-1 cursor-pointer">
//                       <div className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-3 transition group">
//                         <UploadIcon />
//                         <span className="text-sm text-gray-300 group-hover:text-white">Click to Upload</span>
//                       </div>
//                       <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
//                     </label>
//                  </div>
//               </div>

//               <button type="submit" disabled={updating} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-2 cursor-pointer">
//                 {updating ? "Uploading & Saving..." : "Save Changes"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

// {/* delete    */}

//        {/* MAIN CONTENT AREA */}
//       <div className="flex-1 w-full max-w-6xl mx-auto p-4 flex items-center justify-center relative z-10">
        
//         {/* 1. VOICE MODE VIEW */}
//         {activeTab === 'voice' && (
//           <div className="flex flex-col items-center justify-center space-y-10 animate-fadeIn w-full h-full">
//             <div className="relative group">
//               <div className={`absolute -inset-1 rounded-full blur-xl opacity-75 transition-all duration-500 ${status === 'listening' ? 'bg-green-500' : status === 'speaking' ? 'bg-blue-500' : status === 'processing' ? 'bg-purple-500' : 'bg-gray-700'}`}></div>
//               <div className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-black">
//                 {userData?.assistantImage ? ( <img src={userData.assistantImage} alt="AI" className="w-full h-full object-cover opacity-90" /> ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-black"><div className={`w-48 h-48 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 opacity-80 transition-all duration-1000 ${status === 'speaking' ? 'animate-pulse scale-110' : 'scale-100'}`}></div></div>
//                 )}
//               </div>
//               <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-8 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-sm tracking-widest uppercase font-semibold shadow-xl text-white">{status}</div>
//             </div>
            
//             <div className="text-center space-y-4 max-w-lg">
//               <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">I'm Listening</h2>
//               <p className="text-gray-400 text-lg">Just say "{userData?.assistantName || "Assistant"}" to wake me up, or tap the mic below.</p>
//             </div>

//             <button onClick={() => status === 'listening' ? stopListening() : startListening()} className={`p-6 rounded-full transition-all border border-white/10 shadow-lg transform hover:scale-105 cursor-pointer ${status === 'listening' ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
//                {status === 'listening' ? <MicIcon /> : <MicOffIcon />}
//             </button>
//           </div>
//         )}

//         {/* 2. CHAT MODE VIEW */}
//         {activeTab === 'chat' && (
//           <div className="w-full max-w-3xl h-[80vh] flex flex-col bg-[#1a1a2e]/80 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
            
//             {/* Header */}
//             <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
//               <div className="w-10 h-10 rounded-full overflow-hidden bg-black border border-white/20">
//                  {userData?.assistantImage ? <img src={userData.assistantImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs bg-blue-600">AI</div>}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-white">{userData?.assistantName || "Assistant"}</h3>
//                 <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online</p>
//               </div>
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/20">
//               {messages.length === 0 && (
//                 <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
//                   <div className="p-4 bg-white/5 rounded-full"><ChatIcon /></div>
//                   <p className="text-sm">Start a conversation...</p>
//                 </div>
//               )}
//               {messages.map((msg, idx) => (
//                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                   <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm shadow-md leading-relaxed ${
//                     msg.role === 'user' 
//                       ? 'bg-blue-600 text-white rounded-br-none' 
//                       : 'bg-white/10 text-gray-100 rounded-bl-none border border-white/5'
//                   }`}>
//                     {msg.role === 'ai' ? <Typewriter text={msg.text} /> : msg.text}
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Area */}
//             <form onSubmit={handleTextSubmit} className="p-4 bg-black/40 border-t border-white/10 flex gap-3 items-center">
//               <input 
//                 type="text" 
//                 value={textInput} 
//                 onChange={(e) => setTextInput(e.target.value)} 
//                 placeholder="Type your message..." 
//                 className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-white placeholder-gray-500" 
//               />
//               <button 
//                 type="submit" 
//                 className="p-3 bg-blue-600 rounded-full hover:bg-blue-500 transition shadow-lg disabled:opacity-50 text-white cursor-pointer flex-shrink-0" 
//                 disabled={!textInput.trim()}
//               >
//                 <SendIcon />
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;







      
      
       {/* <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="relative group">
            <div className={`absolute -inset-1 rounded-full blur-xl opacity-75 transition-all duration-500 ${status === 'listening' ? 'bg-green-500' : status === 'speaking' ? 'bg-blue-500' : status === 'processing' ? 'bg-purple-500' : 'bg-gray-700'}`}></div>
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-black">
              {userData?.assistantImage ? ( <img src={userData.assistantImage} alt="AI" className="w-full h-full object-cover opacity-90" /> ) : (
                <div className="w-full h-full flex items-center justify-center bg-black"><div className={`w-32 h-32 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 opacity-80 transition-all duration-1000 ${status === 'speaking' ? 'animate-pulse scale-110' : 'scale-100'}`}></div></div>
              )}
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-xs tracking-widest uppercase font-semibold shadow-xl">{status}</div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Hello, I'm {userData?.assistantName || "Assistant"}</h2>
            <p className="text-gray-400 text-sm">Say "{userData?.assistantName || "Assistant"}" to wake me up.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => status === 'listening' ? stopListening() : startListening()} className={`p-4 rounded-full transition-all border border-white/10 ${status === 'listening' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
                {status === 'listening' ? <MicIcon /> : <MicOffIcon />}
             </button>
          </div>
        </div>
        
       
             <div className="h-[500px] flex flex-col bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
            {messages.length === 0 && (<div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2"><div className="p-3 bg-white/5 rounded-full"><MicIcon /></div><p className="text-sm">No conversation yet.</p></div>)}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'}`}>
                  {msg.role === 'ai' ? <Typewriter text={msg.text} /> : msg.text}
                </div>
                <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleTextSubmit} className="p-4 bg-black/20 border-t border-white/5 flex gap-3">
            <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Type a command..." className="flex-1 bg-transparent border border-white/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition text-white placeholder-gray-500" />
            <button type="submit" className="p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition shadow-lg disabled:opacity-50 text-white cursor-pointer" disabled={!textInput.trim()}><SendIcon /></button>
          </form>  */}





          
        








































