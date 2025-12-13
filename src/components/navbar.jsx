import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const placeholder = (
    <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  return (
    <nav className="bg-white text-gray-800 shadow-md py-3 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">DevConnect</Link>
      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:text-blue-600 font-medium">Home</Link>
        <Link to="/search" className="hover:text-blue-600 font-medium">Search</Link>
        {user ? (
          <>
            <Link to="/requests" className="hover:text-blue-600 font-medium">Requests</Link>
            <Link to="/chat" className="hover:text-blue-600 font-medium">Chat</Link>
            <button onClick={logout} className="text-red-500 hover:underline font-medium">Logout</button>
            <Link to="/profile" className="h-10 w-10 rounded-full overflow-hidden border-2 border-blue-500">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                placeholder
              )}
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Login</Link>
            <Link to="/register" className="hover:text-blue-600 font-medium">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;