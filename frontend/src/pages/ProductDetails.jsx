import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../utils/api";
import "../styles/main.css";

function StarRating({ value }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= value ? "#f59e0b" : "#d1d5db", fontSize: "1.1rem" }}>★</span>
      ))}
    </span>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productRes, reviewsRes, wishlistRes] = await Promise.all([
          API.get(`/products/${id}`),
          API.get(`/reviews/${id}`),
          API.get(`/wishlist`).catch(() => ({ data: { products: [] } })),
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
        const wl = wishlistRes.data.products || [];
        setInWishlist(wl.some((p) => p._id === id || p === id));
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await API.post("/cart", { productId: id, quantity: 1 });
      alert("Added to cart! 🛒");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleWishlist = async () => {
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await API.delete(`/wishlist/${id}`);
        setInWishlist(false);
      } else {
        await API.post("/wishlist", { productId: id });
        setInWishlist(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Wishlist action failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      setReviewMessage({ type: "error", text: "Please write a comment." });
      return;
    }
    setSubmitting(true);
    setReviewMessage(null);
    try {
      const res = await API.post("/reviews", { productId: id, ...reviewForm });
      setReviews((prev) => [res.data, ...prev]);
      setReviewForm({ rating: 5, comment: "" });
      setReviewMessage({ type: "success", text: "Review submitted! ✅" });
    } catch (err) {
      setReviewMessage({ type: "error", text: err.response?.data?.message || "Failed to submit review" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pd-page"><h2>Loading product...</h2></div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pd-page"><h2>Product not found.</h2></div>
      </>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : (product.rating || 0);

  return (
    <>
      <Navbar />
      <div className="pd-page">

        {/* Product Info */}
        <div className="pd-top">
          <div className="pd-image-box">
            <img src={product.image} alt={product.name} className="pd-main-image" />
          </div>
          <div className="pd-info">
            <p className="pd-category">{product.category}</p>
            <h1 className="pd-name">{product.name}</h1>
            <div className="pd-rating-row">
              <StarRating value={Math.round(avgRating)} />
              <span className="pd-rating-text">{avgRating} ({reviews.length} reviews)</span>
            </div>
            <p className="pd-price">₹{product.price?.toLocaleString("en-IN")}</p>
            {product.discount > 0 && (
              <span className="pd-discount-badge">{product.discount}% OFF</span>
            )}
            <p className="pd-description">{product.description || "No description available."}</p>
            <p className="pd-stock">
              {product.countInStock > 0
                ? <span style={{ color: "#16a34a" }}>✅ In Stock ({product.countInStock} left)</span>
                : <span style={{ color: "#dc2626" }}>❌ Out of Stock</span>
              }
            </p>

            <div className="pd-actions">
              <button className="pd-cart-btn" onClick={handleAddToCart} disabled={product.countInStock === 0}>
                🛒 Add to Cart
              </button>
              <button
                className={`pd-wish-btn ${inWishlist ? "wishlisted" : ""}`}
                onClick={handleWishlist}
                disabled={wishlistLoading}
              >
                {inWishlist ? "❤️ Wishlisted" : "🤍 Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="pd-reviews">
          <h2 className="pd-section-title">Customer Reviews</h2>

          {/* Submit Review Form */}
          <div className="review-form-box">
            <h3>Write a Review</h3>
            {reviewMessage && (
              <div className={`review-msg ${reviewMessage.type}`}>{reviewMessage.text}</div>
            )}
            <form onSubmit={handleReviewSubmit}>
              <div className="star-select">
                <label>Rating:</label>
                <div className="star-buttons">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                      style={{
                        background: "none", border: "none",
                        fontSize: "1.8rem", cursor: "pointer",
                        color: star <= reviewForm.rating ? "#f59e0b" : "#d1d5db",
                      }}
                    >★</button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Share your experience with this product..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                rows={4}
                className="review-textarea"
                required
              />
              <button type="submit" className="review-submit-btn" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">
                      {review.userId?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <strong>{review.userId?.username || "Customer"}</strong>
                      <div><StarRating value={review.rating} /></div>
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .pd-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 40px 5%;
        }
        .pd-top {
          display: flex;
          gap: 50px;
          background: white;
          border-radius: 20px;
          padding: 35px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.07);
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .pd-image-box { flex: 0 0 340px; }
        .pd-main-image {
          width: 100%; border-radius: 16px;
          object-fit: cover; max-height: 360px;
          background: #f3f4f6;
        }
        .pd-info { flex: 1; min-width: 260px; }
        .pd-category { font-size: 0.85rem; color: #6c63ff; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; }
        .pd-name { font-size: 2rem; font-weight: 700; color: #111827; margin-bottom: 12px; }
        .pd-rating-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .pd-rating-text { color: #6b7280; font-size: 0.9rem; }
        .pd-price { font-size: 2.2rem; font-weight: 700; color: #6c63ff; margin-bottom: 8px; }
        .pd-discount-badge {
          display: inline-block; background: #ef4444; color: white;
          padding: 4px 12px; border-radius: 20px; font-size: 0.85rem;
          font-weight: 700; margin-bottom: 14px;
        }
        .pd-description { color: #4b5563; font-size: 1rem; line-height: 1.6; margin-bottom: 14px; }
        .pd-stock { margin-bottom: 20px; font-weight: 600; }
        .pd-actions { display: flex; gap: 14px; flex-wrap: wrap; }
        .pd-cart-btn {
          flex: 1; padding: 13px 20px; background: linear-gradient(135deg, #6c63ff, #a855f7);
          color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: opacity 0.2s;
        }
        .pd-cart-btn:hover { opacity: 0.88; }
        .pd-cart-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pd-wish-btn {
          padding: 13px 22px; background: white; border: 2px solid #e5e7eb;
          border-radius: 12px; font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s; color: #374151;
        }
        .pd-wish-btn.wishlisted { border-color: #ef4444; background: #fff0f0; color: #dc2626; }
        .pd-wish-btn:hover { border-color: #6c63ff; color: #6c63ff; }

        /* Reviews */
        .pd-reviews { background: white; border-radius: 20px; padding: 35px; box-shadow: 0 5px 20px rgba(0,0,0,0.07); }
        .pd-section-title { font-size: 1.8rem; font-weight: 700; color: #111827; margin-bottom: 25px; }
        .review-form-box { background: #f8fafc; border-radius: 14px; padding: 25px; margin-bottom: 30px; }
        .review-form-box h3 { font-size: 1.2rem; font-weight: 700; color: #111827; margin-bottom: 15px; }
        .star-select { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .star-select label { font-weight: 600; color: #374151; }
        .star-buttons { display: flex; }
        .review-textarea {
          width: 100%; padding: 12px; border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-size: 0.95rem; font-family: inherit; resize: vertical; outline: none;
          transition: border-color 0.2s; box-sizing: border-box;
        }
        .review-textarea:focus { border-color: #6c63ff; }
        .review-submit-btn {
          margin-top: 12px; padding: 11px 28px; background: linear-gradient(135deg, #6c63ff, #a855f7);
          color: white; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 700;
          cursor: pointer; transition: opacity 0.2s;
        }
        .review-submit-btn:hover { opacity: 0.88; }
        .review-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .review-msg { padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-weight: 600; font-size: 0.9rem; }
        .review-msg.success { background: #d1fae5; color: #065f46; }
        .review-msg.error { background: #fee2e2; color: #991b1b; }
        .no-reviews { color: #9ca3af; text-align: center; padding: 30px; }
        .reviews-list { display: flex; flex-direction: column; gap: 16px; }
        .review-card { background: #f8fafc; border-radius: 12px; padding: 18px; }
        .review-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
        .review-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg, #6c63ff, #a855f7);
          color: white; font-weight: 700; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .review-date { margin-left: auto; font-size: 0.8rem; color: #9ca3af; }
        .review-comment { color: #374151; font-size: 0.95rem; line-height: 1.6; }
      `}</style>
    </>
  );
}

export default ProductDetails;
