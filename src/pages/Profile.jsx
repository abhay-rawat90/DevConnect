import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/upload-picture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      updateUser(res.data.user); // Update global user state
      toast.success(res.data.message);
      setFile(null); // Clear the file input
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  // A default SVG placeholder for the profile picture
  const placeholder = (
    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center">
            {/* Profile Picture Display */}
            <div className="relative h-32 w-32 rounded-full ring-4 ring-blue-500 ring-offset-2 overflow-hidden mb-4">
              {user.profilePicture ? <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" /> : placeholder}
            </div>

            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-md text-gray-500">{user.email}</p>

            {/* Upload Section */}
            <div className="mt-6 w-full max-w-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Profile Picture</label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 flex-grow text-center"
                >
                  {file ? file.name : "Choose File"}
                </label>
                {file && (
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🛠️ Skills</h3>
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No skills added yet.</p>
            )}
            <div className="mt-4 flex justify-center space-x-3">
              <button onClick={() => navigate("/edit-profile")} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                Edit Profile
              </button>
              <button onClick={() => navigate("/edit-skills")} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                {user.skills && user.skills.length > 0 ? "Edit Skills" : "Add Skills"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;