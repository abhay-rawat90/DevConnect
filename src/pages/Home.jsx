import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] font-sans text-gray-300 selection:bg-green-500 selection:text-black relative flex flex-col">
      
      {/* MINIMALIST GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]"></div>
      </div>

      {/* ===== HERO SECTION ===== */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full pt-20 pb-16">
        
        {/* Status Badge */}
        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-full text-xs font-mono tracking-wide text-gray-400 shadow-lg">
          <span className={`w-2 h-2 rounded-full ${user ? "bg-green-500" : "bg-gray-500"} animate-pulse`}></span>
          {user ? `Online • ${user.username}` : "Guest • Please Log In"}
        </div>

        {/* Clean Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
          Dev<span className="text-green-500">Connect</span>
        </h1>

        {/* Simple, clear description */}
        <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl leading-relaxed">
          {user
            ? "Welcome back! You are securely logged in. Find other developers, start a conversation, or update your profile."
            : "A simple and secure platform for developers to meet, share skills, and chat in real-time. Create an account to get started."}
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center font-mono">
          {user ? (
            <>
              <Link to="/search" className="flex-1 py-3 px-6 bg-green-600 text-black font-bold uppercase tracking-wide text-sm rounded hover:bg-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                Find Devs
              </Link>
              <Link to="/chat" className="flex-1 py-3 px-6 bg-[#0a0a0a] border border-gray-700 text-gray-300 font-bold uppercase tracking-wide text-sm rounded hover:border-green-500 hover:text-green-400 transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                Open Chat
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="flex-1 py-3 px-6 bg-green-600 text-black font-bold uppercase tracking-wide text-sm rounded hover:bg-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all">
                Create Account
              </Link>
              <Link to="/login" className="flex-1 py-3 px-6 bg-[#0a0a0a] border border-gray-700 text-gray-300 font-bold uppercase tracking-wide text-sm rounded hover:border-green-500 hover:text-green-400 transition-all">
                Log In
              </Link>
            </>
          )}
        </div>
      </main>

      {/* ===== FEATURE MODULES ===== */}
      <section className="relative z-10 w-full border-t border-gray-900 bg-[#080808] py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <FeatureCard 
            title="Real-Time Chat" 
            desc="Message other developers instantly. Our chat is fast, secure, and easy to use." 
            icon={<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>}
            linkTo={user ? "/chat" : null}
          />

          <FeatureCard 
            title="Discover Developers" 
            desc="Search our global directory to find people with the skills you are looking for." 
            icon={<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>}
            linkTo={user ? "/search" : null}
          />

          <FeatureCard 
            title="Manage Profile" 
            desc="Upload a profile picture, add your skills, and let others know what you can do." 
            icon={<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
            linkTo={user ? "/profile" : null}
          />

        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="py-6 bg-[#050505] border-t border-gray-900 text-center text-xs text-gray-600 font-mono">
        © {new Date().getFullYear()} DevConnect. Built for developers.
      </footer>

    </div>
  );
};

// Helper component for sleek feature cards
const FeatureCard = ({ title, desc, icon, linkTo }) => {
  const CardWrapper = linkTo ? Link : "div";
  const wrapperProps = linkTo ? { to: linkTo } : {};

  return (
    <CardWrapper 
      {...wrapperProps} 
      className={`relative block bg-[#0a0a0a] p-8 border border-gray-800 rounded-lg transition-all duration-300 ${linkTo ? 'hover:border-green-500 hover:bg-[#0c120c] group cursor-pointer' : ''}`}
    >
      <div className="w-12 h-12 bg-black border border-gray-800 rounded flex items-center justify-center mb-5 group-hover:border-green-500/50 transition-colors">
        {icon}
      </div>
      <h3 className={`text-lg font-bold text-gray-200 mb-2 ${linkTo ? 'group-hover:text-green-400' : ''} transition-colors`}>
        {title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        {desc}
      </p>
    </CardWrapper>
  );
};

export default Home;