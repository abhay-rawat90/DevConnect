import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SearchUsers = () => {
    const [skill, setSkill] = useState("");
    const [results, setResults] = useState([]);
    const { token } = useAuth();


    const handleSearch = async () => {
        try{
            const res = await axios.get(`http://localhost:5000/api/users/search?skill=${skill}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setResults(res.data);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Users by Skill</h2>
      <input
        type="text"
        placeholder="Enter a skill"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        className="border px-2 py-1 mr-2"
      />
      <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-1 rounded">
        Search
      </button>

      <div className="mt-6">
        {results.map((user) => (
          <div key={user._id} className="border p-2 mb-2 rounded">
            <h4 className="font-bold">{user.username}</h4>
            <p>{user.email}</p>
            <p>Skills: {user.skills.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchUsers;

