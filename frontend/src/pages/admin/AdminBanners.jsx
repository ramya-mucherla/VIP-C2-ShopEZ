import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaUndo, FaSave } from "react-icons/fa";
import API from "../../utils/api";

function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [active, setActive] = useState(true);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBanners = async () => {
    try {
      const response = await API.get("/banners");
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image) return;
    setSaving(true);

    const bannerData = { title, image, linkUrl, active };

    try {
      if (editId) {
        const response = await API.put(`/banners/${editId}`, bannerData);
        setBanners(banners.map((b) => (b._id === editId ? response.data : b)));
        alert("Banner updated successfully!");
      } else {
        const response = await API.post("/banners", bannerData);
        setBanners([...banners, response.data]);
        alert("Banner created successfully!");
      }
      handleCancelEdit();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (banner) => {
    setEditId(banner._id);
    setTitle(banner.title);
    setImage(banner.image);
    setLinkUrl(banner.linkUrl || "");
    setActive(banner.active !== undefined ? banner.active : true);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setTitle("");
    setImage("");
    setLinkUrl("");
    setActive(true);
  };

  const handleDelete = async (id, bTitle) => {
    if (!window.confirm(`Are you sure you want to delete banner "${bTitle}"?`)) return;

    try {
      await API.delete(`/banners/${id}`);
      setBanners(banners.filter((b) => b._id !== id));
      alert("Banner deleted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete banner");
    }
  };

  if (loading) {
    return <div style={{ color: "#94a3b8", textAlign: "center", padding: "3rem" }}><h2>Loading banners catalog...</h2></div>;
  }

  return (
    <div className="admin-banners-wrapper">
      <style>{`
        .admin-banners-wrapper {
          color: #334155;
        }
        .banners-header {
          margin-bottom: 2rem;
        }
        .banners-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: #0f172a;
        }
        .banners-header p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0.5rem 0 0 0;
        }

        .banners-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }
        @media (max-width: 992px) {
          .banners-grid {
            grid-template-columns: 1fr;
          }
        }

        .banner-card {
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 1.5rem;
          height: fit-content;
        }
        .banner-card-title {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #334155;
          color: white;
        }

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

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .form-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #6366f1;
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 1.5rem;
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

        /* Banner items display */
        .banners-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .banner-item {
          background-color: #0f172a;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }
        .banner-preview-img {
          width: 120px;
          height: 70px;
          border-radius: 6px;
          object-fit: cover;
          border: 1px solid #475569;
        }
        .banner-info {
          flex: 1;
        }
        .banner-info-title {
          font-weight: 600;
          color: white;
          font-size: 1rem;
          margin-bottom: 4px;
        }
        .banner-info-link {
          font-size: 0.8rem;
          color: #94a3b8;
          word-break: break-all;
        }
        .status-badge {
          display: inline-block;
          font-size: 0.75rem;
          padding: 3px 6px;
          border-radius: 4px;
          font-weight: 600;
          margin-top: 6px;
        }
        .status-badge.active {
          background-color: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }
        .status-badge.inactive {
          background-color: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }

        .actions-cell {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .action-icon-btn {
          background: none;
          border: 1px solid #475569;
          color: #cbd5e1;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
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

      <div className="banners-header">
        <h1>Banner Management</h1>
        <p>Configure dynamic slider images and promotional messages for the home page header</p>
      </div>

      <div className="banners-grid">
        {/* Left Side: Create / Update Banner */}
        <div className="banner-card">
          <h3 className="banner-card-title">{editId ? "Modify Banner Slider" : "Upload Banner"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Banner Title *</label>
              <input 
                type="text"
                className="form-input-text"
                placeholder="e.g. Summer Clearance Sale"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Banner Image URL *</label>
              <input 
                type="text"
                className="form-input-text"
                placeholder="e.g. https://domain.com/slider.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Destination Link URL</label>
              <input 
                type="text"
                className="form-input-text"
                placeholder="e.g. /products or external links"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input 
                  type="checkbox"
                  id="active"
                  className="form-checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                <label htmlFor="active" style={{ cursor: "pointer" }}>Active Slider (visible to users)</label>
              </div>
            </div>

            <div className="form-actions">
              {editId && (
                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                  <FaUndo /> Cancel
                </button>
              )}
              <button type="submit" className="save-btn" disabled={saving}>
                <FaSave /> {saving ? "Saving..." : (editId ? "Update Banner" : "Publish Banner")}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Active banners list */}
        <div className="banner-card" style={{ flex: 1 }}>
          <h3 className="banner-card-title">Live Slide Deck</h3>
          <div className="banners-list">
            {banners.length === 0 ? (
              <p style={{ margin: 0, color: "#cbd5e1" }}>No slider banners created. Adding one will update the storefront home page.</p>
            ) : (
              banners.map((b) => (
                <div className="banner-item" key={b._id}>
                  <img src={b.image} alt={b.title} className="banner-preview-img" />
                  
                  <div className="banner-info">
                    <div className="banner-info-title">{b.title}</div>
                    <div className="banner-info-link">Redirect Link: {b.linkUrl || "None"}</div>
                    <div>
                      <span className={`status-badge ${b.active ? "active" : "inactive"}`}>
                        {b.active ? "Visible" : "Hidden"}
                      </span>
                    </div>
                  </div>

                  <div className="actions-cell">
                    <button 
                      className="action-icon-btn edit-btn"
                      onClick={() => handleEdit(b)}
                      title="Edit banner"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-icon-btn delete-btn"
                      onClick={() => handleDelete(b._id, b.title)}
                      title="Delete banner"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBanners;
