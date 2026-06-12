import { useState, useEffect } from "react";
import API from "../utils/api";

function Hero() {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await API.get("/banners");
        const activeBanners = response.data.filter((b) => b.active);
        setBanners(activeBanners);
      } catch (error) {
        console.error("Error fetching banners for hero:", error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners]);

  return (
    <section className="hero">
      <div className="hero-left">
        <span className="hero-badge">🔥 Mega Sale 2026</span>

        <h1>
          Shop Smarter,
          <br />
          Live Better.
        </h1>

        <p>
          Discover premium electronics, fashion,
          furniture and lifestyle products at
          unbeatable prices.
        </p>

        <div className="hero-buttons">
          <button className="shop-btn">
            Shop Now
          </button>

          <button className="deal-btn">
            Explore Deals
          </button>
        </div>

        <div className="hero-stats">
          <div>
            <h3>50K+</h3>
            <p>Customers</p>
          </div>

          <div>
            <h3>10K+</h3>
            <p>Products</p>
          </div>

          <div>
            <h3>500+</h3>
            <p>Brands</p>
          </div>
        </div>
      </div>

      <div className="hero-right" style={{ position: "relative", minHeight: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {banners.length > 0 ? (
          <div className="hero-slider-container" style={{ width: "100%", height: "100%", borderRadius: "16px", overflow: "hidden", position: "relative", minHeight: "350px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", border: "1px solid #334155" }}>
            {banners.map((banner, index) => (
              <div
                key={banner._id}
                className={`hero-slide ${index === currentSlide ? "active" : ""}`}
                style={{
                  position: "absolute",
                  top: 0, left: 0, width: "100%", height: "100%",
                  opacity: index === currentSlide ? 1 : 0,
                  transition: "opacity 0.8s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "2rem",
                  boxSizing: "border-box",
                  background: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.85)), url(${banner.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  zIndex: index === currentSlide ? 5 : 1
                }}
              >
                <h3 style={{ color: "white", margin: "0 0 0.5rem 0", fontSize: "1.6rem", fontWeight: "800", textShadow: "1px 1px 4px rgba(0,0,0,0.6)" }}>{banner.title}</h3>
                {banner.linkUrl && (
                  <a href={banner.linkUrl} style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: "700", fontSize: "0.95rem" }}>Explore Offer &rarr;</a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="floating-card card1">
              📱 iPhone 16 Pro
              <span>₹1,29,999</span>
            </div>

            <div className="floating-card card2">
              ⌚ Apple Watch
              <span>₹39,999</span>
            </div>

            <div className="floating-card card3">
              🎧 Sony Headphones
              <span>₹9,999</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Hero;