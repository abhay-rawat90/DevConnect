import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const {user, loading} = useAuth();

    if(loading) {
        return(
            <div className="min-h-screen flex justify-center items-center text-xl">
                Checking Auth...
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />
};

export default PrivateRoute;