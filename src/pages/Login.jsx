import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Input from "../components/input";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  // Fake "Terminal Logs" state
  const [logs, setLogs] = useState([
    "> System.init(DevConnect)...",
    "> Establishing secure handshake...",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        if (prev.length > 8) return prev.slice(1);
        const newLogs = [
          "> Verifying encryption keys...",
          "> Ping: 14ms",
          "> Modules loaded: [Auth, User, Core]",
          "> Waiting for user input...",
          "> Connection stable.",
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
      toast.success("ACCESS GRANTED");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "ACCESS DENIED");
    } finally {
      setLoading(false);
    }
  };

  return (
    // OUTER CONTAINER: Dark mode, Monospace font
    <div className="min-h-screen bg-[#050505] text-green-500 font-mono flex relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* CRT SCANLINE EFFECT OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

      {/* LEFT SIDE: THE FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 z-10 relative">
        
        {/* Logo / Brand */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white animate-pulse">
            DEV<span className="text-green-500">_CONNECT</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm tracking-widest">
            v.2.0.4 :: SECURE LOGIN GATEWAY
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
          
          <div className="space-y-6">
            {/* EMAIL INPUT */}
            <div className="relative group">
              <span className="absolute left-0 top-10 text-green-500 select-none text-xl">{">"}</span>
              <div className="pl-6 border-b border-gray-800 focus-within:border-green-500 transition-colors duration-300">
                <Input
                  label="EMAIL" // Explicit label added here
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent text-gray-300 focus:outline-none py-3 placeholder-gray-700 font-mono"
                  placeholder="enter_email@id.com"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="relative group">
              <span className="absolute left-0 top-10 text-green-500 select-none text-xl">{">"}</span>
              <div className="pl-6 border-b border-gray-800 focus-within:border-green-500 transition-colors duration-300">
                <Input
                  label="PASSWORD" // Explicit label added here
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent text-gray-300 focus:outline-none py-3 placeholder-gray-700 font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-4 px-6 border border-green-500 text-green-500 font-bold tracking-widest uppercase hover:bg-green-500 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]
              ${loading ? "opacity-50 cursor-wait" : ""}
            `}
          >
            {loading ? "INITIALIZING..." : ":: EXECUTE_LOGIN()"}
          </button>
        </form>

        {/* REGISTER LINK */}
        <div className="w-full max-w-md mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
                NEW_USER_DETECTED?{' '}
                <Link to="/register" className="text-green-500 font-bold hover:text-white hover:underline decoration-green-500 underline-offset-4 transition-all uppercase">
                    :: Create_Account
                </Link>
            </p>
        </div>
      </div>

      {/* RIGHT SIDE: THE VISUAL */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] border-l border-gray-800 items-center justify-center relative">
        <div className="w-full max-w-lg p-6">
          <div className="bg-[#111] rounded border border-gray-800 p-4 shadow-2xl opacity-80">
            <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="font-mono text-xs sm:text-sm space-y-2 h-64 overflow-hidden text-gray-400">
              {logs.map((log, index) => (
                <p key={index} className="typing-effect">
                  <span className="text-blue-400">root@devconnect:~$</span> {log}
                </p>
              ))}
              <p className="animate-pulse">_</p>
            </div>
          </div>
        </div>
        
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 z-[-1] opacity-20"
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

    </div>
  );
};

export default Login;