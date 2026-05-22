import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const [logs, setLogs] = useState([
    "System.init(DevConnect)...",
    "Establishing secure handshake...",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        if (prev.length > 8) return prev.slice(1);
        const newLogs = [
          "Verifying encryption keys...",
          "Ping: 14ms",
          "Modules loaded: [Auth, User, Core]",
          "Waiting for user authentication...",
          "Connection stable.",
        ];
        return [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData
      );
      login(res.data.user, res.data.token);
      toast.success("Welcome back!");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] font-sans flex relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 z-10 bg-[#050505]">
        
        <div className="mb-10 max-w-md w-full mx-auto lg:mx-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm">
            Please enter your details to sign in to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto lg:mx-0 space-y-5">
          
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative group">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-600"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative group">
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-600 font-mono"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 mt-4 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20
              ${loading ? "opacity-70 cursor-wait" : ""}
            `}
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <div className="w-full max-w-md mx-auto lg:mx-0 mt-8 pt-6 border-t border-gray-900 text-center lg:text-left">
            <p className="text-gray-500 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-green-500 font-semibold hover:text-green-400 transition-colors">
                    Sign up
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
                auth_server.log
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

export default Login;