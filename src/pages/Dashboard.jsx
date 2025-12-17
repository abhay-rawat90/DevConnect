import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to generate a mock "Session ID" based on time
  const sessionID = `SESS_${new Date().getTime().toString(16).toUpperCase()}`;

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/connections`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setConnections(res.data);
      } catch (err) {
        console.error("Failed to fetch connections", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchConnections();
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-green-500 font-mono flex flex-col items-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[length:100%_4px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)]"></div>
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      <div className="w-full max-w-4xl relative z-10 space-y-8">
        
        {/* === SECTION 1: IDENTITY CORE === */}
        <div className="bg-[#0a0a0a] border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/50">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 animate-pulse"></span>
                    <h2 className="text-lg font-bold tracking-widest uppercase">IDENTITY_CORE</h2>
                </div>
                <span className="text-xs text-gray-600 font-bold tracking-widest">{sessionID}</span>
            </div>

            <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-green-500 p-1 relative group">
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
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                        </div>
                    </div>
                </div>

                {/* Data Fields */}
                <div className="flex-1 w-full space-y-6">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Display Name</label>
                        <div className="w-full bg-black border-b border-gray-700 p-2 text-lg text-white font-bold tracking-wide flex items-center gap-2">
                            <span className="text-green-600">{">"}</span> {user?.name || "UNKNOWN_ENTITY"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Primary Communication</label>
                        <div className="w-full bg-black border-b border-gray-700 p-2 text-lg text-gray-300 font-medium tracking-wide flex items-center gap-2">
                            <span className="text-green-600">{">"}</span> {user?.email || "NO_DATA"}
                        </div>
                    </div>
                    <div className="pt-4">
                        <button 
                            onClick={handleLogout} 
                            className="w-full md:w-auto px-8 py-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all font-bold uppercase tracking-widest text-xs"
                        >
                            [ TERMINATE_SESSION ]
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* === SECTION 2: ACTIVE CONNECTIONS === */}
        <div className="space-y-4">
            <h2 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500"></span>
                ACTIVE_CONNECTIONS ({connections.length})
            </h2>

            {loading ? (
                 <p className="text-gray-500 animate-pulse">{">"} FETCHING_NETWORK_DATA...</p>
            ) : connections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {connections.map((conn) => (
                        <div key={conn._id} className="bg-[#0a0a0a] border border-gray-800 p-4 hover:border-green-500 transition-all group relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-green-900 group-hover:border-green-500 transition-colors"></div>
                             
                             <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 bg-black border border-gray-700 flex items-center justify-center overflow-hidden">
                                    {conn.profilePicture ? (
                                        <img src={conn.profilePicture} className="h-full w-full object-cover grayscale group-hover:grayscale-0" />
                                    ) : (
                                        <span className="text-gray-600 font-bold">{conn.username.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-white truncate">{conn.username}</h3>
                                    <p className="text-[10px] text-gray-500 uppercase">{conn.email}</p>
                                </div>
                             </div>
                             
                             <Link 
                                to={`/profile/${conn._id}`}
                                className="block w-full text-center bg-gray-900 border border-gray-700 text-gray-400 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 hover:text-black hover:border-green-600 transition-all"
                             >
                                [ VIEW_PROFILE ]
                             </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border border-dashed border-gray-800 p-8 text-center text-gray-600">
                    <p>{">"} NO_ACTIVE_LINKS_DETECTED</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;