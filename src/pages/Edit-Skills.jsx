import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditSkills = () => {
  const { token, user, fetchUserData } = useAuth();
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addSkill = (e) => {
    if (e) e.preventDefault();
    const formattedSkill = newSkill.trim();
    
    if (formattedSkill && !skills.includes(formattedSkill)) {
      setSkills([...skills, formattedSkill]);
      setNewSkill("");
    } else if (skills.includes(formattedSkill)) {
      toast.error("Skill already added.");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const saveSkills = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/skills`,
        { skills },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserData(); // Refresh global user context
      toast.success("Skills updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-gray-200 font-sans flex items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* MINIMALIST GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* CONFIG PANEL */}
      <div className="w-full max-w-lg relative z-10 bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* HEADER */}
        <div className="flex flex-col p-6 md:p-8 border-b border-gray-900 bg-[#050505]">
           <h2 className="text-2xl font-bold text-white tracking-tight">
              Manage Skills
           </h2>
           <p className="text-sm text-gray-400 mt-1">
              Add or remove technical skills from your developer profile.
           </p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* INPUT SECTION */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Add a Skill
            </label>
            <form onSubmit={addSkill} className="flex items-center gap-2">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. React, Node.js, Python"
                    className="flex-1 bg-[#111] border border-gray-800 text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-600"
                />
                <button 
                    type="submit"
                    disabled={!newSkill.trim()}
                    className="bg-[#111] border border-gray-700 text-gray-300 hover:bg-green-600 hover:text-black hover:border-green-600 px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add
                </button>
            </form>
          </div>

          {/* ACTIVE SKILLS DISPLAY */}
          <div>
             <div className="flex items-center justify-between mb-3">
                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Your Skills
                 </label>
                 <span className="text-xs text-gray-500 bg-[#111] px-2 py-0.5 rounded border border-gray-800">
                    {skills.length} added
                 </span>
             </div>
             
             <div className="bg-[#050505] border border-gray-800 rounded-xl p-4 min-h-[120px]">
                <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                        skills.map((skill) => (
                        <span
                            key={skill}
                            className="group flex items-center gap-2 bg-[#111] border border-gray-700 text-gray-300 text-sm px-3 py-1.5 rounded-md transition-all"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="text-gray-500 hover:text-red-500 focus:outline-none transition-colors ml-1"
                                aria-label={`Remove ${skill}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </span>
                        ))
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 py-4">
                            <p className="text-sm">No skills added yet.</p>
                        </div>
                    )}
                </div>
             </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-6 mt-4 border-t border-gray-900">
             <button 
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 bg-transparent border border-gray-700 text-gray-300 py-3 rounded-lg text-sm font-semibold hover:bg-[#111] hover:text-white transition-all"
             >
                Cancel
             </button>
             <button 
                onClick={saveSkills}
                disabled={loading}
                className={`flex-[2] bg-green-600 text-black py-3 rounded-lg text-sm font-bold shadow-lg shadow-green-900/20 transition-all
                  ${loading ? "opacity-70 cursor-wait" : "hover:bg-green-500"}
                  disabled:opacity-50 disabled:cursor-not-allowed`}
             >
                {loading ? "Saving..." : "Save Changes"}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditSkills;