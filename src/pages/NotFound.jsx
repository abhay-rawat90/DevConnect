import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-[calc(100dvh-64px)] bg-[#050505] text-gray-200 font-sans flex flex-col items-center justify-center px-4 text-center">
            <p className="font-mono text-sm text-green-500 mb-3">Error 404</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Page not found</h1>
            <p className="text-gray-500 mb-8 max-w-sm">
                The page you're looking for doesn't exist or may have been moved.
            </p>
            <Link
                to={user ? "/dashboard" : "/"}
                className="px-6 py-3 bg-green-600 text-black text-sm font-bold rounded-lg hover:bg-green-500 transition-colors"
            >
                {user ? "Back to Dashboard" : "Back to Home"}
            </Link>
        </div>
    );
};

export default NotFound;
