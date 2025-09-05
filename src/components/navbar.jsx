import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    return(
        <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">DevConnect</Link>
        <div className="space-x-4">
            <Link to="/" className= "hover:text-blue-300">Home</Link>
            { user ? (
                <>
                <Link to="/search" className="hover:text-blue-300">Search</Link>
                <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
                <Link to="/profile" className="hover:text-blue-300">Profile</Link>
                <button onClick={logout} className="text-red-500 hover: underline">Logout</button>
                </>
            )
            :
            (
                <>
                <Link to="/login" className="hover:text-blue-300">Login</Link>
                <Link to="/register" className="hover:text-blue-300">Register</Link>
                </>

            )}
        </div>
    </nav>
    );
};

export default Navbar;