import { useState } from "react";
import Input from "../components/input";

const Register = () => {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg("Registered successfully!");
        setForm({ name: "", username: "", email: "", password: "" });
      } else {
        setMsg(data.message || "Something went wrong");
      }
    } catch (err) {
      setMsg("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="User Name" name="username" value={form.username} onChange={handleChange} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" type="submit">
          Register
        </button>
      </form>
      {msg && <p className="mt-4 text-center text-red-500">{msg}</p>}
    </div>
  );
};

export default Register;
