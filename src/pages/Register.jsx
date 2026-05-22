import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [logs, setLogs] = useState([
    "System.init(NewUser)...",
    "Allocating database space...",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        if (prev.length > 8) return prev.slice(1);
        const newLogs = [
          "Generating secure hash protocols...",
          "Checking global directory...",
          "Modules ready: [Profile, Chat, Connect]",
          "Awaiting user registration data...",
          "Connection stable.",
        ];
        return [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, form);
      
      toast.success("Account created successfully! Please log in.");
      setForm({ name: "", username: "", email: "", password: "" });
      
      setTimeout(() => navigate("/login"), 1500);
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] font-sans flex relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 z-10 bg-[#050505] py-12 overflow-y-auto">
        
        <div className="mb-8 max-w-md w-full mx-auto lg:mx-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
            Create an Account
          </h1>
          <p className="text-gray-400 text-sm">
            Join the DevConnect network to chat, share skills, and discover other developers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto lg:mx-0 space-y-5">
          
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange}
              className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-600"
              placeholder="e.g. Jane Doe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Username
            </label>
            <input 
              name="username" 
              value={form.username} 
              onChange={handleChange} 
              className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-600"
              placeholder="johndoe99"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={handleChange} 
              className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-600"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={handleChange} 
              className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-600 font-mono"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 mt-4 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20
              ${loading ? "opacity-70 cursor-wait" : ""}
            `}
          >
             {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="w-full max-w-md mx-auto lg:mx-0 mt-8 pt-6 border-t border-gray-900 text-center lg:text-left">
            <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-green-500 font-semibold hover:text-green-400 transition-colors">
                    Log in
                </Link>
            </p>
        </div>

      </div>

      <div className="hidden lg:flex w-1/2 bg-[#080808] border-l border-gray-900 items-center justify-center relative z-10">
        <div className="w-full max-w-lg p-8">
          
          <div className="bg-[#050505] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
            <div className="bg-[#0a0a0a] border-b border-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-700 hover:bg-red-500 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-gray-700 hover:bg-yellow-500 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-gray-700 hover:bg-green-500 transition-colors"></div>
              <div className="ml-4 flex-1 text-center text-xs font-mono text-gray-500 tracking-wide select-none">
                register_node.log
              </div>
            </div>
            
            <div className="p-6 font-mono text-sm space-y-2 h-[300px] text-gray-400 flex flex-col justify-end">
              {logs.map((log, index) => (
                <p key={index} className="opacity-90">
                  <span className="text-green-500 mr-2">{">"}</span> {log}
                </p>
              ))}
              <p className="text-green-500 animate-pulse mt-1">_</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;