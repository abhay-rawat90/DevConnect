import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] font-sans text-gray-200 flex flex-col p-4 md:p-8 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* MINIMALIST GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="w-full max-w-5xl mx-auto relative z-10 space-y-8 mt-4">
        
        {/* === SECTION 1: USER PROFILE OVERVIEW === */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-center justify-between">
                
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    {/* Avatar */}
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-gray-700 bg-black overflow-hidden flex-shrink-0 shadow-inner">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-600 bg-[#111]">
                                {user?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}
                    </div>

                    {/* Data Fields */}
                    <div className="space-y-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            {user?.name || "Welcome back"}
                        </h2>
                        <p className="text-gray-400 font-medium">
                            @{user?.username || "user"}
                        </p>
                        <p className="text-sm text-gray-500 font-mono mt-2 bg-[#111] inline-block px-3 py-1 rounded border border-gray-800">
                            {user?.email || "No email provided"}
                        </p>
                    </div>
                </div>

                {/* Logout Action */}
                <div className="w-full md:w-auto pt-4 md:pt-0 border-t border-gray-800 md:border-none mt-4 md:mt-0">
                    <button 
                        onClick={handleLogout} 
                        className="w-full md:w-auto px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all font-medium text-sm"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>

        {/* === SECTION 2: ACTIVE CONNECTIONS === */}
        <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white tracking-tight">
                    Your Connections
                </h3>
                <span className="bg-gray-800 text-gray-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {connections.length}
                </span>
            </div>

            {loading ? (
                 <div className="py-12 text-center border border-gray-800 rounded-xl bg-[#0a0a0a]">
                     <p className="text-gray-500 animate-pulse text-sm">Loading network data...</p>
                 </div>
            ) : connections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {connections.map((conn) => (
                        <div key={conn._id} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-5 hover:border-green-500/50 hover:shadow-[0_4px_20px_rgba(34,197,94,0.05)] transition-all flex items-center justify-between group">
                             
                             <div className="flex items-center gap-4 overflow-hidden">
                                <div className="h-12 w-12 rounded-full bg-[#111] border border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {conn.profilePicture ? (
                                        <img src={conn.profilePicture} className="h-full w-full object-cover group-hover:scale-105 transition-transform" alt={conn.username} />
                                    ) : (
                                        <span className="text-gray-500 font-bold text-lg">{conn.username.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-semibold text-gray-200 truncate group-hover:text-green-400 transition-colors">
                                        {conn.username}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate font-mono mt-0.5">
                                        {conn.email}
                                    </p>
                                </div>
                             </div>
                             
                             <Link 
                                to={`/profile/${conn._id}`}
                                className="opacity-0 group-hover:opacity-100 flex-shrink-0 ml-4 px-3 py-1.5 bg-green-500/10 text-green-500 text-xs font-semibold rounded hover:bg-green-500/20 transition-all"
                             >
                                View
                             </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border border-dashed border-gray-800 rounded-xl p-12 text-center bg-[#0a0a0a]">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </div>
                    <h4 className="text-gray-300 font-medium mb-1">No connections yet</h4>
                    <p className="text-gray-500 text-sm">Head over to the search page to find other developers.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;