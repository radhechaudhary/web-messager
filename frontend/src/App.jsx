import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Docs from "./pages/Docs"
import ProtectedRoute from "./components/ProtectedRoute"
import DashboardLayout from "./layouts/DashboardLayout"

const App = () => {

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* <Route element={<ProtectedRoute />}> */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/docs" element={<Docs />} />
          {/* </Route> */}
        </Route>

        {/* <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} /> */}
      </Routes>
    </div>
  )
}
export default App
