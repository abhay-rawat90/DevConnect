import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
  });
  const [loading, setLoading] = useState(false);

  // Update local state if user context loads slightly after component mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the context with new user data
      login(res.data.user, token); 
      toast.success("Profile updated successfully!");
      
      // UX Improvement: Automatically send them back to the profile
      setTimeout(() => navigate("/profile"), 1000);
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#050505] flex items-center justify-center font-sans text-gray-500">
          <p className="animate-pulse">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-gray-200 font-sans flex items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* MINIMALIST GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* EDIT FORM CARD */}
      <div className="w-full max-w-lg relative z-10 bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* HEADER */}
        <div className="flex flex-col p-6 md:p-8 border-b border-gray-900 bg-[#050505]">
           <h2 className="text-2xl font-bold text-white tracking-tight">
              Edit Profile
           </h2>
           <p className="text-sm text-gray-400 mt-1">
              Update your display name and system handle.
           </p>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* NAME INPUT */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full bg-[#111] border border-gray-800 text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-600"
                  placeholder="e.g. Jane Doe"
                  required
              />
            </div>

            {/* USERNAME INPUT */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <input 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  className="w-full bg-[#111] border border-gray-800 text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-600"
                  placeholder="johndoe99"
                  required
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-6 mt-4 border-t border-gray-900">
                <button 
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="flex-1 bg-transparent border border-gray-700 text-gray-300 py-3 rounded-lg text-sm font-semibold hover:bg-[#111] hover:text-white transition-all"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={loading || !formData.name.trim() || !formData.username.trim()}
                    className={`flex-[2] bg-green-600 text-black py-3 rounded-lg text-sm font-bold shadow-lg shadow-green-900/20 transition-all
                      ${loading ? "opacity-70 cursor-wait" : "hover:bg-green-500"}
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;