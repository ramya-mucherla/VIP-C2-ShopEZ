import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaBox, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import API from "../../utils/api";

function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await API.get("/admin/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  if (loading) {
    return <div style={{ color: "#94a3b8", textAlign: "center", padding: "3rem" }}><h2>Loading inventory details...</h2></div>;
  }

  // Aggregate Stats
  const inStockCount = products.filter((p) => p.countInStock > 0).length;
  const lowStockProducts = products.filter((p) => p.countInStock < 5 && p.countInStock > 0);
  const outOfStockProducts = products.filter((p) => p.countInStock === 0);

  return (
    <div className="admin-inventory-wrapper">
      <style>{`
        .admin-inventory-wrapper {
          color: #334155;
        }
        .inventory-header {
          margin-bottom: 2rem;
        }
        .inventory-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: #0f172a;
        }
        .inventory-header p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0.5rem 0 0 0;
        }

        /* Stats Blocks */
        .inventory-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .inventory-stat-card {
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .inventory-stat-icon {
          font-size: 2rem;
          width: 50px;
          height: 50px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .inventory-stat-icon.available {
          background-color: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }
        .inventory-stat-icon.low {
          background-color: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
        }
        .inventory-stat-icon.out {
          background-color: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }
        .inventory-stat-info h4 {
          font-size: 0.8rem;
          color: #94a3b8;
          text-transform: uppercase;
          margin: 0 0 4px 0;
          letter-spacing: 0.05em;
        }
        .inventory-stat-info p {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0;
          color: white;
        }

        /* Two columns */
        .inventory-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 992px) {
          .inventory-columns {
            grid-template-columns: 1fr;
          }
        }

        .inventory-panel {
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 1.5rem;
        }
        .panel-title {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #334155;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Items list */
        .inventory-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .inventory-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background-color: #0f172a;
          border: 1px solid #334155;
          border-radius: 8px;
        }
        .item-details {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .item-img {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          object-fit: cover;
          border: 1px solid #475569;
        }
        .item-name {
          font-weight: 600;
          color: white;
          font-size: 0.95rem;
        }
        .item-category {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 2px;
        }
        .stock-badge-low {
          background-color: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .stock-badge-out {
          background-color: rgba(239, 68, 68, 0.15);
          color: #f87171;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .edit-link {
          color: #6366f1;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .edit-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <p>Monitor warehouse supply, highlight shortages, and manage restocking schedules</p>
      </div>

      {/* Aggregate Cards */}
      <div className="inventory-stats-grid">
        <div className="inventory-stat-card">
          <div className="inventory-stat-icon available"><FaCheckCircle /></div>
          <div className="inventory-stat-info">
            <h4>Available Stock</h4>
            <p>{inStockCount} items</p>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon low"><FaExclamationTriangle /></div>
          <div className="inventory-stat-info">
            <h4>Low Stock Products</h4>
            <p>{lowStockProducts.length} items</p>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon out"><FaTimesCircle /></div>
          <div className="inventory-stat-info">
            <h4>Out of Stock Products</h4>
            <p>{outOfStockProducts.length} items</p>
          </div>
        </div>
      </div>

      <div className="inventory-columns">
        {/* Low Stock Warnings */}
        <div className="inventory-panel">
          <h3 className="panel-title" style={{ color: "#fbbf24" }}><FaExclamationTriangle /> Low Stock Warnings (Stock &lt; 5)</h3>
          <div className="inventory-list">
            {lowStockProducts.length === 0 ? (
              <p style={{ margin: 0, color: "#cbd5e1" }}>No low stock alerts recorded.</p>
            ) : (
              lowStockProducts.map((p) => (
                <div className="inventory-item" key={p._id}>
                  <div className="item-details">
                    <img src={p.image} alt={p.name} className="item-img" />
                    <div>
                      <div className="item-name">{p.name}</div>
                      <div className="item-category">{p.category}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span className="stock-badge-low">{p.countInStock} Left</span>
                    <Link to={`/admin/products/edit/${p._id}`} className="edit-link">Restock</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Out of Stock alerts */}
        <div className="inventory-panel">
          <h3 className="panel-title" style={{ color: "#f87171" }}><FaTimesCircle /> Out of Stock Alerts (Stock = 0)</h3>
          <div className="inventory-list">
            {outOfStockProducts.length === 0 ? (
              <p style={{ margin: 0, color: "#cbd5e1" }}>No items are currently out of stock.</p>
            ) : (
              outOfStockProducts.map((p) => (
                <div className="inventory-item" key={p._id}>
                  <div className="item-details">
                    <img src={p.image} alt={p.name} className="item-img" />
                    <div>
                      <div className="item-name">{p.name}</div>
                      <div className="item-category">{p.category}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span className="stock-badge-out">Sold Out</span>
                    <Link to={`/admin/products/edit/${p._id}`} className="edit-link">Restock</Link>
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

export default AdminInventory;
