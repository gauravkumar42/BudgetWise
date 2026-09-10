import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/transactions", label: "Transactions", icon: "receipt_long" },
  { to: "/budgets", label: "Budgets", icon: "pie_chart" },
  { to: "/advisor", label: "AI Advisor", icon: "auto_awesome" },
  { to: "/reports", label: "Reports", icon: "bar_chart" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeDrawer = () => setOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="btn-icon" onClick={() => setOpen(true)} aria-label="Open menu">
          <span className="material-icons-round">menu</span>
        </button>
        <div className="mobile-brand">
          <span className="brand-mark">₹</span>
          <span>BudgetWise</span>
        </div>
        <div className="mobile-avatar" style={{ background: user?.avatarColor || "#4F46E5" }}>
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
      </div>

      {/* Drawer overlay for mobile/tablet */}
      {open && <div className="drawer-overlay" onClick={closeDrawer}></div>}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-mark">₹</span>
            <span className="brand-text">BudgetWise</span>
          </div>
          <button className="btn-icon sidebar-close" onClick={closeDrawer} aria-label="Close menu">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeDrawer}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <span className="material-icons-round">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="mobile-avatar" style={{ background: user?.avatarColor || "#4F46E5" }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="sidebar-user-info">
              <strong>{user?.name || "User"}</strong>
              <small>{user?.email}</small>
            </div>
          </div>
          <button className="btn-icon" onClick={logout} title="Logout" aria-label="Logout">
            <span className="material-icons-round">logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav for fast thumb access */}
      <nav className="bottom-nav">
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `bottom-nav-link ${isActive ? "active" : ""}`}
          >
            <span className="material-icons-round">{item.icon}</span>
            <span>{item.label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
