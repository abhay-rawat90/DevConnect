import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("auth-token", token);
        localStorage.setItem("auth-user", JSON.stringify(userData));
        navigate("/dashboard");
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-user");
        navigate("/login");
    };

    // New function to update user state and localStorage
    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        localStorage.setItem("auth-user", JSON.stringify(updatedUserData));
    };

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
            localStorage.setItem("auth-user", JSON.stringify(res.data));
        } catch (err) {
            console.log("Failed to Fetch User Data ", err);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("auth-token");
        const storedUser = localStorage.getItem("auth-user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, fetchUserData, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;