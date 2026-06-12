import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import API from "../utils/api";

function Login() {
  const navigate = useNavigate();

  // ✅ store input values
  const [form, setForm] = useState({
    email: "",
    password: "",
    role:"customer"
  });

  // ✅ handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔐 LOGIN FUNCTION (STEP 3)
  const handleLogin = async () => {
    try {
      const response = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const user = response.data.user;
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
  <div className="auth-container">

    <div className="auth-card">

      <h2 className="auth-title">Welcome Back 👋</h2>
      <p className="auth-subtitle">Login to continue shopping</p>

      {/* EMAIL */}
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
        className="auth-input"
      />

      {/* PASSWORD */}
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={handleChange}
        className="auth-input"
      />
      <select
  name="role"
  value={form.role}
  onChange={handleChange}
  className="auth-input"
>
  <option value="customer">Customer</option>
  <option value="admin">Admin</option>
</select>

      {/* LOGIN BUTTON */}
      <button onClick={handleLogin} className="auth-button">
        Login
      </button>

      <p className="auth-footer">
        New user? <span onClick={() => navigate("/register")}>Create account</span>
      </p>

    </div>

  </div>
);
}

export default Login;