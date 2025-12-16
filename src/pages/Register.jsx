import { useState } from "react";
import { Link } from "react-router-dom"; // Added Link import
import Input from "../components/input";

const Register = () => {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(""); 

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg("SUCCESS: Entity registered in database.");
        setForm({ name: "", username: "", email: "", password: "" });
      } else {
        setMsg(`ERROR: ${data.message || "Registration sequence failed."}`);
      }
    } catch (err) {
      setMsg("CRITICAL_FAILURE: Cannot connect to mainframe.");
    } finally {
        setLoading(false);
    }
  };

  const isSuccess = msg.includes("SUCCESS");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050505] text-green-500 font-mono flex items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="w-full max-w-lg relative z-10 bg-[#0a0a0a] border border-gray-800 p-8 sm:p-10 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        
        {/* Decorative Corner Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black tracking-tighter text-white animate-pulse">
            NEW_<span className="text-green-500">USER</span>
          </h2>
          <p className="text-gray-500 mt-2 text-xs tracking-widest uppercase">
            :: Initialize Registration Sequence ::
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-gray-800 focus-within:border-green-500 transition-colors duration-300 pb-1">
              <Input 
                  label="FULL NAME" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  className="w-full bg-transparent text-gray-300 focus:outline-none placeholder-gray-700 font-mono"
                  placeholder="ENTER_IDENTIFIER"
              />
          </div>

          <div className="border-b border-gray-800 focus-within:border-green-500 transition-colors duration-300 pb-1">
            <Input 
                label="USERNAME" 
                name="username" 
                value={form.username} 
                onChange={handleChange} 
                className="w-full bg-transparent text-gray-300 focus:outline-none placeholder-gray-700 font-mono"
                placeholder="SET_HANDLE"
            />
          </div>

          <div className="border-b border-gray-800 focus-within:border-green-500 transition-colors duration-300 pb-1">
            <Input 
                label="EMAIL ADDRESS" 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                className="w-full bg-transparent text-gray-300 focus:outline-none placeholder-gray-700 font-mono"
                placeholder="CONTACT_PROTOCOL"
            />
          </div>

          <div className="border-b border-gray-800 focus-within:border-green-500 transition-colors duration-300 pb-1">
            <Input 
                label="PASSWORD" 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                className="w-full bg-transparent text-gray-300 focus:outline-none placeholder-gray-700 font-mono"
                placeholder="SET_ACCESS_KEY"
            />
          </div>

          <button
            className={`w-full py-3 px-6 mt-6 border border-green-500 text-green-500 font-bold tracking-widest uppercase hover:bg-green-500 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] relative overflow-hidden group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={loading}
          >
             <span className="relative z-10">
                 {loading ? "PROCESSING..." : ":: EXECUTE_REGISTRATION()"}
            </span>
          </button>
        </form>

        {msg && (
          <div className={`mt-6 p-4 border-l-4 font-mono text-sm bg-[#050505] ${isSuccess ? "border-green-500 text-green-400" : "border-red-500 text-red-400"}`}>
            <p className="font-bold leading-relaxed">
                <span className="animate-pulse">{">"}</span> SYSTEM_LOG: 
                {msg}
            </p>
          </div>
        )}

        {/* LOGIN LINK SECTION */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
                ALREADY_HAS_ACCESS?{' '}
                <Link to="/login" className="text-green-500 font-bold hover:text-white hover:underline decoration-green-500 underline-offset-4 transition-all uppercase">
                    :: Login_Here
                </Link>
            </p>
        </div>

      </div>
    </div>
  );
};

export default Register;