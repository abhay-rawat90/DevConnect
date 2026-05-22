import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  
  const { userId } = useParams();
  const { token, user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        toast.error("Failed to load user profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if(userId) {
        fetchUserProfile();
    }
  }, [userId, token]);

  const handleConnect = async () => {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/connections/send`,
            { recipientId: profile._id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Connection request sent!");
        setRequestSent(true); // UX Fix: Instantly update button state locally
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to send request.");
    }
  };

  if (loading) {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#050505] flex flex-col items-center justify-center font-sans text-gray-500">
            <div className="inline-block w-8 h-8 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin mb-4"></div>
            <p className="font-medium">Loading profile...</p>
        </div>
    );
  }

  if (!profile) {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#050505] flex flex-col items-center justify-center font-sans text-gray-500">
            <div className="w-16 h-16 bg-[#0a0a0a] border border-gray-800 rounded-full flex items-center justify-center mb-4">
               <span className="text-2xl font-bold text-gray-600">?</span>
            </div>
            <p className="text-xl font-bold text-gray-300 mb-2">Developer Not Found</p>
            <p className="text-sm">The profile you are looking for does not exist or has been removed.</p>
            <Link to="/search" className="mt-6 text-green-500 hover:text-green-400 text-sm font-semibold transition-colors">
                ← Back to Search
            </Link>
        </div>
    );
  }
  
  const isConnected = currentUser?.connections?.includes(profile._id);
  const isMe = currentUser?._id === profile._id || currentUser?.id === profile._id;

  // Helper for placeholder avatar
  const getInitials = (name = 'U') => name.charAt(0).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-gray-200 font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* MINIMALIST GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* PROFILE CARD */}
      <div className="w-full max-w-3xl relative z-10 bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-xl overflow-hidden mt-4">
        
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            
            {/* LEFT COLUMN: AVATAR & ACTIONS */}
            <div className="flex flex-col items-center w-full md:w-1/3">
                
                {/* Avatar Frame */}
                <div className="h-40 w-40 rounded-full border border-gray-700 bg-[#111] shadow-inner mb-6 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                    {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt={profile.username} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <span className="text-5xl font-bold text-gray-600">{getInitials(profile.name || profile.username)}</span>
                    )}
                </div>

                {/* Connection Action */}
                <div className="w-full">
                    {isMe ? (
                        <div className="w-full bg-[#111] border border-gray-800 text-gray-500 py-3 rounded-lg text-sm font-semibold text-center cursor-default">
                            This is you
                        </div>
                    ) : isConnected ? (
                        <div className="w-full bg-green-500/10 border border-green-500/20 text-green-500 py-3 rounded-lg text-sm font-bold text-center flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Connected
                        </div>
                    ) : requestSent ? (
                        <div className="w-full bg-gray-900 border border-gray-700 text-gray-400 py-3 rounded-lg text-sm font-semibold text-center cursor-not-allowed">
                            Request Sent
                        </div>
                    ) : (
                        <button 
                            onClick={handleConnect}
                            className="w-full bg-green-600 text-black py-3 rounded-lg text-sm font-bold shadow-lg shadow-green-900/20 hover:bg-green-500 transition-all"
                        >
                            Connect
                        </button>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: DETAILS */}
            <div className="flex-1 w-full space-y-8 text-center md:text-left">
                
                {/* Header Info */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                        {profile.name || profile.username}
                    </h1>
                    <p className="text-gray-400 font-medium">@{profile.username}</p>
                </div>

                {/* Skills Section */}
                <div className="pt-6 border-t border-gray-900">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-center md:justify-start gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                        Technical Skills
                    </h3>
                    
                    {profile.skills?.length > 0 ? (
                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {profile.skills.map((skill, idx) => (
                          <span key={idx} className="bg-[#111] text-gray-300 border border-gray-800 text-sm px-3.5 py-1.5 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-[#0a0a0a] border border-dashed border-gray-800 rounded-xl text-center md:text-left">
                          <p className="text-gray-500 text-sm">This user hasn't added any skills yet.</p>
                      </div>
                    )}
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;