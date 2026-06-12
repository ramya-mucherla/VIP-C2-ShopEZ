import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">

        <div className="logo-container">
          <Logo />
        </div>

        <div className="nav-links">

          {/* ALWAYS VISIBLE LINKS */}
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/order">Order</Link>
          {user?.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}

          {/* 🔐 AUTH LOGIC */}
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              {/* show user */}
              <div className="user-info">
  <span className="user-email">{user.email}</span>

  <span className={`user-role ${user.role}`}>
    {user.role}
  </span>
</div>

              <button
                onClick={logout}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;