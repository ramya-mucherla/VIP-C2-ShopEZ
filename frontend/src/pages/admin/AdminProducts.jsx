import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import API from "../../utils/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const fetchData = async () => {
    try {
      const prodRes = await API.get("/admin/products");
      const catRes = await API.get("/admin/categories");
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Error fetching products data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;

    try {
      await API.delete(`/admin/products/${id}`);
      alert("Product deleted successfully!");
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                            (product.brand && product.brand.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "stockAsc") return a.countInStock - b.countInStock;
      if (sortBy === "stockDesc") return b.countInStock - a.countInStock;
      return 0; // default (by date/none)
    });

  if (loading) {
    return <div style={{ color: "#94a3b8", textAlign: "center", padding: "3rem" }}><h2>Loading products...</h2></div>;
  }

  return (
    <div className="admin-products-wrapper">
      <style>{`
        .admin-products-wrapper {
          color: #334155;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .section-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: #0f172a;
        }
        .add-product-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          text-decoration: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
          transition: opacity 0.2s;
        }
        .add-product-btn:hover {
          opacity: 0.9;
        }
        
        /* Filters Bar */
        .filters-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 1.25rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .search-input-group {
          flex: 2;
          min-width: 250px;
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 13px;
          color: #64748b;
        }
        .search-field {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 14px 10px 40px;
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
        .filter-select {
          flex: 1;
          min-width: 150px;
          padding: 10px 14px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          color: #1e293b;
          font-size: 0.95rem;
          cursor: pointer;
        }
        .filter-select:focus {
          outline: none;
          border-color: #6366f1;
        }

        /* Products Table Layout */
        .table-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .table-responsive {
          overflow-x: auto;
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .products-table th {
          color: #64748b;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
        }
        .products-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
          vertical-align: middle;
        }
        .products-table tr:hover td {
          background-color: #f8fafc;
        }
        .products-table tr:last-child td {
          border-bottom: none;
        }
        
        .product-thumbnail {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #e2e8f0;
        }
        .product-meta-name {
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .product-meta-brand {
          font-size: 0.75rem;
          color: #64748b;
        }

        .stock-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .stock-badge.in-stock {
          background-color: rgba(16, 185, 129, 0.1);
          color: #059669;
        }
        .stock-badge.low-stock {
          background-color: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }
        .stock-badge.out-of-stock {
          background-color: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        /* Action Buttons */
        .actions-cell {
          display: flex;
          gap: 10px;
        }
        .action-icon-btn {
          background: none;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .action-icon-btn:hover {
          color: #0f172a;
          background-color: #f1f5f9;
        }
        .action-icon-btn.edit-btn:hover {
          border-color: #6366f1;
          color: #4f46e5;
          background-color: rgba(99, 102, 241, 0.05);
        }
        .action-icon-btn.delete-btn:hover {
          border-color: #ef4444;
          color: #dc2626;
          background-color: rgba(239, 68, 68, 0.05);
        }
        .action-icon-btn.view-btn:hover {
          border-color: #10b981;
          color: #059669;
          background-color: rgba(16, 185, 129, 0.05);
        }
      `}</style>

      <div className="section-header">
        <h1>Products Management</h1>
        <Link to="/admin/products/add" className="add-product-btn">
          <FaPlus /> Add Product
        </Link>
      </div>

      {/* Filters block */}
      <div className="filters-bar">
        <div className="search-input-group">
          <span className="search-icon"><FaSearch /></span>
          <input 
            type="text" 
            placeholder="Search products by name or brand..." 
            className="search-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select 
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="stockAsc">Stock: Low to High</option>
          <option value="stockDesc">Stock: High to Low</option>
        </select>
      </div>

      {/* Products table */}
      <div className="table-card">
        <div className="table-responsive">
          {filteredProducts.length === 0 ? (
            <p style={{ textAlign: "center", margin: "2rem 0", color: "#94a3b8" }}>No products found matching the criteria.</p>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isOutOfStock = product.countInStock === 0;
                  const isLowStock = product.countInStock < 5 && product.countInStock > 0;
                  const stockClass = isOutOfStock ? "out-of-stock" : (isLowStock ? "low-stock" : "in-stock");
                  const stockText = isOutOfStock ? "Out of Stock" : (isLowStock ? `Low Stock (${product.countInStock})` : `In Stock (${product.countInStock})`);
                  
                  return (
                    <tr key={product._id}>
                      <td>
                        <img 
                          src={product.image || "/images/placeholder.jpg"} 
                          alt={product.name} 
                          className="product-thumbnail"
                        />
                      </td>
                      <td>
                        <div className="product-meta-name">{product.name}</div>
                        <div className="product-meta-brand">{product.brand || "No Brand"}</div>
                      </td>
                      <td>{product.category}</td>
                      <td>₹{product.price.toLocaleString("en-IN")}</td>
                      <td>{product.discount > 0 ? `${product.discount}% OFF` : "-"}</td>
                      <td>
                        <span className={`stock-badge ${stockClass}`}>{stockText}</span>
                      </td>
                      <td>
                        <span style={{ color: isOutOfStock ? "#f87171" : "#34d399", fontWeight: "600", fontSize: "0.85rem" }}>
                          {isOutOfStock ? "Unavailable" : "Active"}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <Link to={`/products`} className="action-icon-btn view-btn" title="View Storefront">
                            <FaEye />
                          </Link>
                          <Link to={`/admin/products/edit/${product._id}`} className="action-icon-btn edit-btn" title="Edit details">
                            <FaEdit />
                          </Link>
                          <button 
                            className="action-icon-btn delete-btn" 
                            onClick={() => handleDelete(product._id, product.name)}
                            title="Delete product"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
