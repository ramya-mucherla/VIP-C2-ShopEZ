import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../utils/api";
import "../styles/main.css";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      setWishlist(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const res = await API.delete(`/wishlist/${productId}`);
      setWishlist(res.data.products || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await API.post("/cart", { productId, quantity: 1 });
      alert("Added to cart!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="wishlist-page"><h2>Loading Wishlist...</h2></div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="wishlist-page">
        <h1 className="wishlist-title">❤️ My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <p style={{ fontSize: "4rem" }}>💔</p>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love by clicking the heart icon on any product.</p>
            <button className="start-shopping-btn" onClick={() => navigate("/products")}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div key={product._id} className="wishlist-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="wishlist-img"
                  onClick={() => navigate(`/products/${product._id}`)}
                  style={{ cursor: "pointer" }}
                />
                <div className="wishlist-info">
                  <h3 onClick={() => navigate(`/products/${product._id}`)} style={{ cursor: "pointer" }}>
                    {product.name}
                  </h3>
                  <p className="wishlist-price">₹{product.price?.toLocaleString("en-IN")}</p>
                  <p className="wishlist-category">{product.category}</p>
                  <div className="wishlist-actions">
                    <button className="cart-add-btn" onClick={() => handleAddToCart(product._id)}>
                      🛒 Add to Cart
                    </button>
                    <button className="remove-wish-btn" onClick={() => handleRemove(product._id)}>
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .wishlist-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 40px 5%;
        }
        .wishlist-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 40px;
        }
        .empty-wishlist {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 20px;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 5px 20px rgba(0,0,0,0.06);
        }
        .empty-wishlist h2 { font-size: 1.8rem; color: #1f2937; margin: 10px 0; }
        .empty-wishlist p { color: #6b7280; margin-bottom: 25px; }
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 25px;
        }
        .wishlist-card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.07);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .wishlist-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        }
        .wishlist-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }
        .wishlist-info { padding: 18px; }
        .wishlist-info h3 { font-size: 1.1rem; color: #111827; margin-bottom: 6px; }
        .wishlist-price { font-size: 1.3rem; font-weight: 700; color: #6c63ff; margin-bottom: 4px; }
        .wishlist-category { font-size: 0.85rem; color: #9ca3af; margin-bottom: 14px; }
        .wishlist-actions { display: flex; gap: 10px; }
        .cart-add-btn {
          flex: 1;
          padding: 9px 0;
          border: none;
          border-radius: 9px;
          background: linear-gradient(135deg, #6c63ff, #a855f7);
          color: white;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.85rem;
          transition: opacity 0.2s;
        }
        .cart-add-btn:hover { opacity: 0.88; }
        .remove-wish-btn {
          padding: 9px 14px;
          border: none;
          border-radius: 9px;
          background: #fee2e2;
          color: #dc2626;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.85rem;
          transition: background 0.2s;
        }
        .remove-wish-btn:hover { background: #fecaca; }
      `}</style>
    </>
  );
}

export default Wishlist;
