import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditSkills = () => {
  const { token, user } = useAuth();
  const [skills, setSkills] = useState(user.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const { fetchUserData } = useAuth();
  const navigate = useNavigate();
  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const saveSkills = async () => {
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
      toast.success("Skills Updated");
      navigate("/profile")
    } catch (err) {
      console.error(err);
      alert("Failed to update skills");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Your Skills</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill"
          className="border p-2 rounded w-full"
        />
        <button onClick={addSkill} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
          >
            {skill}
            <button onClick={() => removeSkill(skill)} className="text-red-600">✕</button>
          </span>
        ))}
      </div>

      <button onClick={saveSkills} className="bg-green-600 text-white px-4 py-2 rounded">
        Save Skills
      </button>
    </div>
  );
};

export default EditSkills;
