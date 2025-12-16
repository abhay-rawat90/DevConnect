import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Helper to generate a mock "Session ID" based on time
  const sessionID = `SESS_${new Date().getTime().toString(16).toUpperCase()}`;

  const handleLogout = () => {
    logout();
    navigate("/login"); // Ensure redirection happens
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-green-500 font-mono flex items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[length:100%_4px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)]"></div>
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* DASHBOARD CARD */}
      <div className="w-full max-w-2xl relative z-10 bg-[#0a0a0a] border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/50">
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 animate-pulse"></span>
              <h2 className="text-lg font-bold tracking-widest uppercase">IDENTITY_CORE</h2>
           </div>
           <span className="text-xs text-gray-600 font-bold tracking-widest">{sessionID}</span>
        </div>

        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
          
          {/* LEFT: AVATAR / VISUAL */}
          <div className="flex flex-col items-center gap-4">
             <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-green-500 p-1 relative group">
                {/* Decorative Corners for Avatar */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-green-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-green-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-green-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500"></div>

                <div className="w-full h-full bg-gray-900 overflow-hidden relative">
                   {user?.profilePicture ? (
                       <img src={user.profilePicture} alt="User" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                   ) : (
                       <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-700 bg-black">
                           {user?.name?.charAt(0).toUpperCase() || "?"}
                       </div>
                   )}
                   {/* Scanline over image */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                </div>
             </div>
             <div className="text-center">
                 <p className="text-xs text-gray-500 uppercase tracking-widest">Access Level</p>
                 <p className="text-green-500 font-bold border border-green-900 bg-green-900/10 px-2 py-1 mt-1 text-sm">
                    LEVEL_1_USER
                 </p>
             </div>
          </div>

          {/* RIGHT: DATA FIELDS */}
          <div className="flex-1 w-full space-y-6">
             
             <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Display Name</label>
                <div className="w-full bg-black border-b border-gray-700 p-2 text-lg text-white font-bold tracking-wide flex items-center gap-2">
                    <span className="text-green-600">{">"}</span> {user?.name || "UNKNOWN_ENTITY"}
                </div>
             </div>

             <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Primary Communication (Email)</label>
                <div className="w-full bg-black border-b border-gray-700 p-2 text-lg text-gray-300 font-medium tracking-wide flex items-center gap-2">
                    <span className="text-green-600">{">"}</span> {user?.email || "NO_DATA"}
                </div>
             </div>

             {user?.username && (
                 <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">System Handle</label>
                    <div className="w-full bg-black border-b border-gray-700 p-2 text-lg text-gray-300 font-medium tracking-wide flex items-center gap-2">
                        <span className="text-green-600">{">"}</span> @{user.username}
                    </div>
                 </div>
             )}

             {/* ACTIONS */}
             <div className="pt-6 border-t border-gray-800 mt-6">
                <button 
                  onClick={handleLogout} 
                  className="w-full md:w-auto px-8 py-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 font-bold uppercase tracking-widest text-sm shadow-[0_0_10px_rgba(220,38,38,0.1)] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                >
                   [ TERMINATE_SESSION ]
                </button>
             </div>

          </div>
        </div>

        {/* DECORATIVE FOOTER */}
        <div className="bg-black/80 border-t border-gray-800 p-2 flex justify-between text-[10px] text-gray-600 uppercase font-mono">
            <span>STATUS: CONNECTED</span>
            <span>ENCRYPTION: ACTIVE</span>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;