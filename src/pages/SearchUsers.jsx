import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const SearchUsers = () => {
    const [skill, setSkill] = useState("");
    const [results, setResults] = useState([]);
    const { token, user } = useAuth(); // Get current user from AuthContext

    const handleSearch = async () => {
        if (!skill.trim()) {
            toast.error("Please enter a skill to search.");
            return;
        }
        try {
            const res = await axios.get(`http://localhost:5000/api/users/search?skill=${skill}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Filter out the current user from search results
            const filteredResults = res.data.filter(foundUser => foundUser._id !== user.id);
            setResults(filteredResults);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch users.");
        }
    };

    const handleConnect = async (recipientId) => {
        try {
            await axios.post("http://localhost:5000/api/connections/send",
                { recipientId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success("Connection request sent!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not send request.");
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Search Users by Skill</h2>
            <div className="flex justify-center gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Enter a skill"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="border p-2 rounded w-full max-w-xs"
                />
                <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Search
                </button>
            </div>

            <div className="mt-6 space-y-3">
                {results.map((foundUser) => (
                    <div key={foundUser._id} className="border p-4 rounded-lg shadow-sm flex justify-between items-center bg-white">
                        <div>
                            <h4 className="font-bold text-lg">{foundUser.username}</h4>
                            <p className="text-gray-600">{foundUser.email}</p>
                            <p className="text-sm mt-1">Skills: <span className="font-semibold text-gray-800">{foundUser.skills.join(", ")}</span></p>
                        </div>
                        <button onClick={() => handleConnect(foundUser._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchUsers;