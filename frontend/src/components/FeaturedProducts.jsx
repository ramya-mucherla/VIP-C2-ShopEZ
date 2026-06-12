import { useState, useEffect } from "react";
import API from "../utils/api";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        // Limit to first 8 products for featured section
        setProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await API.post("/cart", { productId, quantity: 1 });
      alert("Product added to cart!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product to cart");
    }
  };

  return (
    <section className="featured">
      <h2>Featured Products</h2>

      <div className="featured-grid">
        {products.map((item) => (
          <div className="featured-card" key={item._id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>₹{item.price.toLocaleString("en-IN")}</p>
            <button onClick={() => handleAddToCart(item._id)}>Add To Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;