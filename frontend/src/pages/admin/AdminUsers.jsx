import { useState, useEffect } from "react";
import { FaTrash, FaSearch } from "react-icons/fa";
import API from "../../utils/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = async () => {
    try {
      const response = await API.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, username) => {
    if (currentUser?._id === id) {
      alert("You cannot delete your own logged-in admin account!");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user account "${username}"?`)) return;

    try {
      await API.delete(`/admin/users/${id}`);
      alert("User account removed successfully!");
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) => {
    return u.username.toLowerCase().includes(search.toLowerCase()) || 
           u.email.toLowerCase().includes(search.toLowerCase()) ||
           u.role.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return <div style={{ color: "#94a3b8", textAlign: "center", padding: "3rem" }}><h2>Loading user directory...</h2></div>;
  }

  return (
    <div className="admin-users-wrapper">
      <style>{`
        .admin-users-wrapper {
          color: #334155;
        }
        .users-header {
          margin-bottom: 2rem;
        }
        .users-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: #0f172a;
        }
        .users-header p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0.5rem 0 0 0;
        }

        /* Search Bar */
        .search-container {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          position: relative;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .search-icon {
          position: absolute;
          left: 24px;
          color: #64748b;
        }
        .search-field {
          width: 100%;
          padding: 10px 14px 10px 38px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          color: #1e293b;
          font-size: 0.95rem;
        }
        .search-field:focus {
          outline: none;
          border-color: #6366f1;
        }

        .users-table-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .table-responsive {
          overflow-x: auto;
        }
        .users-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .users-table th {
          color: #64748b;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
        }
        .users-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
          vertical-align: middle;
          font-size: 0.95rem;
        }
        .users-table tr:hover td {
          background-color: #f8fafc;
        }
        .users-table tr:last-child td {
          border-bottom: none;
        }

        .user-name-meta {
          font-weight: 600;
          color: #0f172a;
        }
        .role-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .role-badge.admin {
          background-color: rgba(236, 72, 153, 0.1);
          color: #db2777;
        }
        .role-badge.customer {
          background-color: rgba(99, 102, 241, 0.1);
          color: #4f46e5;
        }

        .delete-btn {
          background: none;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .delete-btn:hover {
          color: white;
          background-color: #ef4444;
        }
        .delete-btn:disabled {
          opacity: 0.3;
          border-color: #cbd5e1;
          color: #94a3b8;
          cursor: not-allowed;
        }
      `}</style>

      <div className="users-header">
        <h1>Users Management</h1>
        <p>Monitor registered users, manage roles, and review accounts</p>
      </div>

      {/* Search Input Box */}
      <div className="search-container">
        <span className="search-icon"><FaSearch /></span>
        <input 
          type="text" 
          placeholder="Search users by name, email, or role..." 
          className="search-field"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users table */}
      <div className="users-table-card">
        <div className="table-responsive">
          {filteredUsers.length === 0 ? (
            <p style={{ textAlign: "center", margin: "2rem 0", color: "#94a3b8" }}>No users found matching the search criteria.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <span className="user-name-meta">{user.username}</span>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      {new Date(user.createdAt || Date.now()).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(user._id, user.username)}
                        disabled={currentUser?._id === user._id}
                        title={currentUser?._id === user._id ? "You cannot delete yourself" : "Delete account"}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
