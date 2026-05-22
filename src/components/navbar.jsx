import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const placeholder = (
    <div className="h-full w-full bg-[#0a0a0a] flex items-center justify-center text-gray-500 text-xs font-medium">
      ?
    </div>
  );

  return (
    <nav className="bg-[#050505]/95 backdrop-blur-sm border-b border-gray-900 sticky top-0 z-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO AREA */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-white tracking-tight hover:opacity-80 transition-opacity">
              Dev<span className="text-green-500">Connect</span>
            </Link>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" active={isActive("/")}>Home</NavLink>
            
            {user ? (
              <>
                <NavLink to="/dashboard" active={isActive("/dashboard")}>Dashboard</NavLink>
                <NavLink to="/search" active={isActive("/search")}>Find Devs</NavLink>
                <NavLink to="/requests" active={isActive("/requests")}>Requests</NavLink>
                <NavLink to="/chat" active={isActive("/chat")}>Chat</NavLink>
                
                <div className="h-4 w-px bg-gray-800 mx-2"></div>
                
                {/* PROFILE & LOGOUT */}
                <div className="flex items-center gap-5 ml-2">
                  <Link 
                    to="/profile" 
                    className="h-8 w-8 rounded-full border border-gray-700 bg-[#0a0a0a] hover:border-green-500 transition-colors overflow-hidden"
                  >
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      placeholder
                    )}
                  </Link>
                  
                  <button 
                    onClick={logout} 
                    className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="h-4 w-px bg-gray-800 mx-2"></div>
                <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-bold bg-green-600 text-black rounded hover:bg-green-500 transition-colors">
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none p-2"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (Collapsible) */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-900 bg-[#0a0a0a]">
          <div className="px-4 pt-2 pb-4 space-y-1 shadow-2xl">
            <MobileNavLink to="/" active={isActive("/")} onClick={() => setIsOpen(false)}>Home</MobileNavLink>
            
            {user ? (
              <>
                <MobileNavLink to="/dashboard" active={isActive("/dashboard")} onClick={() => setIsOpen(false)}>Dashboard</MobileNavLink>
                <MobileNavLink to="/search" active={isActive("/search")} onClick={() => setIsOpen(false)}>Find Devs</MobileNavLink>
                <MobileNavLink to="/requests" active={isActive("/requests")} onClick={() => setIsOpen(false)}>Requests</MobileNavLink>
                <MobileNavLink to="/chat" active={isActive("/chat")} onClick={() => setIsOpen(false)}>Chat</MobileNavLink>
                <MobileNavLink to="/profile" active={isActive("/profile")} onClick={() => setIsOpen(false)}>Profile</MobileNavLink>
                
                <button 
                  onClick={() => { logout(); setIsOpen(false); }} 
                  className="block w-full text-left px-3 py-3 text-base font-medium text-red-400 hover:bg-[#111] rounded-md transition-colors mt-2"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-800">
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-3 text-sm font-medium text-gray-300 bg-[#111] rounded hover:bg-gray-800 transition-colors">
                  Log In
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="text-center py-3 text-sm font-bold bg-green-600 text-black rounded hover:bg-green-500 transition-colors">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Sub-components ---

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className={`text-sm font-medium transition-colors hover:text-green-400
      ${active ? "text-green-500" : "text-gray-400"}`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick, active }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-3 py-3 text-base font-medium rounded-md transition-colors
      ${active ? "bg-green-500/10 text-green-400" : "text-gray-400 hover:bg-[#111] hover:text-white"}`}
  >
    {children}
  </Link>
);

export default Navbar;