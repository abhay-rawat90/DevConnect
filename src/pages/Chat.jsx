import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext"; // Import Context

const Chat = () => {
  const [connections, setConnections] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user, token } = useAuth();
  
  // Use Global Socket
  const { socket, onlineUsers } = useSocket();
  const scrollRef = useRef();

  // --- 1. YOUR ORIGINAL LISTENER (Adapted for Context) ---
  useEffect(() => {
    if (!socket.current) return;

    const handleIncomingMessage = (data) => {
      // Only add message if it belongs to the CURRENT chat
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

  // --- 2. YOUR ORIGINAL DATA FETCHING ---
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

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 3. YOUR ORIGINAL HANDLER (With senderName added) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const messagePayload = {
      senderId: user.id,
      receiverId: currentChat._id,
      text: newMessage,
      senderName: user.name || user.username // Add this for notification
    };

    socket.current.emit("sendMessage", messagePayload);
    
    setMessages([...messages, { sender: user.id, content: newMessage, createdAt: Date.now() }]);
    setNewMessage("");
  };

  // Helper
  const getInitials = (name = '') => name.substring(0, 2).toUpperCase();
  const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-[calc(100vh-64px)] font-mono text-green-500 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>

      {/* SIDEBAR */}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-800 flex-col z-10 bg-[#050505] ${currentChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-800 bg-[#0a0a0a]">
          <h2 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
            SECURE_CHANNELS
          </h2>
        </div>
        
        {connections.length > 0 ? (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
          {connections.map((c) => {
            const isOnline = onlineUsers.some(onlineUser => onlineUser.userId === c._id);
            const isActive = currentChat?._id === c._id;
            return (
              <div key={c._id} onClick={() => setCurrentChat(c)} className={`p-4 cursor-pointer border-b border-gray-900 transition-all ${isActive ? 'bg-green-900/10 border-l-4 border-l-green-500 text-green-400' : 'hover:bg-[#111] hover:text-green-300 border-l-4 border-l-transparent'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 border border-current flex items-center justify-center font-bold text-sm bg-black overflow-hidden ${isActive ? 'shadow-[0_0_10px_rgba(34,197,94,0.3)]' : ''}`}>
                      {c.profilePicture ? <img src={c.profilePicture} className="h-full w-full object-cover grayscale" /> : getInitials(c.username)}
                    </div>
                    <div>
                      <h3 className="font-bold tracking-wide uppercase">{c.username}</h3>
                      <p className="text-xs opacity-60 font-mono">ID: {c._id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <div className={`text-xs uppercase tracking-tighter ${isOnline ? 'text-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'text-gray-600'}`}>
                    {isOnline ? "[ ON ]" : "[ OFF ]"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="p-8 text-center opacity-50 text-sm"><p>{">"} NO_CONNECTIONS_FOUND</p></div>
        )}
      </div>

      {/* CHAT AREA */}
      <div className={`w-full md:w-2/3 lg:w-3/4 flex-col bg-[#050505] z-10 relative ${currentChat ? 'flex' : 'hidden md:flex'}`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {currentChat ? (
          <>
            <div className="p-3 border-b border-gray-800 bg-[#0a0a0a] flex items-center gap-4 shadow-lg z-20">
              <button onClick={() => setCurrentChat(null)} className="md:hidden p-2 text-green-500 border border-green-900">{"< BACK"}</button>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 border border-green-500 bg-black flex items-center justify-center text-xs overflow-hidden">
                  {currentChat.profilePicture ? <img src={currentChat.profilePicture} className="h-full w-full object-cover grayscale" /> : getInitials(currentChat.username)}
                </div>
                <div>
                    <span className="block font-bold text-sm uppercase tracking-wider">Target: {currentChat.username}</span>
                    <span className="block text-[10px] text-gray-500">ENCRYPTION: AES-256-GCM</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black">
              {messages.map((m, index) => {
                const isMe = m.sender === user.id;
                return (
                  <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 mb-1 text-[10px] text-gray-500 font-mono">
                         {isMe ? "YOU" : currentChat.username.toUpperCase()} :: {formatTimestamp(m.createdAt)}
                    </div>
                    <div className={`max-w-[85%] md:max-w-md p-3 border text-sm font-medium tracking-wide shadow-lg ${isMe ? "bg-green-900/20 border-green-500 text-green-300 rounded-bl-xl" : "bg-gray-900/50 border-gray-700 text-gray-300 rounded-br-xl"}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.text || m.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef}></div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-[#0a0a0a] border-t border-gray-800 flex items-center gap-2 z-20">
              <span className="text-green-500 animate-pulse">{">"}</span>
              <input type="text" className="flex-1 bg-transparent border-b border-gray-700 text-green-400 p-2 focus:outline-none focus:border-green-500 placeholder-gray-700 font-mono" placeholder="ENTER_MESSAGE..." onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
              <button type="submit" className="px-4 py-2 bg-green-900/20 border border-green-600 text-green-500 hover:bg-green-500 hover:text-black transition-all font-bold text-xs uppercase tracking-widest">Send</button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-green-900">
             <div className="text-6xl mb-4 animate-pulse opacity-20">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
             </div>
             <p className="text-xl tracking-widest font-bold opacity-40">WAITING FOR SIGNAL...</p>
             <p className="text-sm mt-2 opacity-30">SELECT A FREQUENCY TO BEGIN TRANSMISSION</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;