import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import API from "../../utils/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/admin/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}`, { status: newStatus });
      alert("Order status updated successfully!");
      // Update local state
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order status");
    }
  };

  if (loading) {
    return <div style={{ color: "#94a3b8", textAlign: "center", padding: "3rem" }}><h2>Loading orders database...</h2></div>;
  }

  return (
    <div className="admin-orders-wrapper">
      <style>{`
        .admin-orders-wrapper {
          color: #334155;
        }
        .orders-header {
          margin-bottom: 2rem;
        }
        .orders-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: #0f172a;
        }
        .orders-header p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0.5rem 0 0 0;
        }

        .orders-table-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .table-responsive {
          overflow-x: auto;
        }
        .orders-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .orders-table th {
          color: #64748b;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
        }
        .orders-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
          vertical-align: middle;
          font-size: 0.9rem;
        }
        .orders-table tr:hover td {
          background-color: #f8fafc;
        }
        .orders-table tr:last-child td {
          border-bottom: none;
        }

        .order-id-badge {
          font-family: monospace;
          background-color: #f1f5f9;
          color: #4f46e5;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
        }
        .customer-meta {
          font-weight: 600;
          color: #0f172a;
        }
        .customer-email {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 2px;
        }

        .order-products-list {
          padding-left: 1.2rem;
          margin: 0;
        }
        .order-products-list li {
          margin-bottom: 4px;
          color: #334155;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .status-badge.pending {
          background-color: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }
        .status-badge.processing {
          background-color: rgba(99, 102, 241, 0.1);
          color: #4f46e5;
        }
        .status-badge.shipped {
          background-color: rgba(59, 130, 246, 0.1);
          color: #2563eb;
        }
        .status-badge.delivered {
          background-color: rgba(16, 185, 129, 0.1);
          color: #059669;
        }
        .status-badge.cancelled {
          background-color: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .status-select-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .status-dropdown {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .status-dropdown:focus {
          outline: none;
          border-color: #6366f1;
        }
      `}</style>

      <div className="orders-header">
        <h1>Orders Management</h1>
        <p>Monitor customer checkout history and update shipping status</p>
      </div>

      <div className="orders-table-card">
        <div className="table-responsive">
          {orders.length === 0 ? (
            <p style={{ textAlign: "center", margin: "2rem 0", color: "#94a3b8" }}>No customer orders placed yet.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Products (Qty)</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  const statusClass = order.status.toLowerCase();
                  
                  return (
                    <tr key={order._id}>
                      <td>
                        <span className="order-id-badge">{order._id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td>
                        <div className="customer-meta">{order.userId?.username || "Unknown"}</div>
                        <div className="customer-email">{order.userId?.email || "N/A"}</div>
                      </td>
                      <td>
                        <ul className="order-products-list">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.name} <strong>(x{item.quantity})</strong>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td><strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong></td>
                      <td>{order.paymentMethod}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>{order.status}</span>
                      </td>
                      <td>
                        <div className="status-select-wrapper">
                          <select 
                            className="status-dropdown"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
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

export default AdminOrders;
