import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FlashSale from "../components/FlashSale";
import Testimonials from "../components/Testimonials";
import FeaturedProducts from "../components/FeaturedProducts";
import Navbar from "../components/Navbar";
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <FlashSale />
      <FeaturedProducts />
      <Testimonials />
    </>
  );
}

export default Home;