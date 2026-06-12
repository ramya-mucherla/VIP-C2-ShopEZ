import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import API from "../utils/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get(`/products?search=${search}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [search]);

  const handleAddToCart = async (productId) => {
    try {
      await API.post("/cart", { productId, quantity: 1 });
      alert("Product added to cart!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product to cart");
    }
  };

  return (
    <div className="products-page">
      <h1>Our Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            image={product.image}
            name={product.name}
            price={<h3>₹{product.price.toLocaleString("en-IN")}</h3>}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default Products;