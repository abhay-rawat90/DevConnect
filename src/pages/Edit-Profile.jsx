import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/input";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
  });
  const [loading, setLoading] = useState(false);

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
      toast.success("PROFILE_UPDATE: SUCCESSFUL");
      
      // Optional: Redirect back to profile after success
      // navigate("/profile"); 
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "UPDATE_FAILED: SYSTEM_ERROR");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // or a loading spinner

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-green-500 font-mono flex items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[length:100%_4px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)]"></div>
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* EDIT FORM CARD */}
      <div className="w-full max-w-lg relative z-10 bg-[#0a0a0a] border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/50">
           <h2 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
              EDIT_PARAMS
           </h2>
           <span className="text-[10px] text-gray-600 font-bold tracking-widest">ID: {user._id.substring(0, 8)}...</span>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* NAME INPUT */}
            <div className="group">
                <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block group-focus-within:text-green-500 transition-colors">
                    {">"} Display_Name
                </label>
                <div className="relative border-b border-gray-700 focus-within:border-green-500 transition-colors">
                    <Input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full bg-transparent p-2 text-green-400 focus:outline-none font-mono placeholder-gray-700 uppercase"
                        placeholder="ENTER_NAME"
                    />
                </div>
            </div>

            {/* USERNAME INPUT */}
            <div className="group">
                <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block group-focus-within:text-green-500 transition-colors">
                    {">"} System_Handle
                </label>
                <div className="relative border-b border-gray-700 focus-within:border-green-500 transition-colors">
                    <Input 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        className="w-full bg-transparent p-2 text-green-400 focus:outline-none font-mono placeholder-gray-700 uppercase"
                        placeholder="ENTER_HANDLE"
                    />
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-4 border-t border-gray-800">
                <button 
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="flex-1 border border-gray-700 text-gray-500 py-3 text-xs font-bold uppercase tracking-widest hover:text-white hover:border-gray-500 transition-all"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] bg-green-600 text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    {loading ? "OVERWRITING..." : "[ SAVE_CHANGES ]"}
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;