import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardLayout = () => (
  <div className="min-h-screen bg-slate-100">
    <Navbar />
    <main className="max-w-5xl mx-auto px-4 py-8">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
