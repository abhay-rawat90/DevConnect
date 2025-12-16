import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditSkills = () => {
  const { token, user, fetchUserData } = useAuth();
  const [skills, setSkills] = useState(user.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addSkill = (e) => {
    if (e) e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      toast.success(`MODULE_LOADED: ${newSkill.toUpperCase()}`);
    } else if (skills.includes(newSkill.trim())) {
      toast.error("ERROR: MODULE_ALREADY_ACTIVE");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const saveSkills = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/skills`,
        { skills },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserData();
      toast.success("SYSTEM_UPDATE: CONFIG_SAVED");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error("CRITICAL_ERROR: UPDATE_FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] text-green-500 font-mono flex items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[length:100%_4px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)]"></div>
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* CONFIG PANEL */}
      <div className="w-full max-w-lg relative z-10 bg-[#0a0a0a] border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/50">
           <h2 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
              MODULE_CONFIG
           </h2>
           <span className="text-[10px] text-gray-600 font-bold tracking-widest">v.2.4.0</span>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* INPUT SECTION */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                {">"} Inject_New_Module
            </label>
            <form onSubmit={addSkill} className="flex gap-0 shadow-lg relative group">
                <div className="absolute -inset-0.5 bg-green-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex-grow bg-black border border-gray-700 focus-within:border-green-500 flex items-center">
                    <span className="pl-3 text-green-500 font-bold">{">"}</span>
                    <input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="ENTER_SKILL_ID..."
                        className="w-full bg-transparent p-3 text-green-400 focus:outline-none font-mono placeholder-gray-700 uppercase"
                    />
                </div>
                <button 
                    type="submit"
                    className="relative bg-green-900/20 border-t border-r border-b border-green-700 text-green-500 hover:bg-green-500 hover:text-black px-6 font-bold uppercase tracking-widest transition-all"
                >
                    [ ADD ]
                </button>
            </form>
          </div>

          {/* ACTIVE SKILLS DISPLAY */}
          <div className="border border-gray-800 bg-black/40 p-4 min-h-[150px] relative">
             <h3 className="absolute -top-3 left-3 bg-[#0a0a0a] px-2 text-[10px] text-gray-500 uppercase">
                 Active_Modules ({skills.length})
             </h3>
             
             <div className="flex flex-wrap gap-3 mt-2">
                {skills.length > 0 ? (
                    skills.map((skill) => (
                    <span
                        key={skill}
                        className="group flex items-center gap-2 bg-green-900/10 border border-green-800 text-green-400 text-xs px-3 py-1 uppercase tracking-wide hover:border-red-500 hover:bg-red-900/10 hover:text-red-500 transition-all cursor-pointer"
                        title="Click to Uninstall"
                        onClick={() => removeSkill(skill)}
                    >
                        {skill}
                        <span className="text-[10px] opacity-50 group-hover:opacity-100">x</span>
                    </span>
                    ))
                ) : (
                    <p className="text-gray-600 text-xs italic w-full text-center mt-8">
                        {">"} NO_MODULES_INSTALLED
                    </p>
                )}
             </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4 border-t border-gray-800">
             <button 
                onClick={() => navigate("/profile")}
                className="flex-1 border border-gray-700 text-gray-500 py-3 text-xs font-bold uppercase tracking-widest hover:text-white hover:border-gray-500 transition-all"
             >
                Cancel
             </button>
             <button 
                onClick={saveSkills}
                disabled={loading}
                className="flex-[2] bg-green-600 text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
             >
                {loading ? "WRITING_TO_DISK..." : "[ COMMIT_CHANGES ]"}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditSkills;