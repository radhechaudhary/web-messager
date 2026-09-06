import {useState, useEffect} from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Docs from "./pages/Docs"
import ProtectedRoute from "./components/ProtectedRoute"
import DashboardLayout from "./layouts/DashboardLayout"
import axios from "axios"
import {useNavigate} from "react-router-dom"

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //     axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verify`, { withCredentials: true })
  //     .then((response) => {
  //       setUser(response.data.user);
  //       navigate("/dashboard");
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user:", error);
  //       setUser(null);
  //     });
  // },[]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* <Route element={<ProtectedRoute />}> */}
          <Route element={<DashboardLayout user={user} />}>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/docs" element={<Docs />} />
          {/* </Route> */}
        </Route>

        {/* <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} /> */}
      </Routes>
    </div>
  )
}
export default App
