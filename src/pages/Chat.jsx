import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const [connections, setConnections] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user, token } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const scrollRef = useRef();

  // --- Socket.IO and Data Fetching Effects ---
  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL);
    socket.current.on("getMessage", (data) => {
      // Only update if the message is for the currently open chat
      if (data.senderId === currentChat?._id) {
        setMessages((prev) => [...prev, { sender: data.senderId, content: data.text, createdAt: Date.now() }]);
      }
    });
    socket.current.on("getUsers", (users) => setOnlineUsers(users));
    return () => socket.current.disconnect();
  }, [currentChat]); // Re-run if currentChat changes to correctly scope the getMessage listener

  useEffect(() => {
    if (user?.id) {
      socket.current.emit("addUser", user.id);
    }
  }, [user]);

  useEffect(() => {
    const getConnections = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/connections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnections(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (token) getConnections();
  }, [user, token]);

  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${currentChat._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages(res.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getMessages();
  }, [currentChat, token]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Event Handlers ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message = {
      senderId: user.id,
      receiverId: currentChat._id,
      text: newMessage,
    };
    socket.current.emit("sendMessage", message);
    setMessages([...messages, { sender: user.id, content: newMessage, createdAt: Date.now() }]);
    setNewMessage("");
  };

  // --- Helper Functions ---
  const getInitials = (name = '') => name.substring(0, 2).toUpperCase();
  const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-[calc(100vh-60px)] font-sans antialiased text-slate-800 bg-slate-50 dark:text-slate-200 dark:bg-slate-900">
      {/* ===== CONNECTIONS SIDEBAR ===== */}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-slate-200 dark:border-slate-700 flex-col ${currentChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">Chats</h2>
        </div>
        {connections.length > 0 ? (
          <div className="flex-1 overflow-y-auto">
          {connections.map((c) => {
            const isOnline = onlineUsers.some(onlineUser => onlineUser.userId === c._id);
            return (
              <div
                key={c._id}
                onClick={() => setCurrentChat(c)}
                className={`p-3 flex items-center cursor-pointer border-l-4 ${currentChat?._id === c._id ? 'border-blue-500 bg-slate-200 dark:bg-slate-700' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <div className="relative mr-3">
                  <div className="h-12 w-12 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                    {c.profilePicture ? <img src={c.profilePicture} alt={c.username} className="h-full w-full object-cover rounded-full" /> : getInitials(c.username)}
                  </div>
                  {isOnline && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-800"></span>}
                </div>
                <div>
                  <h3 className="font-semibold">{c.username}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{isOnline ? "Online" : "Offline"}</p>
                </div>
              </div>
            );
          })}
        </div>
        ) :
        (<p className="text-gray-500">You have no connections</p>)
        }
      </div>

      {/* ===== CHAT BOX ===== */}
      <div className={`w-full md:w-2/3 lg:w-3/4 flex-col ${currentChat ? 'flex' : 'hidden md:flex'}`}>
        {currentChat ? (
          <>
            {/* Header */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center space-x-3">
              <button onClick={() => setCurrentChat(null)} className="md:hidden p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                {currentChat.profilePicture ? <img src={currentChat.profilePicture} alt={currentChat.username} className="h-full w-full object-cover rounded-full" /> : getInitials(currentChat.username)}
              </div>
              <span className="font-semibold">{currentChat.username}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m, index) => (
                <div key={index} className={`flex items-end gap-2 ${m.sender === user.id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${m.sender === user.id ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none"}`}>
                    <p>{m.content}</p>
                    <p className={`text-xs mt-1 ${m.sender === user.id ? 'text-blue-200' : 'text-slate-500'}`}>{formatTimestamp(m.createdAt)}</p>
                  </div>
                </div>
              ))}
              <div ref={scrollRef}></div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex items-center space-x-3">
              <input
                type="text"
                className="flex-1 bg-slate-100 dark:bg-slate-700 border-transparent rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              />
              <button type="submit" className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>Select a connection to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;