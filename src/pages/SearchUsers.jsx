import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';

const SearchUsers = () => {
    const [skill, setSkill] = useState("");
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const { token, user } = useAuth(); 

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        
        if (!skill.trim()) {
            toast.error("INPUT_ERROR: FIELD_EMPTY");
            return;
        }
        
        setHasSearched(false);
        setLoading(true);

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/search?skill=${skill}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const data = res.data; 

            // --- UPDATED FILTER LOGIC ---
            // 1. Filter out current user
            // 2. Filter out users who are already in the connections list
            const currentUserId = user._id || user.id;
            const filteredResults = data.filter(foundUser => {
                const isMe = foundUser._id === currentUserId;
                const isAlreadyConnected = user.connections && user.connections.includes(foundUser._id);
                return !isMe && !isAlreadyConnected;
            });
            // ----------------------------
            
            setResults(filteredResults);
            setHasSearched(true); 
        } catch (err) {
            console.log(err);
            toast.error("SYSTEM_ERROR: SEARCH_FAILED");
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (recipientId) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/connections/send`,
                { recipientId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("SIGNAL_SENT: HANDSHAKE_INITIATED");
        } catch (err) {
            toast.error(err.response?.data?.message || "TRANSMISSION_FAILED");
        }
    };

    const getInitials = (name = 'U') => name.charAt(0).toUpperCase();

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-green-500 font-mono flex flex-col items-center p-4 sm:p-8 relative overflow-hidden selection:bg-green-500 selection:text-black">
            
            {/* BACKGROUND EFFECTS */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[length:100%_4px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)]"></div>
                <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
            </div>

            <div className="w-full max-w-4xl relative z-10">
                
                {/* HEADER */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-black tracking-tighter text-white uppercase relative inline-block">
                        GLOBAL_<span className="text-green-500">DATABASE</span>
                        <span className="absolute -top-4 -right-6 text-xs text-gray-500 font-mono tracking-widest animate-pulse">[ ONLINE ]</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-2 uppercase tracking-[0.2em]">
                        :: QUERY USER NODES BY SKILL_SET ::
                    </p>
                </div>

                {/* SEARCH INPUT AREA */}
                <div className="bg-[#0a0a0a] border border-gray-800 p-6 shadow-lg mb-8 relative">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-green-500"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500"></div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-grow relative group">
                            <span className="absolute left-3 top-3 text-green-500 font-bold">{">"}</span>
                            <input
                                type="text"
                                placeholder="ENTER_SKILL_PARAMETER (e.g. React)"
                                value={skill}
                                onChange={(e) => setSkill(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full bg-black border border-gray-700 p-3 pl-8 text-green-400 focus:outline-none focus:border-green-500 transition-all font-mono placeholder-gray-700 uppercase"
                            />
                        </div>
                        <button 
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-green-900/20 border border-green-600 text-green-500 hover:bg-green-500 hover:text-black px-8 py-3 font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "SEARCHING..." : ":: EXECUTE"}
                        </button>
                    </div>
                </div>

                {/* RESULTS AREA */}
                <div className="space-y-4">
                    {loading ? (
                         <div className="text-center py-12">
                             <div className="inline-block w-16 h-1 bg-green-900/50 overflow-hidden">
                                 <div className="h-full bg-green-500 animate-progress"></div>
                             </div>
                             <p className="text-xs text-green-500 mt-2 animate-pulse">QUERYING_MAINFRAME...</p>
                         </div>
                    ) : hasSearched && results.length === 0 ? (
                        <div className="text-center py-12 border border-gray-800 border-dashed bg-black/50">
                            <p className="text-red-500 font-bold tracking-widest text-lg">ERROR: NULL_RETURN</p>
                            <p className="text-gray-600 text-xs mt-2 uppercase">No new nodes found with parameter "{skill}".</p>
                        </div>
                    ) : (
                        results.map((foundUser) => (
                            <div key={foundUser._id} className="group bg-[#0a0a0a] border border-gray-800 p-4 hover:border-green-500 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                                
                                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                <div className="flex items-center gap-4 relative z-10">
                                    <Link to={`/profile/${foundUser._id}`} className="block relative">
                                        <div className="h-16 w-16 border border-gray-600 group-hover:border-green-500 bg-black flex items-center justify-center overflow-hidden transition-colors">
                                            {foundUser.profilePicture ? (
                                                <img src={foundUser.profilePicture} alt={foundUser.username} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                            ) : (
                                                <span className="text-2xl font-bold text-gray-600">{getInitials(foundUser.username)}</span>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 border border-black"></div>
                                    </Link>

                                    <div>
                                        <Link to={`/profile/${foundUser._id}`} className="block">
                                            <h4 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors uppercase tracking-wide">
                                                {foundUser.username}
                                            </h4>
                                        </Link>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {foundUser.skills && foundUser.skills.length > 0 ? foundUser.skills.map((s, i) => (
                                                <span key={i} className="text-[10px] bg-gray-900 text-gray-400 px-2 py-1 border border-gray-800 uppercase">
                                                    {s}
                                                </span>
                                            )) : (
                                                <span className="text-[10px] text-gray-600 italic">NO_MODULES</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 relative z-10">
                                    <button 
                                        onClick={() => handleConnect(foundUser._id)} 
                                        className="bg-black border border-green-700 text-green-600 hover:bg-green-600 hover:text-black px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                                    >
                                        [ INIT_LINK ]
                                    </button>
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchUsers;