import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
    const {user,logout} = useAuth();
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4 ">Welcome, {user?.name}!</h2>
                <p className="mb-2">Email: <span className="font-medium">{user?.email}</span></p>
                <button onClick={logout} className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
            </div>
        </div>

    );
};

export default Dashboard;