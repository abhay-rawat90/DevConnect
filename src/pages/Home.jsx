import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth(); // Access auth state
  const [text, setText] = useState("");
  const [randomHex, setRandomHex] = useState([]);

  // Dynamic Typewriter Text based on Auth State
  const fullText = user 
    ? `WELCOME BACK, OPERATOR ${user.username?.toUpperCase() || "USER"}... SYSTEM READY.`
    : "INITIALIZING DEV_CONNECT PROTOCOL... CONNECTING GLOBAL NODES...";

  // Reset and restart typewriter when auth state changes
  useEffect(() => {
    setText("");
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [fullText]);

  // "Matrix" background effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRandomHex(Array.from({ length: 20 }, () => 
        Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padEnd(6, '0')
      ));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-green-500 font-mono relative overflow-hidden selection:bg-green-500 selection:text-black flex flex-col">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[length:100%_4px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)]"></div>
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
        </div>
      </div>

      {/* ===== HERO SECTION ===== */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 text-center">
        
        {/* Animated Status Bar */}
        <div className="mb-8 p-2 border border-green-900 bg-black/50 text-xs md:text-sm tracking-widest text-gray-500 uppercase flex gap-4">
           <span className="text-green-500 animate-pulse">● {user ? "CONNECTED" : "LIVE"}</span>
           <span>CPU: {Math.floor(Math.random() * 30 + 10)}%</span>
           <span>MEM: 64TB</span>
           <span className="hidden sm:inline">UPTIME: 99.999%</span>
        </div>

        {/* GLITCH TITLE */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 relative inline-block group">
          <span className="absolute -inset-1 bg-green-500 blur opacity-20 group-hover:opacity-40 transition-opacity"></span>
          DEV<span className="text-green-500 relative z-10">_CONNECT</span>
        </h1>

        {/* TYPEWRITER SUBTEXT */}
        <div className="h-16 md:h-12 mb-10 max-w-3xl flex items-center justify-center">
          <p className="text-sm md:text-lg text-green-400 font-bold bg-black/80 px-2 inline-block shadow-[0_0_10px_rgba(34,197,94,0.2)]">
            {">"} {text}<span className="animate-pulse">_</span>
          </p>
        </div>

        {/* ACTION BUTTONS - CONDITIONAL RENDERING */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl justify-center">
          
          {user ? (
            /* LOGGED IN VIEW */
            <>
              <Link to="/search" className="flex-1 py-4 bg-green-600 text-black font-bold text-lg md:text-xl uppercase hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(34,197,94,0.5)] flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                :: SEARCH_DATABASE
              </Link>
              <Link to="/chat" className="flex-1 py-4 border-2 border-green-500 text-green-500 font-bold text-lg md:text-xl uppercase hover:bg-green-500 hover:text-black hover:scale-105 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                :: OPEN_UPLINK
              </Link>
            </>
          ) : (
            /* LOGGED OUT VIEW */
            <>
              <Link to="/login" className="flex-1 py-4 bg-green-600 text-black font-bold text-lg md:text-xl uppercase hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                :: Initialize_Login
              </Link>
              <Link to="/register" className="flex-1 py-4 border-2 border-green-500 text-green-500 font-bold text-lg md:text-xl uppercase hover:bg-green-500 hover:text-black hover:scale-105 transition-all">
                :: Register_Node
              </Link>
            </>
          )}

        </div>
      </main>

      {/* ===== FEATURE MODULES (Visuals) ===== */}
      <section className="relative z-10 p-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto w-full opacity-80">
        
        {/* Module cards are now wrapped in Links if user is logged in, otherwise just divs */}
        {user ? (
           <Link to="/chat" className="block border border-gray-800 bg-[#0a0a0a]/90 p-6 hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all group relative overflow-hidden">
             <ModuleContent title="MODULE: CHAT_LINK" desc="SECURE ENCRYPTED CHANNEL ACTIVE. CLICK TO TRANSMIT." icon="chat" />
           </Link>
        ) : (
           <div className="border border-gray-800 bg-[#0a0a0a]/90 p-6 transition-colors group relative overflow-hidden">
             <ModuleContent title="MODULE: CHAT_LINK" desc="ESTABLISH REAL-TIME COMMUNICATION. LOGIN REQUIRED." icon="chat" />
           </div>
        )}

        {user ? (
            <Link to="/search" className="block border border-gray-800 bg-[#0a0a0a]/90 p-6 hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all group relative overflow-hidden">
                <ModuleContent title="MODULE: SEARCH_DB" desc="ACCESS GLOBAL USER DIRECTORY. QUERY PERMISSIONS GRANTED." icon="search" />
            </Link>
        ) : (
            <div className="border border-gray-800 bg-[#0a0a0a]/90 p-6 transition-colors group relative overflow-hidden">
                <ModuleContent title="MODULE: SEARCH_DB" desc="QUERY GLOBAL USER DIRECTORY. LOGIN REQUIRED." icon="search" />
            </div>
        )}

        {/* LOGS MODULE (Always visual) */}
        <div className="border border-gray-800 bg-[#0a0a0a]/90 p-6 relative overflow-hidden hidden md:block">
           <div className="absolute inset-0 opacity-20 pointer-events-none p-4 font-mono text-[10px] leading-3 text-green-700 break-all">
              {randomHex.join(' ')} {randomHex.join(' ')} {randomHex.join(' ')}
           </div>
           <h3 className="text-xl font-bold text-white mb-2 relative z-10">SYSTEM_LOGS</h3>
           <ul className="text-xs text-gray-500 space-y-1 relative z-10">
              <li>{">"} TRAFFIC: {user ? "HIGH" : "NORMAL"}</li>
              <li>{">"} AUTH_STATE: {user ? "VERIFIED" : "GUEST"}</li>
              <li>{">"} ENCRYPTION: 256-BIT</li>
              <li className="text-green-500 animate-pulse">{">"} {user ? "DATA STREAM ACTIVE" : "WAITING FOR INPUT..."}</li>
           </ul>
        </div>

      </section>

      <footer className="border-t border-green-900/30 bg-black py-2 text-center text-[10px] text-gray-600 uppercase tracking-[0.2em]">
        © 2025 DEV_CONNECT SYSTEMS CORP // ALL RIGHTS RESERVED
      </footer>

    </div>
  );
};

// Helper component to keep code clean
const ModuleContent = ({ title, desc, icon }) => (
    <>
        <div className="absolute top-0 right-0 p-2 opacity-30 group-hover:opacity-100 transition-opacity">
            {icon === 'chat' && <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>}
            {icon === 'search' && <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
        <div className="mt-4 h-1 w-full bg-gray-800">
            <div className="h-full bg-green-500 w-[0%] group-hover:w-[100%] transition-all duration-700"></div>
        </div>
    </>
);

export default Home;