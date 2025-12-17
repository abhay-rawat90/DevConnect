import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
        toast.error("SYSTEM_ERROR: PROFILE_FETCH_FAILED");
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
        toast.success("SIGNAL_SENT: HANDSHAKE_INITIATED");
    } catch (err) {
        toast.error(err.response?.data?.message || "TRANSMISSION_FAILED");
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-green-500">
            <div className="text-center">
                <div className="inline-block w-16 h-1 bg-green-900/50 mb-2 overflow-hidden">
                    <div className="h-full bg-green-500 animate-progress"></div>
                </div>
                <p className="animate-pulse">{">"} ACCESSING_ARCHIVES...</p>
            </div>
        </div>
    );
  }

  if (!profile) {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-red-500">
            <p className="border border-red-500 p-4">{">"} ERROR_404: ENTITY_NOT_FOUND</p>
        </div>
    );
  }
  
  const isConnected = currentUser?.connections?.includes(profile._id);

  // Helper for placeholder avatar
  const getInitials = (name = 'U') => name.charAt(0).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-green-500 font-mono flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[length:100%_4px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)]"></div>
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="w-full max-w-3xl relative z-10 bg-[#0a0a0a] border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT COLUMN: VISUAL ID */}
        <div className="w-full md:w-1/3 bg-black/50 border-b md:border-b-0 md:border-r border-gray-800 p-8 flex flex-col items-center justify-center text-center relative group">
            
            {/* Avatar Frame */}
            <div className="relative h-40 w-40 border-2 border-green-500 p-1 bg-black mb-6 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all">
                <div className="absolute top-0 left-0 w-2 h-2 bg-green-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-green-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-green-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500"></div>

                <div className="h-full w-full overflow-hidden relative">
                    {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="Profile" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    ) : (
                        <div className="h-full w-full bg-gray-900 flex items-center justify-center text-4xl font-bold text-gray-700">
                            {getInitials(profile.username)}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_50%,rgba(0,0,0,0)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50"></div>
                </div>
            </div>

            <h1 className="text-2xl font-black text-white uppercase tracking-wider break-all">{profile.username}</h1>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest border border-gray-800 px-3 py-1">
                Clearance: Level {profile.level || "0"}
            </p>

            <div className="mt-8 w-full space-y-3">
                {!isConnected ? (
                    <button 
                        onClick={handleConnect}
                        className="w-full bg-green-900/20 border border-green-600 text-green-500 hover:bg-green-500 hover:text-black py-3 text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    >
                        [ INIT_LINK ]
                    </button>
                ) : (
                    <div className="w-full border border-gray-800 text-gray-500 py-3 text-xs font-bold uppercase tracking-widest bg-black/50 cursor-not-allowed">
                        [ LINK_ESTABLISHED ]
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: DATA READOUT */}
        <div className="w-full md:w-2/3 p-8 flex flex-col justify-between">
            
            <div className="space-y-8">
                {/* Section: Combat Stats */}
                <div>
                    <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500"></span>
                        Combat_Record (Quiz_Stats)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0f0f0f] border border-gray-800 p-4 text-center group hover:border-green-500/50 transition-colors">
                            <p className="text-3xl font-bold text-green-500 mb-1">{profile.quizStats?.wins || 0}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Victories</p>
                        </div>
                        <div className="bg-[#0f0f0f] border border-gray-800 p-4 text-center group hover:border-red-500/50 transition-colors">
                            <p className="text-3xl font-bold text-red-500 mb-1">{profile.quizStats?.losses || 0}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Defeats</p>
                        </div>
                    </div>
                </div>

                {/* Section: Skills */}
                <div>
                     <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500"></span>
                        Augmentations (Skills)
                    </h3>
                    {profile.skills?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, idx) => (
                          <span key={idx} className="bg-blue-900/10 text-blue-400 border border-blue-900/50 text-xs px-3 py-1 uppercase tracking-wide hover:bg-blue-500 hover:text-black hover:border-blue-500 transition-colors cursor-default">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 border border-dashed border-gray-800 text-center">
                          <p className="text-gray-600 text-xs italic">{">"} NO_MODULES_DETECTED</p>
                      </div>
                    )}
                </div>
            </div>

            {/* Footer / Meta Data */}
            <div className="mt-8 pt-4 border-t border-gray-800 flex justify-between text-[10px] text-gray-600 font-mono">
                <span>ID: {profile._id}</span>
                <span className="animate-pulse">STATUS: ONLINE</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;