import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  FaChartBar, FaBoxOpen, FaShoppingBag, FaUsers, FaTags, 
  FaImage, FaUser, FaSignOutAlt, FaBars, FaWarehouse, FaThLarge 
} from "react-icons/fa";

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaThLarge /> },
    { name: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Orders", path: "/admin/orders", icon: <FaShoppingBag /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Categories", path: "/admin/categories", icon: <FaTags /> },
    { name: "Inventory", path: "/admin/inventory", icon: <FaWarehouse /> },
    { name: "Banners", path: "/admin/banners", icon: <FaImage /> },
    { name: "Analytics", path: "/admin/analytics", icon: <FaChartBar /> },
    { name: "Profile", path: "/admin/profile", icon: <FaUser /> }
  ];

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  return (
    <div className="admin-layout-wrapper">
      <style>{`
        .admin-layout-wrapper {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: #f8fafc; /* Slate 50 */
          font-family: system-ui, -apple-system, sans-serif;
          color: #1e293b; /* Slate 800 */
        }

        /* Sidebar Styling */
        .admin-sidebar {
          width: 260px;
          background-color: #ffffff; /* White sidebar */
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          z-index: 100;
          height: 100%;
        }
        .admin-sidebar.collapsed {
          width: 70px;
        }

        /* Sidebar Header */
        .sidebar-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          color: #1e293b;
          overflow: hidden;
          white-space: nowrap;
        }
        .sidebar-logo {
          font-size: 1.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-decoration: none;
        }
        .toggle-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .toggle-btn:hover {
          color: #0f172a;
          background-color: #f1f5f9;
        }

        /* Nav List */
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: #475569; /* Slate 600 */
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
          white-space: nowrap;
          overflow: hidden;
          font-weight: 500;
        }
        .nav-item:hover, .nav-item.active {
          color: #4f46e5; /* Indigo */
          background-color: #f1f5f9; /* Slate 100 */
        }
        .nav-item.active {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%);
          border-left: 3px solid #4f46e5;
          color: #4f46e5;
        }
        .nav-item-icon {
          font-size: 1.15rem;
          min-width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          padding: 1rem 0.5rem;
          border-top: 1px solid #e2e8f0;
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: #ef4444;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          border-radius: 8px;
          font-size: inherit;
          transition: background-color 0.2s;
          font-weight: 500;
        }
        .logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.08);
        }

        /* Main Content Container */
        .admin-main-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Header / Top bar */
        .admin-header {
          height: 64px;
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          color: #1e293b;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .header-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .admin-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }

        /* Body container */
        .admin-content-body {
          flex: 1;
          overflow-y: auto;
          background-color: #f8fafc;
          padding: 1.5rem;
        }

        /* Mobile Adjustments */
        .mobile-menu-toggle {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block;
            background: none;
            border: none;
            color: #1e293b;
            font-size: 1.5rem;
            cursor: pointer;
          }
          .admin-sidebar {
            position: absolute;
            left: -260px;
            width: 260px;
            transition: left 0.3s ease;
            box-shadow: 4px 0 10px rgba(0,0,0,0.05);
          }
          .admin-sidebar.mobile-open {
            left: 0;
          }
          .admin-sidebar.collapsed {
            width: 260px; /* ignore collapse on mobile, just overlay */
          }
          .sidebar-header .toggle-btn {
            display: none;
          }
        }
      `}</style>

      {/* Sidebar navigation */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          {!collapsed && <Link to="/admin/dashboard" className="sidebar-logo">Shop EZ Admin</Link>}
          <button onClick={toggleSidebar} className="toggle-btn">
            <FaBars />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            <span className="nav-item-icon"><FaSignOutAlt /></span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main dashboard content container */}
      <div className="admin-main-container">
        <header className="admin-header">
          <div className="header-left">
            <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
              <FaBars />
            </button>
            <span className="header-title">Control Panel</span>
          </div>

          <div className="header-right">
            <div className="admin-info">
              <span className="admin-avatar">{user?.username ? user.username[0].toUpperCase() : "A"}</span>
              <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>{user?.email}</span>
            </div>
          </div>
        </header>

        <main className="admin-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
