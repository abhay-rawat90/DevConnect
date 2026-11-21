import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const location = useLocation();

  // Keep the current path in a ref so the message listener always sees the latest page
  const pathRef = useRef(location.pathname);
  useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);

  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!userId || !token) return;

    // Connect to Socket. The server reads who we are from the token,
    // and re-registers us automatically whenever the socket reconnects.
    const s = io(import.meta.env.VITE_API_URL, { auth: { token } });
    socket.current = s;
    s.on("getUsers", (users) => setOnlineUsers(users));

    // Global Notification Listener
    s.on("getMessage", (data) => {
      // Show notification if NOT on chat page
      if (pathRef.current !== "/chat") {
        toast(`📩 New message from ${data.senderName || "User"}`, {
          id: `msg-${data.senderId}`, // several quick messages from one person -> one toast
          duration: 4000,
          position: "top-right",
          style: {
            background: "#050505",
            color: "#22c55e",
            border: "1px solid #22c55e",
            fontFamily: "monospace"
          },
        });
      }
    });

    return () => {
      s.disconnect();
      if (socket.current === s) socket.current = null;
      setOnlineUsers([]);
    };
  }, [userId, token]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
