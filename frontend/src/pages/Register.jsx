import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="auth-input"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="auth-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="auth-input"
        />

        {/* USER TYPE */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="auth-input"
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleRegister} className="auth-button">
          Register
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>

      </div>
    </div>
  );
}

export default Register;