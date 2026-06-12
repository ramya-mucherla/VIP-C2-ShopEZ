import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (user && token && user.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password });
      const user = response.data.user;

      if (user.role !== "admin") {
        setError("Access denied. You do not have administrator privileges.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <style>{`
        .admin-login-wrapper {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0f172a;
          font-family: system-ui, sans-serif;
        }
        .admin-login-card {
          width: 100%;
          max-width: 400px;
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 1rem;
          padding: 2.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          color: white;
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-logo {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }
        .login-subtitle {
          color: #94a3b8;
          font-size: 0.9rem;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-label {
          display: block;
          font-size: 0.875rem;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
        }
        .form-input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 14px;
          background-color: #0f172a;
          border: 1px solid #475569;
          border-radius: 6px;
          color: white;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #6366f1;
        }
        .error-banner {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }
        .login-submit {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border: none;
          color: white;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: opacity 0.2s;
        }
        .login-submit:hover {
          opacity: 0.9;
        }
        .login-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="admin-login-card">
        <div className="login-header">
          <div className="login-logo">Shop EZ Admin</div>
          <div className="login-subtitle">Sign in to control dashboard</div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="admin@shopez.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
