import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar/Navbar";

export function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
