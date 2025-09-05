import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-2">👤 {user.username}'s Profile</h2>
      <p className="text-gray-600">📧 {user.email}</p>
      <button onClick={() => { navigate("/edit-profile") }} className="mt-4 ml-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit Profile</button>

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">🛠️ Skills</h3>
        {user.skills && user.skills.length > 0 ? (
            <>
          <ul className="list-disc list-inside">
            {user.skills.map((skill, idx) => (
              <li key={idx} className="text-blue-600 font-medium">
                {skill}
              </li>
            ))}
          </ul>
          <button onClick={() => { navigate("/edit-skills") }} className="mt-4 ml-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit Skills</button>
          </>
        ) : (
         <>
          <p className="text-gray-500 italic">No skills added yet.</p>
          <button onClick={() => { navigate("/edit-skills") }} className="mt-4 ml-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Skills</button>
         </>
        )}
      </div>
    </div>
  );
};

export default Profile;