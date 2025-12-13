import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import axios from "axios";
import Input from "../components/input";
import toast from "react-hot-toast";

const Login = () => {
    const [formData,setFormData] = useState({email: "", password: "",});
    const [error,setError] = useState("");
    const { login } = useAuth();


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name] : e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try 
        {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,formData);
        console.log(res);
        login(res.data.user,res.data.token);
        toast.success("Login Successfull");
        }
        catch(err)
        {
            console.log(err);
            toast.error(err.response?.data?.message || "Login Failed");
        }
    };


    

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to DevConnect</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );




}



export default Login;