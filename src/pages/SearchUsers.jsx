import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';

const SearchUsers = () => {
    const [skill, setSkill] = useState("");
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false); // New state to track if search ran
    const { token, user } = useAuth(); 

    const handleSearch = async () => {
        if (!skill.trim()) {
            toast.error("Please enter a skill to search.");
            return;
        }
        
        // Reset results and search status before new request
        setHasSearched(false);

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/search?skill=${skill}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Fix: axios returns the array in res.data
            const data = res.data; 

            // Filter out the current user from search results
            const filteredResults = data.filter(foundUser => foundUser._id !== user.id);
            
            setResults(filteredResults);
            setHasSearched(true); // Mark search as completed
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch users.");
        }
    };

    const handleConnect = async (recipientId) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/connections/send`,
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
                {/* Show message if searched but no results found */}
                {hasSearched && results.length === 0 ? (
                    <p className="text-center text-gray-500 mt-4">
                        No users found with skill "{skill}".
                    </p>
                ) : (
                    results.map((foundUser) => {
                        const isConnected = user.connections.includes(foundUser._id);
                        return (
                            <div key={foundUser._id} className="border p-4 rounded-lg shadow-sm flex justify-between items-center bg-white">
                                <Link to={`/profile/${foundUser._id}`} className="flex-grow">
                                    <h4 className="font-bold text-lg hover:underline">{foundUser.username}</h4>
                                    <p className="text-sm mt-1">Skills: <span className="font-semibold text-gray-800">{foundUser.skills.join(", ")}</span></p>
                                </Link>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleConnect(foundUser._id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                                        Connect
                                    </button>
                                    {isConnected && (
                                        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">
                                            Challenge
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SearchUsers;