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
      toast.success("Profile picture updated successfully!");
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] flex items-center justify-center font-sans text-gray-500">
        <p className="animate-pulse">Loading profile...</p>
    </div>
  );

  // Helper for placeholder initials
  const getInitials = (name = 'U') => name.charAt(0).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-gray-200 font-sans flex items-center justify-center p-4 md:p-8 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* MINIMALIST GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* PROFILE CARD */}
      <div className="w-full max-w-3xl relative z-10 bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-xl overflow-hidden mt-4">
        
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            
            {/* LEFT COLUMN: IMAGE & UPLOAD */}
            <div className="flex flex-col items-center w-full md:w-1/3">
                
                {/* Profile Picture Frame */}
                <div className="h-40 w-40 rounded-full border border-gray-700 bg-[#111] shadow-inner mb-6 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                    {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover group-hover:opacity-90 transition-opacity" />
                    ) : (
                        <span className="text-5xl font-bold text-gray-600">{getInitials(user.name || user.username)}</span>
                    )}
                </div>

                {/* Upload Control */}
                <div className="w-full">
                    <div className="flex flex-col gap-3">
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer text-center text-sm font-semibold text-gray-300 py-2.5 px-4 rounded-lg border border-gray-700 bg-[#111] hover:bg-gray-800 hover:border-gray-500 transition-all truncate block w-full"
                        >
                            {file ? file.name : "Select Image"}
                        </label>
                        
                        {file && (
                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="w-full bg-green-600 text-black text-sm font-bold py-2.5 px-4 rounded-lg hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {loading ? "Uploading..." : "Save Picture"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: DETAILS */}
            <div className="flex-1 w-full space-y-8 pt-2 text-center md:text-left">
                
                {/* User Info */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">{user.name || user.username}</h1>
                    <p className="text-gray-400 font-medium">@{user.username}</p>
                    <p className="text-sm text-gray-500 font-mono mt-3 inline-block bg-[#111] px-3 py-1.5 rounded-md border border-gray-800">
                      {user.email}
                    </p>
                </div>

                {/* Skills Block */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Technical Skills</h3>
                    {user.skills && user.skills.length > 0 ? (
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            {user.skills.map((skill, idx) => (
                                <span key={idx} className="bg-[#111] text-gray-300 border border-gray-800 text-sm px-3 py-1.5 rounded-md">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No skills added yet.</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-900">
                    <button 
                        onClick={() => navigate("/edit-profile")} 
                        className="flex-1 bg-[#111] border border-gray-700 text-gray-200 text-sm font-semibold py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all"
                    >
                        Edit Profile
                    </button>
                    <button 
                        onClick={() => navigate("/edit-skills")} 
                        className="flex-1 bg-[#111] border border-gray-700 text-gray-200 text-sm font-semibold py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all"
                    >
                        Manage Skills
                    </button>
                </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;