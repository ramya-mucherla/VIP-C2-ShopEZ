import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBoxOpen, FaShoppingBag, FaDollarSign, FaExclamationTriangle, FaHourglassHalf } from "react-icons/fa";
import API from "../../utils/api";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get("/admin/dashboard");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading admin stats...</h2>
      </div>
    );
  }

  const { metrics, lowStockProducts, recentActivities } = data || {
    metrics: {},
    lowStockProducts: [],
    recentActivities: []
  };

  return (
    <div className="admin-dashboard-wrapper">
      <style>{`
        .admin-dashboard-wrapper {
          color: #334155;
        }
        .dashboard-header-container {
          margin-bottom: 2rem;
        }
        .dashboard-title-text {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: #0f172a;
        }
        .dashboard-subtitle-text {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0;
        }
        
        /* Stats Grid */
        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .admin-stat-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.03);
        }
        .admin-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
          border-color: #cbd5e1;
        }
        .stat-card-info h4 {
          color: #64748b;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.5rem 0;
        }
        .stat-card-info p {
          font-size: 1.85rem;
          font-weight: 800;
          margin: 0;
          color: #0f172a;
        }
        .stat-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .stat-card-icon.users-icon {
          background-color: rgba(99, 102, 241, 0.1);
          color: #4f46e5;
        }
        .stat-card-icon.products-icon {
          background-color: rgba(236, 72, 153, 0.1);
          color: #db2777;
        }
        .stat-card-icon.orders-icon {
          background-color: rgba(59, 130, 246, 0.15);
          color: #2563eb;
        }
        .stat-card-icon.revenue-icon {
          background-color: rgba(16, 185, 129, 0.1);
          color: #059669;
        }
        .stat-card-icon.pending-icon {
          background-color: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }
        .stat-card-icon.warning-icon {
          background-color: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        /* Two Column Layout */
        .dashboard-content-columns {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 992px) {
          .dashboard-content-columns {
            grid-template-columns: 1fr;
          }
        }
        
        .dashboard-panel-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.03);
        }
        .panel-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Table details */
        .dashboard-table-container {
          overflow-x: auto;
        }
        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }
        .dashboard-table th {
          color: #64748b;
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
        }
        .dashboard-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }
        .dashboard-table tr:last-child td {
          border-bottom: none;
        }
        .stock-badge-critical {
          background-color: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* Activities Stream */
        .activity-stream {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .activity-item {
          display: flex;
          flex-direction: column;
          border-left: 2px solid #4f46e5;
          padding-left: 1rem;
          margin-left: 0.5rem;
        }
        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .activity-action {
          font-weight: 700;
          font-size: 0.9rem;
          color: #1e293b;
        }
        .activity-time {
          font-size: 0.75rem;
          color: #64748b;
        }
        .activity-details {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.4;
        }
        .dashboard-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 80vh;
          color: #94a3b8;
        }
      `}</style>

      <div className="dashboard-header-container">
        <h1 className="dashboard-title-text">Dashboard</h1>
        <p className="dashboard-subtitle-text">Real-time business performance from MongoDB</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="dashboard-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-card-info">
            <h4>Total Users</h4>
            <p>{metrics.totalUsers || 0}</p>
          </div>
          <div className="stat-card-icon users-icon">
            <FaUsers />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-info">
            <h4>Total Products</h4>
            <p>{metrics.totalProducts || 0}</p>
          </div>
          <div className="stat-card-icon products-icon">
            <FaBoxOpen />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-info">
            <h4>Total Orders</h4>
            <p>{metrics.totalOrders || 0}</p>
          </div>
          <div className="stat-card-icon orders-icon">
            <FaShoppingBag />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-info">
            <h4>Total Revenue</h4>
            <p>₹{(metrics.totalRevenue || 0).toLocaleString("en-IN")}</p>
          </div>
          <div className="stat-card-icon revenue-icon">
            <FaDollarSign />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-info">
            <h4>Pending Orders</h4>
            <p>{metrics.pendingOrdersCount || 0}</p>
          </div>
          <div className="stat-card-icon pending-icon">
            <FaHourglassHalf />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-info">
            <h4>Low Stock Products</h4>
            <p>{metrics.lowStockProductsCount || 0}</p>
          </div>
          <div className="stat-card-icon warning-icon">
            <FaExclamationTriangle />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="dashboard-content-columns">
        {/* Left Column: Low Stock Items */}
        <div className="dashboard-left-panel">
          <div className="dashboard-panel-card">
            <h3 className="panel-card-title"><FaExclamationTriangle style={{ color: "#ef4444" }} /> Critical Inventory Warnings (Stock &lt; 5)</h3>
            <div className="dashboard-table-container">
              {lowStockProducts.length === 0 ? (
                <p style={{ color: "#cbd5e1", margin: 0 }}>All products are sufficiently stocked.</p>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Product Image</th>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Available Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }} 
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>₹{product.price.toLocaleString("en-IN")}</td>
                        <td>
                          <span className="stock-badge-critical">{product.countInStock} Left</span>
                        </td>
                        <td>
                          <Link to={`/admin/products/edit/${product._id}`} style={{ color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>Restock</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Log */}
        <div className="dashboard-right-panel">
          <div className="dashboard-panel-card">
            <h3 className="panel-card-title">Recent Administrative Activity</h3>
            <div className="activity-stream">
              {recentActivities.length === 0 ? (
                <p style={{ color: "#cbd5e1", margin: 0 }}>No administrative actions recorded yet.</p>
              ) : (
                recentActivities.map((log) => (
                  <div className="activity-item" key={log._id}>
                    <div className="activity-header">
                      <span className="activity-action">{log.action}</span>
                      <span className="activity-time">{new Date(log.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="activity-details">{log.details}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
