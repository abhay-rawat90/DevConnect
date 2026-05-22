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
    
    // Track which users we've already sent requests to during this session
    const [sentRequests, setSentRequests] = useState(new Set());
    
    const { token, user } = useAuth(); 

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        
        if (!skill.trim()) {
            toast.error("Please enter a skill to search.");
            return;
        }
        
        setHasSearched(false);
        setLoading(true);

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/search?skill=${skill}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const data = res.data; 

            // Filter out current user & already connected users
            const currentUserId = user?._id || user?.id;
            const filteredResults = data.filter(foundUser => {
                const isMe = foundUser._id === currentUserId;
                const isAlreadyConnected = user?.connections && user.connections.includes(foundUser._id);
                return !isMe && !isAlreadyConnected;
            });
            
            setResults(filteredResults);
            setHasSearched(true); 
        } catch (err) {
            console.log(err);
            toast.error("Failed to search. Please try again later.");
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
            
            toast.success("Connection request sent!");
            
            // Mark as sent in local state so UI updates immediately
            setSentRequests(prev => new Set(prev).add(recipientId));
            
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send request.");
        }
    };

    const getInitials = (name = 'U') => name.charAt(0).toUpperCase();

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-gray-200 font-sans flex flex-col items-center p-4 sm:p-8 relative overflow-hidden selection:bg-green-500 selection:text-black">
            
            {/* MINIMALIST GRID BACKGROUND */}
            <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

            <div className="w-full max-w-4xl relative z-10 mt-4">
                
                {/* HEADER */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Find Developers
                    </h2>
                    <p className="text-gray-400 mt-3 max-w-lg mx-auto">
                        Search the global network to find collaborators, mentors, or peers based on their technical skills.
                    </p>
                </div>

                {/* SEARCH INPUT AREA */}
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 shadow-xl mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-grow relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by skill (e.g. React, Python, Node.js)"
                                value={skill}
                                onChange={(e) => setSkill(e.target.value)}
                                className="w-full bg-[#111] border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-500"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`
                                sm:w-auto w-full bg-green-600 text-black px-8 py-3.5 rounded-xl font-bold hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20 whitespace-nowrap
                                ${loading ? "opacity-70 cursor-wait" : ""}
                            `}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </form>
                </div>

                {/* RESULTS AREA */}
                <div className="space-y-4">
                    {loading ? (
                         <div className="text-center py-16 bg-[#0a0a0a] border border-gray-800 rounded-2xl">
                             <div className="inline-block w-8 h-8 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin mb-4"></div>
                             <p className="text-gray-400 font-medium">Searching network...</p>
                         </div>
                    ) : hasSearched && results.length === 0 ? (
                        <div className="text-center py-16 bg-[#0a0a0a] border border-gray-800 rounded-2xl">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-200 mb-1">No developers found</h3>
                            <p className="text-gray-500">We couldn't find anyone matching the skill "{skill}".</p>
                        </div>
                    ) : !hasSearched ? (
                         // Initial State
                         <div className="text-center py-12 text-gray-600 border border-gray-800 border-dashed rounded-2xl bg-[#0a0a0a]/50">
                             Type a technology or framework above to begin your search.
                         </div>
                    ) : (
                        results.map((foundUser) => {
                            const isRequestSent = sentRequests.has(foundUser._id);

                            return (
                                <div key={foundUser._id} className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 hover:shadow-[0_4px_20px_rgba(34,197,94,0.05)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                                    
                                    <div className="flex items-center gap-5">
                                        <Link to={`/profile/${foundUser._id}`} className="block flex-shrink-0">
                                            <div className="h-16 w-16 rounded-full border border-gray-700 bg-[#111] flex items-center justify-center overflow-hidden">
                                                {foundUser.profilePicture ? (
                                                    <img src={foundUser.profilePicture} alt={foundUser.username} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-xl font-bold text-gray-500">{getInitials(foundUser.name || foundUser.username)}</span>
                                                )}
                                            </div>
                                        </Link>

                                        <div>
                                            <Link to={`/profile/${foundUser._id}`} className="block mb-1">
                                                <h4 className="text-lg font-bold text-gray-200 group-hover:text-green-400 transition-colors">
                                                    {foundUser.name || foundUser.username}
                                                </h4>
                                                <p className="text-sm text-gray-500">@{foundUser.username}</p>
                                            </Link>
                                            
                                            {/* Skills Pills */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {foundUser.skills && foundUser.skills.length > 0 ? foundUser.skills.map((s, i) => (
                                                    <span key={i} className="text-xs bg-[#111] text-gray-400 px-2.5 py-1 rounded-md border border-gray-800">
                                                        {s}
                                                    </span>
                                                )) : (
                                                    <span className="text-xs text-gray-600">No skills listed</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center sm:justify-end shrink-0 pt-2 sm:pt-0 border-t border-gray-800 sm:border-none">
                                        <button 
                                            onClick={() => handleConnect(foundUser._id)} 
                                            disabled={isRequestSent}
                                            className={`
                                                w-full sm:w-auto px-5 py-2 rounded-lg text-sm font-semibold transition-all
                                                ${isRequestSent 
                                                    ? "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700" 
                                                    : "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-black"}
                                            `}
                                        >
                                            {isRequestSent ? "Request Sent" : "Connect"}
                                        </button>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchUsers;