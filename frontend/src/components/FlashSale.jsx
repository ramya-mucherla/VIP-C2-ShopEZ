import { useState, useEffect } from "react";
import API from "../utils/api";

function FlashSale() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        // Slice a different range of products for flash sale
        setProducts(response.data.slice(8, 16));
      } catch (error) {
        console.error("Error fetching flash sale products:", error);
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

  // Static mock discounts corresponding to positions in list
  const discounts = ["20% OFF", "15% OFF", "30% OFF", "25% OFF", "40% OFF", "50% OFF", "35% OFF", "18% OFF"];

  return (
    <section className="flash-sale">
      <h2>🔥 Flash Sale</h2>

      <div className="flash-scroll">
        {products.map((item, index) => (
          <div className="flash-card" key={item._id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>₹{item.price.toLocaleString("en-IN")}</p>
            <span>{discounts[index % discounts.length]}</span>
            <button onClick={() => handleAddToCart(item._id)}>Add To Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FlashSale;