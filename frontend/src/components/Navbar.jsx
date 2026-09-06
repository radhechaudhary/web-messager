import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/useAuth";
import axios from "axios";

const linkClass = ({ isActive }) =>
  `text-sm font-medium px-3 py-2 rounded-md transition-colors ${
    isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:text-slate-900"
  }`;

const Navbar = ({user}) => {
  // const { user, logout } = useAuth();
 // Mock user for demonstration
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, { withCredentials: true })
    navigate("/login");
  };

  const initial = user?.name?.[0]?.toUpperCase() || "?";

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-slate-800 mr-4">Message Service</span>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/docs" className={linkClass}>
            Docs
          </NavLink>
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1 hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-semibold">
              {initial}
            </span>
            {user && <span className="text-sm font-medium text-slate-700">{user.name}</span>}
            <span
              className={`text-slate-400 text-xs transition-transform ${profileOpen ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-800 truncate">{user?.name || "Account"}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
