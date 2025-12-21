import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const location = useLocation(); 

  useEffect(() => {
    if (user?.id) {
      // Connect to Socket
      socket.current = io(import.meta.env.VITE_API_URL);
      socket.current.emit("addUser", user.id);
      socket.current.on("getUsers", (users) => setOnlineUsers(users));

      // Global Notification Listener
      socket.current.on("getMessage", (data) => {
        // Show notification if NOT on chat page
        if (location.pathname !== "/chat") {
          toast(`📩 New message from ${data.senderName || "User"}`, {
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
    }

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [user]); 

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};