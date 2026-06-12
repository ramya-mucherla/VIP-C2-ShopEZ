import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaChevronLeft, FaSave, FaUndo } from "react-icons/fa";
import API from "../../utils/api";

const initialFormState = {
  name: "",
  description: "",
  category: "General",
  brand: "",
  price: "",
  discount: "",
  countInStock: "",
  image: "",
  imagesInput: "", // comma separated
  sizesInput: "",  // comma separated e.g. S, M, L, XL
  gender: "Unisex",
  featured: false,
};

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [form, setForm] = useState(initialFormState);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load categories list
        const catRes = await API.get("/admin/categories");
        setCategories(catRes.data);

        if (isEditMode) {
          // Load existing product
          const prodRes = await API.get(`/products/${id}`);
          const p = prodRes.data;
          setForm({
            name: p.name,
            description: p.description || "",
            category: p.category || "General",
            brand: p.brand || "",
            price: p.price,
            discount: p.discount || 0,
            countInStock: p.countInStock,
            image: p.image,
            imagesInput: p.images ? p.images.join(", ") : "",
            sizesInput: p.sizes ? p.sizes.join(", ") : "",
            gender: p.gender || "Unisex",
            featured: !!p.featured,
          });
        }
      } catch (error) {
        console.error("Error loading product form data:", error);
        alert("Failed to load page data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to reset the form?")) {
      setForm(initialFormState);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Parse comma-separated inputs
    const parsedImages = form.imagesInput
      ? form.imagesInput.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const parsedSizes = form.sizesInput
      ? form.sizesInput.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const productData = {
      name: form.name,
      description: form.description,
      category: form.category,
      brand: form.brand,
      price: Number(form.price),
      discount: Number(form.discount || 0),
      countInStock: Number(form.countInStock || 0),
      image: form.image,
      images: parsedImages,
      sizes: parsedSizes,
      gender: form.gender,
      featured: form.featured,
    };

    try {
      if (isEditMode) {
        await API.put(`/admin/products/${id}`, productData);
        alert("Product updated successfully!");
      } else {
        await API.post("/admin/products", productData);
        alert("Product added successfully!");
      }
      navigate("/admin/products");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save product details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: "#94a3b8", textAlign: "center", padding: "3rem" }}><h2>Loading form details...</h2></div>;
  }

  return (
    <div className="product-form-wrapper">
      <style>{`
        .product-form-wrapper {
          color: #334155;
        }
        .form-back-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 2rem;
        }
        .back-link {
          color: #64748b;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .back-link:hover {
          color: #0f172a;
        }
        .form-back-header h1 {
          font-size: 1.85rem;
          font-weight: 700;
          margin: 0;
          color: #0f172a;
        }

        .form-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 2.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-field-group {
          margin-bottom: 1.25rem;
        }
        .form-field-group.full-width {
          grid-column: 1 / -1;
        }
        .form-label {
          display: block;
          font-size: 0.875rem;
          color: #334155;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .form-input-text {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 14px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          color: #1e293b;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }
        .form-input-text:focus {
          outline: none;
          border-color: #6366f1;
        }
        .form-textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 14px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          color: #1e293b;
          font-size: 0.95rem;
          min-height: 100px;
          resize: vertical;
        }
        .form-textarea:focus {
          outline: none;
          border-color: #6366f1;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 1.75rem;
        }
        .form-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #6366f1;
          cursor: pointer;
        }

        /* Buttons bar */
        .form-actions-bar {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .action-submit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border: none;
          color: white;
          padding: 12px 22px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .action-submit-btn:hover {
          opacity: 0.9;
        }
        .action-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .action-reset-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          padding: 12px 22px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .action-reset-btn:hover {
          background-color: #e2e8f0;
          color: #0f172a;
        }
      `}</style>

      <div className="form-back-header">
        <Link to="/admin/products" className="back-link">
          <FaChevronLeft /> Back to products
        </Link>
        <h1>{isEditMode ? "Edit Product" : "Add Product"}</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Product Name */}
            <div className="form-field-group">
              <label className="form-label">Product Name *</label>
              <input 
                type="text" 
                name="name"
                className="form-input-text"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Brand */}
            <div className="form-field-group">
              <label className="form-label">Brand</label>
              <input 
                type="text" 
                name="brand"
                className="form-input-text"
                placeholder="Enter brand name"
                value={form.brand}
                onChange={handleChange}
              />
            </div>

            {/* Category */}
            <div className="form-field-group">
              <label className="form-label">Category *</label>
              <select 
                name="category"
                className="form-input-text"
                value={form.category}
                onChange={handleChange}
              >
                <option value="General">General</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div className="form-field-group">
              <label className="form-label">Gender target</label>
              <select 
                name="gender"
                className="form-input-text"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="Unisex">Unisex</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>

            {/* Price */}
            <div className="form-field-group">
              <label className="form-label">Price (₹) *</label>
              <input 
                type="number" 
                name="price"
                className="form-input-text"
                placeholder="Price value"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Discount */}
            <div className="form-field-group">
              <label className="form-label">Discount (%)</label>
              <input 
                type="number" 
                name="discount"
                className="form-input-text"
                placeholder="e.g. 10 for 10% off"
                value={form.discount}
                onChange={handleChange}
              />
            </div>

            {/* Stock Quantity */}
            <div className="form-field-group">
              <label className="form-label">Stock Quantity *</label>
              <input 
                type="number" 
                name="countInStock"
                className="form-input-text"
                placeholder="Available items count"
                value={form.countInStock}
                onChange={handleChange}
                required
              />
            </div>

            {/* Sizes */}
            <div className="form-field-group">
              <label className="form-label">Sizes (comma-separated)</label>
              <input 
                type="text" 
                name="sizesInput"
                className="form-input-text"
                placeholder="e.g. S, M, L, XL"
                value={form.sizesInput}
                onChange={handleChange}
              />
            </div>

            {/* Thumbnail Image */}
            <div className="form-field-group full-width">
              <label className="form-label">Thumbnail Image URL *</label>
              <input 
                type="text" 
                name="image"
                className="form-input-text"
                placeholder="e.g. /images/iphone 15.jpg or absolute web URLs"
                value={form.image}
                onChange={handleChange}
                required
              />
            </div>

            {/* Sub images */}
            <div className="form-field-group full-width">
              <label className="form-label">Sub-images (comma-separated URLs)</label>
              <input 
                type="text" 
                name="imagesInput"
                className="form-input-text"
                placeholder="e.g. URL1, URL2, URL3"
                value={form.imagesInput}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="form-field-group full-width">
              <label className="form-label">Description</label>
              <textarea 
                name="description"
                className="form-textarea"
                placeholder="Enter detailed description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Featured Product */}
            <div className="form-field-group">
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  name="featured"
                  id="featured"
                  className="form-checkbox"
                  checked={form.featured}
                  onChange={handleChange}
                />
                <label htmlFor="featured" style={{ cursor: "pointer" }}>Mark as Featured Product</label>
              </div>
            </div>
          </div>

          <div className="form-actions-bar">
            <button type="button" className="action-reset-btn" onClick={handleReset}>
              <FaUndo /> Reset
            </button>
            <button type="submit" className="action-submit-btn" disabled={saving}>
              <FaSave /> {saving ? "Saving..." : (isEditMode ? "Update Product" : "Add Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProductForm;
