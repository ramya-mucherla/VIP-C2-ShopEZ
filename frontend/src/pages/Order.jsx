import { useState, useEffect } from "react";
import API from "../utils/api";
import "../styles/main.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get("/orders/myorders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="orders-page"><h1>Loading Orders...</h1></div>;
  }

  // Flatten orders for UI mapping (one card per item ordered)
  const orderCards = [];
  orders.forEach((order) => {
    order.items.forEach((item) => {
      orderCards.push({
        id: order._id,
        product: item.name,
        price: `₹${item.price.toLocaleString("en-IN")}`,
        status: order.status,
        orderDate: (order.orderDate && !isNaN(new Date(order.orderDate).getTime()))
          ? new Date(order.orderDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : (order.orderbater && !isNaN(new Date(order.orderbater).getTime()))
          ? new Date(order.orderbater).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
        deliveryDate: (order.deliveryDate && !isNaN(new Date(order.deliveryDate).getTime()))
          ? new Date(order.deliveryDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : (order.deliverydate && !isNaN(new Date(order.deliverydate).getTime()))
          ? new Date(order.deliverydate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
        qty: item.quantity,
        payment: order.paymentMethod,
        image: item.image,
      });
    });
  });

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orderCards.length === 0 ? (
        <p className="no-orders-message">You have not placed any orders yet.</p>
      ) : (
        orderCards.map((order, idx) => (
          <div className="order-card" key={`${order.id}-${idx}`}>
            
            {/* Left Section */}
            <img
              src={order.image}
              alt={order.product}
              className="order-img"
            />

            {/* Middle Section */}
            <div className="order-details">
              <h3>{order.product}</h3>

              <p className=" order-price">{order.price}</p>

              <p>
                <strong>Order ID:</strong> {order.id.slice(-8).toUpperCase()}
              </p>

              <p>
                <strong>Ordered:</strong> {order.orderDate}
              </p>

              <div className="order-meta">
                <span>Qty: {order.qty}</span>
                <span>•</span>
                <span>{order.payment}</span>
              </div>

              {order.status === "Delivered" ? (
                <p className="order-status-text">
                  🚚 Order completed successfully
                </p>
              ) : order.status === "Cancelled" ? (
                <p className="order-status-text" style={{ color: "red" }}>
                  ❌ Order was cancelled
                </p>
              ) : (
                <p className="order-status-text">
                  📦 Package is on the way ({order.status})
                </p>
              )}
            </div>

            {/* Right Section */}
            <div className="order-actions">
              <span
                className={`status-badge ${order.status.toLowerCase()}`}
              >
                {order.status}
              </span>

              <p className="delivery-info">
                {order.status === "Delivered"
                  ? `Delivered on ${order.deliveryDate}`
                  : order.status === "Cancelled"
                  ? `Cancelled`
                  : `Expected by ${order.deliveryDate}`}
              </p>

              {order.status !== "Cancelled" && (
                <button className="track-btn">
                  🚚 Track Order
                </button>
              )}

              {order.status === "Delivered" && (
                <button className="buy-btn">
                  🔄 Buy Again
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;