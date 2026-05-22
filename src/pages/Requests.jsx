import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
      toast.error("Could not fetch connection requests.");
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
    // Optimistic UI update: Remove the request instantly for a snappy feel
    setRequests(currentRequests => currentRequests.filter(req => req._id !== requestId));
    
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/connections/accept`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Connection accepted!");
    } catch (err) {
      // Re-fetch if it fails to revert the optimistic update
      fetchRequests();
      toast.error(err.response?.data?.message || "Failed to accept request.");
    }
  };

  const handleReject = async (requestId) => {
    // Optimistic UI update
    setRequests(currentRequests => currentRequests.filter(req => req._id !== requestId));

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/connections/reject`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Request declined.");
    } catch (err) {
      fetchRequests();
      toast.error(err.response?.data?.message || "Failed to decline request.");
    }
  };

  const getInitials = (name = 'U') => name.charAt(0).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-gray-200 font-sans flex flex-col items-center p-4 sm:p-8 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* MINIMALIST GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="w-full max-w-4xl relative z-10 mt-4">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Connection Requests
                </h2>
                <p className="text-gray-400 mt-2">
                    Review and manage your pending network invitations.
                </p>
            </div>
            {requests.length > 0 && (
                <div className="flex items-center gap-2 bg-[#111] border border-gray-800 px-4 py-2 rounded-full self-start md:self-auto">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-300">{requests.length} Pending</span>
                </div>
            )}
        </div>

        {/* CONTENT */}
        {loading ? (
            <div className="text-center py-20 bg-[#0a0a0a] border border-gray-800 rounded-2xl">
                 <div className="inline-block w-8 h-8 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin mb-4"></div>
                 <p className="text-gray-400 font-medium">Checking for requests...</p>
            </div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="bg-[#0a0a0a] border border-gray-800 p-5 md:p-6 rounded-2xl shadow-lg hover:border-gray-700 transition-all flex flex-col sm:flex-row justify-between items-center gap-6">
                
                {/* USER INFO */}
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <Link to={`/profile/${req.requester._id}`} className="block flex-shrink-0">
                      <div className="h-16 w-16 rounded-full border border-gray-700 bg-[#111] flex items-center justify-center overflow-hidden">
                          {req.requester.profilePicture ? (
                              <img src={req.requester.profilePicture} alt="User" className="h-full w-full object-cover" />
                          ) : (
                              <span className="text-xl font-bold text-gray-500">{getInitials(req.requester.name || req.requester.username)}</span>
                          )}
                      </div>
                  </Link>

                  <div>
                      <Link to={`/profile/${req.requester._id}`} className="block group">
                          <h3 className="text-lg font-bold text-gray-200 group-hover:text-green-400 transition-colors">
                              {req.requester.name || req.requester.username}
                          </h3>
                          <p className="text-sm text-gray-500">@{req.requester.username}</p>
                      </Link>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex w-full sm:w-auto gap-3 pt-4 sm:pt-0 border-t border-gray-800 sm:border-none">
                  <button 
                      onClick={() => handleAccept(req._id)} 
                      className="flex-1 sm:flex-none bg-green-600 text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20"
                  >
                    Accept
                  </button>
                  
                  <button 
                      onClick={() => handleReject(req._id)} 
                      className="flex-1 sm:flex-none bg-transparent border border-gray-700 text-gray-400 px-6 py-2.5 rounded-lg text-sm font-semibold hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    Decline
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 border border-gray-800 border-dashed rounded-2xl bg-[#0a0a0a]/50">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-800">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-2">No pending requests</h3>
            <p className="text-gray-500 text-center max-w-sm">
                You're all caught up. When developers want to connect with you, their requests will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;