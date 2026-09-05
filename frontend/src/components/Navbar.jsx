import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/useAuth";

const linkClass = ({ isActive }) =>
  `text-sm font-medium px-3 py-2 rounded-md transition-colors ${
    isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:text-slate-900"
  }`;

const Navbar = () => {
  // const { user, logout } = useAuth();
  const user = { name: "John Doe" }; // Mock user for demonstration
  const navigate = useNavigate();

  const handleLogout = () => {
    // logout();
    navigate("/login");
  };

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
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-slate-500">{user.name}</span>}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
