import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const Chat = () => {
  const [connections, setConnections] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user, token } = useAuth();
  
  const { socket, onlineUsers } = useSocket();
  const scrollRef = useRef();

  const userId = user?.id || user?._id; // Robust ID extraction

  // --- 1. SOCKET LISTENER ---
  useEffect(() => {
    if (!socket.current) return;

    const handleIncomingMessage = (data) => {
      if (currentChat && data.senderId === currentChat._id) {
        setMessages((prev) => [
          ...prev, 
          { sender: data.senderId, content: data.text, createdAt: Date.now() }
        ]);
      }
    };

    socket.current.on("getMessage", handleIncomingMessage);

    return () => {
      socket.current.off("getMessage", handleIncomingMessage);
    };
  }, [currentChat, socket]); 

  // --- 2. DATA FETCHING ---
  useEffect(() => {
    const getConnections = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/connections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnections(res.data);
      } catch (err) { console.log(err); }
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
        } catch (err) { console.log(err); }
      }
    };
    getMessages();
  }, [currentChat, token]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 3. MESSAGE HANDLER ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messagePayload = {
      senderId: userId,
      receiverId: currentChat._id,
      text: newMessage,
      senderName: user.name || user.username 
    };

    socket.current.emit("sendMessage", messagePayload);
    
    setMessages([...messages, { sender: userId, content: newMessage, createdAt: Date.now() }]);
    setNewMessage("");
  };

  // Helpers
  const getInitials = (name = '') => name.substring(0, 2).toUpperCase();
  const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-[calc(100vh-64px)] font-sans text-gray-200 bg-[#050505] relative overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* MINIMALIST GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* SIDEBAR */}
      <div className={`w-full md:w-80 border-r border-gray-900 flex-col z-10 bg-[#050505]/95 backdrop-blur-md ${currentChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 border-b border-gray-900 bg-[#0a0a0a]">
          <h2 className="text-xl font-bold text-white tracking-tight">Messages</h2>
        </div>
        
        {connections.length > 0 ? (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
          {connections.map((c) => {
            const isOnline = onlineUsers.some(ou => ou.userId === c._id);
            const isActive = currentChat?._id === c._id;
            return (
              <div 
                key={c._id} 
                onClick={() => setCurrentChat(c)} 
                className={`p-4 cursor-pointer border-b border-gray-900 transition-all flex items-center justify-between group
                  ${isActive ? 'bg-[#111] border-l-2 border-l-green-500' : 'hover:bg-[#0a0a0a] border-l-2 border-l-transparent'}`}
              >
                <div className="flex items-center gap-3 w-full">
                  
                  {/* Avatar with Online Status Indicator */}
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-[#1a1a1a] border border-gray-800 flex items-center justify-center font-bold text-gray-400 overflow-hidden flex-shrink-0">
                      {c.profilePicture ? <img src={c.profilePicture} className="h-full w-full object-cover" /> : getInitials(c.username)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#050505] ${isOnline ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <h3 className={`font-semibold truncate transition-colors ${isActive ? 'text-green-400' : 'text-gray-200 group-hover:text-white'}`}>
                      {c.name || c.username}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">@{c.username}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
             <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
             <p className="text-sm">No connections yet.</p>
          </div>
        )}
      </div>

      {/* CHAT AREA */}
      <div className={`flex-1 flex-col bg-[#050505] z-10 relative ${currentChat ? 'flex' : 'hidden md:flex'}`}>
        
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-gray-900 bg-[#0a0a0a] flex items-center justify-between shadow-sm z-20">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentChat(null)} 
                  className="md:hidden text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full border border-gray-800 bg-[#111] flex items-center justify-center overflow-hidden">
                    {currentChat.profilePicture ? <img src={currentChat.profilePicture} className="h-full w-full object-cover" /> : <span className="text-sm font-bold text-gray-500">{getInitials(currentChat.username)}</span>}
                  </div>
                  <div>
                      <h2 className="font-bold text-white">{currentChat.name || currentChat.username}</h2>
                      <span className="text-xs text-green-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Secured End-to-End
                      </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <p className="text-sm">This is the start of your secure conversation.</p>
                 </div>
              ) : (
                messages.map((m, index) => {
                  const isMe = m.sender === userId;
                  return (
                    <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] p-3.5 text-sm shadow-sm
                        ${isMe 
                          ? "bg-green-600 text-black font-medium rounded-2xl rounded-br-sm" 
                          : "bg-[#111] border border-gray-800 text-gray-200 rounded-2xl rounded-bl-sm"}`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{m.text || m.content}</p>
                      </div>
                      <span className="text-[10px] text-gray-600 mt-1 mx-1 font-medium">
                        {formatTimestamp(m.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef}></div>
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-[#0a0a0a] border-t border-gray-900 z-20">
              <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
                <input 
                  type="text" 
                  className="flex-1 bg-[#111] border border-gray-800 text-gray-200 rounded-full px-5 py-3.5 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-600" 
                  placeholder="Type your message..." 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  value={newMessage} 
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="h-12 w-12 bg-green-600 flex items-center justify-center rounded-full text-black hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-green-900/20"
                >
                  <svg className="w-5 h-5 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
             <div className="w-20 h-20 bg-[#0a0a0a] border border-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
             </div>
             <p className="text-xl font-bold text-gray-300">Your Messages</p>
             <p className="text-sm mt-2 text-gray-500">Select a connection from the sidebar to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;