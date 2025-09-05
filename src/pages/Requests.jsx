// src/pages/Requests.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const { token } = useAuth();

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/connections/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch connection requests.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  const handleAccept = async (requestId) => {
    try {
      await axios.put("http://localhost:5000/api/connections/accept",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Connection accepted!");
      // Refresh the list of requests
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not accept request.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Connection Requests</h2>
      {requests.length > 0 ? (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req._id} className="border p-3 rounded-lg flex justify-between items-center bg-white shadow-sm">
              <p>
                <span className="font-bold">{req.requester.username}</span> wants to connect.
              </p>
              <div>
                <button onClick={() => handleAccept(req._id)} className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700">
                  Accept
                </button>
                {/* We will add a reject handler later */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You have no pending connection requests.</p>
      )}
    </div>
  );
};

export default Requests;