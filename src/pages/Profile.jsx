import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/upload-picture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      updateUser(res.data.user);
      toast.success("BIOMETRIC_UPDATE_COMPLETE");
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "UPLOAD_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-green-500">
        <p className="animate-pulse">{">"} LOADING_USER_DATA...</p>
    </div>
  );

  // Terminal Placeholder
  const placeholder = (
    <div className="h-full w-full bg-black flex flex-col items-center justify-center text-green-700 font-mono border border-green-900">
       <span className="text-4xl opacity-50">?</span>
       <span className="text-[10px] mt-2">NO_IMAGE_DATA</span>
    </div>
  );

  return (
    // MAIN CONTAINER
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-green-500 font-mono flex items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[length:100%_4px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)]"></div>
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="w-full max-w-2xl relative z-10 bg-[#0a0a0a] border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-black/50">
           <h2 className="text-sm font-bold tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500"></span>
              PERSONNEL_FILE: {user.username.toUpperCase()}
           </h2>
           <span className="text-[10px] text-gray-600 font-bold tracking-widest">CONFIDENTIAL</span>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* LEFT COLUMN: IMAGE & UPLOAD */}
            <div className="flex flex-col items-center w-full md:w-auto">
                {/* Profile Picture Frame */}
                <div className="relative h-40 w-40 border-2 border-green-500 p-1 bg-black group shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 bg-green-500"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-green-500"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-green-500"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500"></div>
                    
                    <div className="h-full w-full overflow-hidden relative">
                        {user.profilePicture ? <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /> : placeholder}
                        {/* Scanline overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_50%,rgba(0,0,0,0)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50"></div>
                    </div>
                </div>

                {/* Upload Control */}
                <div className="mt-6 w-full max-w-[160px]">
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer text-center text-[10px] uppercase tracking-widest py-2 border border-gray-700 hover:border-green-500 hover:text-green-400 hover:bg-green-900/20 transition-all truncate px-2"
                        >
                            {file ? file.name : "[ SELECT_IMAGE ]"}
                        </label>
                        
                        {file && (
                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="bg-green-600 text-black text-[10px] font-bold uppercase py-2 hover:bg-white transition-all disabled:opacity-50"
                            >
                                {loading ? "UPLOADING..." : "EXECUTE_UPLOAD"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: DETAILS */}
            <div className="flex-1 w-full">
                <div className="space-y-6">
                    {/* User Info Block */}
                    <div className="border border-gray-800 bg-black/40 p-4 relative">
                        <h3 className="absolute -top-3 left-3 bg-[#0a0a0a] px-2 text-[10px] text-gray-500 uppercase">Identity_Parameters</h3>
                        <div className="grid gap-4">
                            <div>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">System Handle</p>
                                <p className="text-xl text-white font-bold tracking-wider">{user.username}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Comm Protocol</p>
                                <p className="text-sm text-green-400 font-mono">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Skills Block */}
                    <div className="border border-gray-800 bg-black/40 p-4 relative min-h-[120px]">
                        <h3 className="absolute -top-3 left-3 bg-[#0a0a0a] px-2 text-[10px] text-gray-500 uppercase">Installed_Modules (Skills)</h3>
                        
                        {user.skills && user.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user.skills.map((skill, idx) => (
                                    <span key={idx} className="bg-green-900/20 text-green-400 border border-green-800 text-xs px-2 py-1 uppercase tracking-wide hover:bg-green-500 hover:text-black hover:border-green-500 transition-colors cursor-default">
                                        [{skill}]
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xs italic mt-2">{">"} NO_MODULES_DETECTED</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-2">
                        <button 
                            onClick={() => navigate("/edit-profile")} 
                            className="flex-1 border border-green-600 text-green-500 text-xs font-bold py-3 uppercase tracking-widest hover:bg-green-600 hover:text-black transition-all"
                        >
                            :: Edit_Params
                        </button>
                        <button 
                            onClick={() => navigate("/edit-skills")} 
                            className="flex-1 border border-gray-600 text-gray-400 text-xs font-bold py-3 uppercase tracking-widest hover:border-green-500 hover:text-green-500 transition-all"
                        >
                            :: Config_Modules
                        </button>
                    </div>

                </div>
            </div>

          </div>
        </div>

        {/* FOOTER DECORATION */}
        <div className="border-t border-gray-800 bg-black/50 p-2 flex justify-end">
            <div className="flex gap-1">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;