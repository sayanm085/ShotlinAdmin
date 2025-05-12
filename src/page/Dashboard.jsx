import React, { useState, useMemo, useEffect, useRef } from "react";
import { Outlet, NavLink } from "react-router";
import {
  ChartPie ,
  Video ,
  BookUser,
  Contact,
  PackageSearch,
  PencilRuler,
  LogOut,
  Menu,
  CirclePercent,
  PackagePlus,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";

// Single menu item, showing icon + optional label
const MenuItem = React.memo(({ icon, label, to, onClick, isCollapsed }) => {
  const getClassName = useMemo(() => {
    return ({ isActive }) => {
      return `flex items-center justify-start gap-3 py-2 px-3 rounded-md cursor-pointer transition-colors ${
        isActive
          ? "bg-blue-200 text-black"
          : "text-gray-700 hover:bg-gray-100 hover:text-black"
      }`;
    };
  }, []);

  return (
    <NavLink to={to} className={getClassName} onClick={onClick}>
      {icon}
      {!isCollapsed && <span className="font-medium">{label}</span>}
    </NavLink>
  );
});

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile open/close
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse/expand
  const sidebarRef = useRef(null);

  // Nav items with icons
  const navItems = useMemo(
    () => [
      { icon: <ChartPie size={24} />, label: "Overview", to: "/" },
      { icon: <Video size={24} />, label: "Meeting", to: "/dashboard/meeting" },
      { icon: <BookUser size={24} />, label: "Customers", to: "/dashboard/customerslist" },
      { icon: <PackageSearch size={24} />, label: "Services", to: "/dashboard/serviceslist" },
      { icon: <PackagePlus size={24} />, label: "Services Upload", to: "/dashboard/servicesupload" },
      { icon: <Contact size={24} />, label: "contactrequests", to: "/dashboard/contactrequests" }, 
      { icon: <PencilRuler size={24} />,label: "WebContent Edit",to: "/dashboard/webcontentedit",},
      { icon: <CalendarCheck size={24} />, label: "Quotation Manager", to: "/dashboard/quotationmanager" },
      { icon: <CirclePercent size={24} />, label: "Financial Calculator", to: "/dashboard/financialcalculator" },
      

    ],
    []
  );

  // Close sidebar (mobile) when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#f0f0f0_100%)] text-black">
      {/* MOBILE TOP BAR */}
      <div className="flex items-center justify-between p-4 sm:hidden">
        <NavLink to="/" className="text-xl font-bold text-black">
          Shotlin
        </NavLink>
        <button
          className="text-black"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu size={36} />
        </button>
      </div>

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-200 bg-opacity-50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        ref={sidebarRef}
        className={`
          fixed sm:sticky top-0 left-0 z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0
          ${sidebarCollapsed ? "sm:w-24" : "sm:w-64"}
          w-full h-full sm:h-screen
          flex-shrink-0 py-4 px-2 sm:py-8 sm:px-6
          border-y-0 border-l-0
          transition-transform duration-300
        `}
        style={{
          background: "white",
          borderColor: "rgb(220, 220, 220)",
        }}
      >
        {/* Desktop Sidebar Header */}
        <div className="hidden sm:block mb-8">
          {sidebarCollapsed ? (
            // Collapsed state: "S" centered, arrow at far right
            <div className="relative flex items-center h-10">
              {/* 'S' in the horizontal center */}
              <NavLink to="/" className="text-2xl font-bold text-black mx-auto">
                S
              </NavLink>
              {/* Toggle arrow at the far right, vertically centered */}
              <button
                onClick={() => setSidebarCollapsed(false)}
                aria-label="Expand sidebar"
                className="text-gray-700 hover:text-black p-1 absolute -right-6 top-1/2 -translate-y-1/2"
              >
                <ChevronRight size={25} />
              </button>
            </div>
          ) : (
            // Expanded state: 'SHOTLIN' left, arrow on the right
            <div className="flex justify-between items-center h-10">
              <NavLink to="/" className="text-2xl font-bold text-black">
                SHOTLIN
              </NavLink>
              <button
                onClick={() => setSidebarCollapsed(true)}
                aria-label="Collapse sidebar"
                className="text-gray-700 hover:text-black p-1"
              >
                <ChevronLeft size={25} />
              </button>
            </div>
          )}
        </div>

        {/* MOBILE CLOSE BUTTON */}
        <div className="flex justify-between items-center sm:hidden mb-4 px-2">
          <NavLink to="/" className="text-2xl font-bold text-black">
            Shotlin
          </NavLink>
          <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={36} className="text-black" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-4">
          {navItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              isCollapsed={sidebarCollapsed}
            />
          ))}
          <div className="mt-auto pt-8">
            <MenuItem
              icon={<LogOut size={24} />}
              label="Sign Out"
              to="/sign-out"
              onClick={() => setSidebarOpen(false)}
              isCollapsed={sidebarCollapsed}
            />
          </div>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Outlet />
      </div>
    </div>
  );
}
