import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Input from "../components/input";

const EditProfile = () => {
  const { user, token, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  console.log(token);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      login(res.data.user, token); 
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Profile</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
        <Input label="Username" name="username" value={formData.username} onChange={handleChange} />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md mt-4">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
