import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const placeholder = (
    <div className="h-full w-full bg-gray-900 flex items-center justify-center text-green-700 text-xs font-mono border border-green-900">
      ERR_IMG
    </div>
  );

  return (
    <nav className="bg-[#050505] border-b border-gray-800 text-green-500 font-mono sticky top-0 z-50">
      
      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none bg-[length:100%_4px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center relative z-10">
          
          {/* LOGO AREA */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-black tracking-tighter text-white hover:text-green-400 transition-colors">
              DEV<span className="text-green-500">_CONNECT</span>
              <span className="animate-pulse">_</span>
            </Link>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-1">
            {/* HOME is always visible */}
            <NavLink to="/" active={isActive("/")}>/HOME</NavLink>
            
            {user ? (
              // LOGGED IN VIEW
              <>
                <NavLink to="/dashboard" active={isActive("/dashboard")}>/DASHBOARD</NavLink>
                <div className="h-4 w-px bg-gray-800 mx-2"></div>
                <NavLink to="/search" active={isActive("/search")}>/SEARCH</NavLink>
                <NavLink to="/requests" active={isActive("/requests")}>/REQS</NavLink>
                <NavLink to="/chat" active={isActive("/chat")}>/CHAT</NavLink>
                
                {/* PROFILE & LOGOUT */}
                <div className="ml-4 flex items-center gap-4">
                  <button 
                    onClick={logout} 
                    className="text-xs text-red-500 hover:bg-red-500 hover:text-black px-2 py-1 border border-red-900 hover:border-red-500 transition-all uppercase"
                  >
                    [ DISCONNECT ]
                  </button>
                  
                  <Link 
                    to="/profile" 
                    className="h-9 w-9 border border-green-500 bg-gray-900 hover:shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all overflow-hidden"
                  >
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all" />
                    ) : (
                      placeholder
                    )}
                  </Link>
                </div>
              </>
            ) : (
              // LOGGED OUT VIEW
              <>
                <div className="h-4 w-px bg-gray-800 mx-2"></div>
                <Link to="/login" className="px-4 py-1 text-sm font-bold bg-green-600 text-black hover:bg-white transition-colors uppercase">
                  :: Login
                </Link>
                <Link to="/register" className="px-4 py-1 text-sm text-green-500 border border-green-500 hover:bg-green-500 hover:text-black transition-all uppercase">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-green-500 hover:text-white focus:outline-none p-2 border border-transparent hover:border-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (Collapsible) */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-800 bg-[#0a0a0a]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>_HOME_DIR</MobileNavLink>
            
            {user ? (
              // LOGGED IN MOBILE ITEMS
              <>
                <MobileNavLink to="/dashboard" onClick={() => setIsOpen(false)}>_DASHBOARD</MobileNavLink>
                <MobileNavLink to="/search" onClick={() => setIsOpen(false)}>_SEARCH_DB</MobileNavLink>
                <MobileNavLink to="/requests" onClick={() => setIsOpen(false)}>_INCOMING_REQS</MobileNavLink>
                <MobileNavLink to="/chat" onClick={() => setIsOpen(false)}>_COMM_CHANNEL</MobileNavLink>
                <MobileNavLink to="/profile" onClick={() => setIsOpen(false)}>_USER_PROFILE</MobileNavLink>
                <button 
                  onClick={() => { logout(); setIsOpen(false); }} 
                  className="block w-full text-left px-3 py-2 text-red-500 hover:bg-red-900/20 hover:text-red-400 border-l-2 border-transparent hover:border-red-500 transition-all font-mono"
                >
                  ! SYSTEM_LOGOUT
                </button>
              </>
            ) : (
              // LOGGED OUT MOBILE ITEMS
              <div className="grid grid-cols-2 gap-2 mt-4 border-t border-gray-800 pt-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-2 bg-green-600 text-black font-bold uppercase hover:bg-white">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="text-center py-2 border border-green-500 text-green-500 uppercase hover:bg-green-500 hover:text-black">
                  Register
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
    className={`px-3 py-2 text-sm font-medium transition-colors uppercase tracking-wide
      ${active 
        ? "bg-green-500/10 text-green-400 border-b-2 border-green-500" 
        : "text-gray-400 hover:text-green-500 hover:bg-gray-900"
      }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-3 py-3 text-base font-medium text-gray-400 hover:text-green-400 hover:bg-gray-900 border-l-2 border-transparent hover:border-green-500 transition-all uppercase"
  >
    {children}
  </Link>
);

export default Navbar;