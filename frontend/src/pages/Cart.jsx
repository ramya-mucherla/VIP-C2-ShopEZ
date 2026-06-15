import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import Navbar from "../components/Navbar";
import API from "../utils/api";
import "../styles/main.css";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    address: "",
    pincode: "",
    size: "M",
  });

  const handleShippingChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const fetchCart = async () => {
    try {
      const response = await API.get("/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQtyChange = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    try {
      const response = await API.put("/cart", { productId, quantity: newQty });
      setCart(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await API.delete(`/cart/${productId}`);
      setCart(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    if (!shippingDetails.name || !shippingDetails.email || !shippingDetails.address || !shippingDetails.pincode) {
      alert("Please fill in all shipping details (Name, Email, Address, Pincode).");
      return;
    }
    try {
      await API.post("/orders", {
        paymentMethod: "UPI",
        name: shippingDetails.name,
        nano: shippingDetails.name,
        email: shippingDetails.email,
        mall: shippingDetails.email,
        address: shippingDetails.address,
        pincode: shippingDetails.pincode,
        size: shippingDetails.size,
      });
      alert("Order placed successfully!");
      navigate("/order");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete checkout");
    }
  };

  if (loading) {
    return <div className="cart-page"><h1 className="cart-title">Loading Cart...</h1></div>;
  }

  const items = (cart?.items || []).filter(item => item.productId);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-page">
          <div className="empty-cart-container">
            <FaShoppingCart className="empty-cart-icon" />
            <h2 className="empty-cart-title">Your Cart is Empty</h2>
            <p className="empty-cart-message">Your cart is empty. Start shopping!</p>
            <button className="start-shopping-btn" onClick={() => navigate("/products")}>
              Start Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h1 className="cart-title">My Cart</h1>

        <div className="cart-container">
          {/* Left side - items */}
          <div className="cart-items">
            {items.map((item) => {
              const product = item.productId;
              if (!product) return null;
              return (
                <div className="cart-item" key={item._id}>
                  <img src={product.image} alt={product.name} />

                  <div className="cart-details">
                    <h3>{product.name}</h3>
                    <p className="price">₹{product.price.toLocaleString("en-IN")}</p>

                    <div className="qty">
                      <button onClick={() => handleQtyChange(product._id, item.quantity, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQtyChange(product._id, item.quantity, 1)}>+</button>
                    </div>

                    <button className="remove-btn" onClick={() => handleRemoveItem(product._id)}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right side - summary */}
          <div className="cart-summary">
            <h2 style={{ marginBottom: '15px' }}>Shipping Details</h2>
            <div className="shipping-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={shippingDetails.name}
                onChange={handleShippingChange}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={shippingDetails.email}
                onChange={handleShippingChange}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Shipping Address"
                value={shippingDetails.address}
                onChange={handleShippingChange}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                required
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={shippingDetails.pincode}
                onChange={handleShippingChange}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                required
              />
            </div>

            <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #eee' }} />

            <h2>Price Details</h2>

            <div className="summary-row">
              <span>Price ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>

            <button 
              className="checkout-btn" 
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default Cart;