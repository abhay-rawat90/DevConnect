import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/connections/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("SIGNAL_INTERRUPTED: Could not fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  const handleAccept = async (requestId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/connections/accept`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("LINK_ESTABLISHED");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "HANDSHAKE_FAILED");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/connections/reject`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("SIGNAL_BLOCKED");
      fetchRequests(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "OP_FAILED");
    }
  };

  // Helper for placeholder avatar
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

      <div className="w-full max-w-3xl relative z-10">
        
        {/* HEADER */}
        <div className="mb-8 border-b border-gray-800 pb-4 flex items-center justify-between">
            <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tighter text-white">
                    INCOMING_<span className="text-green-500">TRANSMISSIONS</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
                    :: PENDING_HANDSHAKES: <span className="text-white">{requests.length}</span>
                </p>
            </div>
            {/* Blinking Status Light */}
            <div className={`w-3 h-3 rounded-full ${requests.length > 0 ? 'bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-gray-800'}`}></div>
        </div>

        {/* CONTENT */}
        {loading ? (
            <div className="text-center py-20 opacity-50">
                <p className="animate-pulse">{">"} SCANNING_FREQUENCIES...</p>
            </div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm shadow-lg hover:border-green-500/50 transition-all duration-300 group relative overflow-hidden">
                
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-green-900/10 -mr-4 -mt-4 rotate-45 border border-green-900"></div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                  
                  {/* USER INFO */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Avatar */}
                    <div className="h-14 w-14 border border-green-500/50 p-1 bg-black flex-shrink-0">
                        <div className="h-full w-full bg-gray-900 flex items-center justify-center font-bold text-lg text-gray-500 overflow-hidden">
                             {req.requester.profilePicture ? (
                                <img src={req.requester.profilePicture} alt="User" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                             ) : (
                                getInitials(req.requester.username)
                             )}
                        </div>
                    </div>

                    {/* Text Details */}
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Source ID</p>
                        <h3 className="text-lg font-bold text-white tracking-wide uppercase group-hover:text-green-400 transition-colors">
                            {req.requester.username}
                        </h3>
                        <p className="text-[10px] text-green-600 font-mono mt-1">
                            {">"} REQUESTING_ACCESS_PERMISSION
                        </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex w-full sm:w-auto gap-3">
                    <button 
                        onClick={() => handleAccept(req._id)} 
                        className="flex-1 sm:flex-none bg-green-900/20 border border-green-600 text-green-500 hover:bg-green-500 hover:text-black px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    >
                      [ ESTABLISH_LINK ]
                    </button>
                    
                    <button 
                        onClick={() => handleReject(req._id)} 
                        className="flex-1 sm:flex-none border border-red-900 text-red-700 hover:border-red-500 hover:text-red-500 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      [ BLOCK ]
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 border border-gray-800 border-dashed bg-[#0a0a0a]/50">
            <div className="relative mb-4">
                <div className="w-16 h-16 border-2 border-gray-700 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                </div>
                {/* Radar Sweep Animation */}
                <div className="absolute inset-0 border-t-2 border-green-500 rounded-full animate-spin opacity-50"></div>
            </div>
            <p className="text-gray-500 text-sm tracking-widest font-bold">NO_INCOMING_SIGNALS</p>
            <p className="text-gray-700 text-xs mt-2 uppercase">System Idle. Waiting for packets.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;