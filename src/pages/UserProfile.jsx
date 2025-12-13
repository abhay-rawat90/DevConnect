
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const { token, user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        toast.error("Could not fetch user profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if(userId) {
        fetchUserProfile();
    }
  }, [userId, token]);

  if (loading) {
    console.log(userId);
    return <div className="text-center p-10">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center p-10">User not found.</div>;
  }
  
  const isConnected = currentUser?.connections?.includes(profile._id);

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
            <div className="relative h-32 w-32 rounded-full ring-4 ring-blue-500 ring-offset-2 overflow-hidden mb-4">
              {profile.profilePicture ? <img src={profile.profilePicture} alt="Profile" className="h-full w-full object-cover" /> : placeholder}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
            <p className="text-md text-gray-500">Level {profile.level}</p>

            <div className="flex space-x-4 mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Connect</button>
                {isConnected && <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">Challenge</button>}
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🏆 Quiz Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold text-green-500">{profile.quizStats.wins}</p>
                    <p className="text-sm text-gray-500">Wins</p>
                </div>
                 <div>
                    <p className="text-2xl font-bold text-red-500">{profile.quizStats.losses}</p>
                    <p className="text-sm text-gray-500">Losses</p>
                </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🛠️ Skills</h3>
            {profile.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">This user hasn't added any skills yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;