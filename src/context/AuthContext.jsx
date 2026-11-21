import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const AuthContext = createContext();

// True if the JWT is missing, malformed or past its expiry time
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        return !payload.exp || payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

// Read the saved session synchronously so the very first render already knows who is logged in.
// (Reading it later in an effect made protected pages redirect to /login on every refresh.)
const loadStoredSession = () => {
    try {
        const storedToken = localStorage.getItem("auth-token");
        const storedUser = JSON.parse(localStorage.getItem("auth-user"));
        if (storedToken && storedUser && !isTokenExpired(storedToken)) {
            return { token: storedToken, user: storedUser };
        }
    } catch {
        // Corrupted storage: fall through and start logged out
    }
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    return { token: null, user: null };
};

export const AuthProvider = ({ children }) => {
    const [session] = useState(loadStoredSession);
    const [user, setUser] = useState(session.user);
    const [token, setToken] = useState(session.token);
    const navigate = useNavigate();

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("auth-token", token);
        localStorage.setItem("auth-user", JSON.stringify(userData));
        navigate("/dashboard");
    };

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-user");
        navigate("/login");
    }, [navigate]);

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

    // If the server ever rejects our token (expired / invalid), log out cleanly
    // instead of leaving every page half-broken.
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                const sentToken = error.config?.headers?.Authorization;
                if (error.response?.status === 401 && sentToken && localStorage.getItem("auth-token")) {
                    toast.error("Your session has expired. Please log in again.", { id: "session-expired" });
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, fetchUserData, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
