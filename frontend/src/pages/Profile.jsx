import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../utils/api";
import "../styles/main.css";

function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        const { username, email, phone, address } = res.data;
        setForm((f) => ({ ...f, username, email, phone: phone || "", address: address || "" }));
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        username: form.username,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };
      if (form.password) payload.password = form.password;

      const res = await API.put("/auth/profile", payload);

      // Update localStorage with new info
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, username: res.data.username, email: res.data.email }));

      setMessage({ type: "success", text: "Profile updated successfully! ✅" });
      setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-page"><h2>Loading Profile...</h2></div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {form.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <h2>{form.username}</h2>
            <p className="profile-email-display">{form.email}</p>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Edit Profile</h2>

            {message && (
              <div className={`profile-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Your name" required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your email" required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} placeholder="Your delivery address" rows={3} />
            </div>

            <hr style={{ margin: "20px 0", border: 0, borderTop: "1px solid #e5e7eb" }} />
            <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "12px" }}>
              Leave password fields blank to keep your current password.
            </p>

            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New password" />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm new password" />
            </div>

            <button type="submit" className="save-profile-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc, #ede9fe);
          padding: 50px 5%;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }
        .profile-container {
          display: flex;
          gap: 40px;
          max-width: 900px;
          width: 100%;
          flex-wrap: wrap;
        }
        .profile-avatar {
          flex: 0 0 220px;
          background: white;
          border-radius: 20px;
          padding: 30px 20px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.07);
          height: fit-content;
        }
        .avatar-circle {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6c63ff, #a855f7);
          color: white;
          font-size: 2.2rem;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 15px;
        }
        .profile-avatar h2 { color: #111827; font-size: 1.2rem; margin-bottom: 5px; }
        .profile-email-display { font-size: 0.85rem; color: #9ca3af; }
        .profile-form {
          flex: 1;
          background: white;
          border-radius: 20px;
          padding: 35px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.07);
          min-width: 300px;
        }
        .form-title { font-size: 1.8rem; font-weight: 700; color: #111827; margin-bottom: 25px; }
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; font-weight: 600; color: #374151; margin-bottom: 6px; font-size: 0.9rem; }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .form-group input:focus, .form-group textarea:focus { border-color: #6c63ff; }
        .save-profile-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #6c63ff, #a855f7);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s;
          margin-top: 10px;
        }
        .save-profile-btn:hover { opacity: 0.88; }
        .save-profile-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .profile-message {
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 18px;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .profile-message.success { background: #d1fae5; color: #065f46; }
        .profile-message.error { background: #fee2e2; color: #991b1b; }
      `}</style>
    </>
  );
}

export default Profile;
