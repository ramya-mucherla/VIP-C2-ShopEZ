import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaUndo, FaSave } from "react-icons/fa";
import API from "../../utils/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null); // id of category being edited
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await API.get("/admin/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    try {
      if (editId) {
        // Edit Mode
        const response = await API.put(`/admin/categories/${editId}`, { name, description });
        setCategories(categories.map((cat) => (cat._id === editId ? response.data : cat)));
        alert("Category updated successfully!");
      } else {
        // Add Mode
        const response = await API.post("/admin/categories", { name, description });
        setCategories([...categories, response.data]);
        alert("Category added successfully!");
      }
      handleCancelEdit();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setName(category.name);
    setDescription(category.description || "");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setName("");
    setDescription("");
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      await API.delete(`/admin/categories/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
      alert("Category deleted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  if (loading) {
    return <div style={{ color: "#94a3b8", textAlign: "center", padding: "3rem" }}><h2>Loading categories...</h2></div>;
  }

  return (
    <div className="admin-categories-wrapper">
      <style>{`
        .admin-categories-wrapper {
          color: #334155;
        }
        .categories-header {
          margin-bottom: 2rem;
        }
        .categories-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: #0f172a;
        }
        .categories-header p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0.5rem 0 0 0;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }
        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }
        }

        .category-card {
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 1.5rem;
          height: fit-content;
        }
        .category-card-title {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #334155;
          color: white;
        }

        /* Form Details */
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-label {
          display: block;
          font-size: 0.85rem;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .form-input-text {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px;
          background-color: #0f172a;
          border: 1px solid #334155;
          border-radius: 6px;
          color: white;
          font-size: 0.95rem;
        }
        .form-input-text:focus {
          outline: none;
          border-color: #6366f1;
        }
        .form-textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px;
          background-color: #0f172a;
          border: 1px solid #334155;
          border-radius: 6px;
          color: white;
          font-size: 0.95rem;
          min-height: 80px;
          resize: vertical;
        }
        .form-textarea:focus {
          outline: none;
          border-color: #6366f1;
        }

        /* Action Buttons */
        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        .save-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border: none;
          color: white;
          padding: 10px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .cancel-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: #334155;
          border: 1px solid #475569;
          color: #cbd5e1;
          padding: 10px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
        }

        /* Table */
        .categories-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .categories-table th {
          color: #94a3b8;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 10px 14px;
          border-bottom: 1px solid #334155;
          font-weight: 600;
        }
        .categories-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #334155;
          color: #cbd5e1;
        }
        .categories-table tr:hover td {
          background-color: rgba(51, 65, 85, 0.2);
        }
        .categories-table tr:last-child td {
          border-bottom: none;
        }

        .cat-name {
          font-weight: 600;
          color: white;
        }
        .actions-cell {
          display: flex;
          gap: 8px;
        }
        .action-icon-btn {
          background: none;
          border: 1px solid #475569;
          color: #cbd5e1;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-icon-btn:hover {
          color: white;
          background-color: #334155;
        }
        .action-icon-btn.edit-btn:hover {
          border-color: #6366f1;
          color: #818cf8;
        }
        .action-icon-btn.delete-btn:hover {
          border-color: #ef4444;
          color: #f87171;
        }
      `}</style>

      <div className="categories-header">
        <h1>Category Management</h1>
        <p>Define product divisions (Electronics, Fashion, Sports, etc.) and configure catalogs</p>
      </div>

      <div className="categories-grid">
        {/* Left Side: Create/Edit Form */}
        <div className="category-card">
          <h3 className="category-card-title">{editId ? "Modify Category" : "Add New Category"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input 
                type="text"
                className="form-input-text"
                placeholder="e.g. Furniture"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-textarea"
                placeholder="Brief description of products in category"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-actions">
              {editId && (
                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                  <FaUndo /> Cancel
                </button>
              )}
              <button type="submit" className="save-btn" disabled={saving}>
                <FaSave /> {saving ? "Saving..." : (editId ? "Update" : "Add")}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Categories Table */}
        <div className="category-card" style={{ flex: 1 }}>
          <h3 className="category-card-title">Registered Categories</h3>
          <div style={{ overflowX: "auto" }}>
            {categories.length === 0 ? (
              <p style={{ margin: "1rem 0", color: "#cbd5e1" }}>No categories created yet.</p>
            ) : (
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        <span className="cat-name">{cat.name}</span>
                      </td>
                      <td>{cat.description || <span style={{ color: "#64748b", fontSize: "0.85rem" }}>No description</span>}</td>
                      <td>
                        <div className="actions-cell">
                          <button 
                            className="action-icon-btn edit-btn"
                            onClick={() => handleEdit(cat)}
                            title="Edit Category"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="action-icon-btn delete-btn"
                            onClick={() => handleDelete(cat._id, cat.name)}
                            title="Delete Category"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;
