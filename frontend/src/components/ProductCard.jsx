import { useNavigate } from "react-router-dom";
import API from "../utils/api";

function ProductCard({ id, image, name, price, onAddToCart }) {
  const navigate = useNavigate();

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    try {
      await API.post("/wishlist", { productId: id });
      alert("Added to wishlist ❤️");
    } catch (err) {
      alert(err.response?.data?.message || "Could not add to wishlist");
    }
  };

  return (
    <div className="product-card">
      <div style={{ position: "relative" }}>
        <img
          src={image}
          alt={name}
          onClick={() => navigate(`/products/${id}`)}
          style={{ cursor: "pointer" }}
        />
        <button
          onClick={handleAddToWishlist}
          style={{
            position: "absolute", top: "10px", right: "10px",
            background: "rgba(255,255,255,0.9)", border: "none",
            borderRadius: "50%", width: "36px", height: "36px",
            cursor: "pointer", fontSize: "1.1rem", display: "flex",
            alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
          title="Add to Wishlist"
        >
          🤍
        </button>
      </div>

      <div className="product-info">
        <h3
          onClick={() => navigate(`/products/${id}`)}
          style={{ cursor: "pointer" }}
        >
          {name}
        </h3>
        <p>{price}</p>
        <button onClick={() => onAddToCart && onAddToCart(id)}>Add To Cart</button>
      </div>
    </div>
  );
}

export default ProductCard;