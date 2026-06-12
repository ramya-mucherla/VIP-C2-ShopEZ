function Categories() {
  const categories = [
    { icon: "📱", name: "Electronics" },
    { icon: "👕", name: "Fashion" },
    { icon: "💻", name: "Laptops" },
    { icon: "🏠", name: "Home Decor" },
    { icon: "⌚", name: "Watches" },
  ];

  return (
    <section className="categories">
      <div className="container">

        <h2 className="section-title">
          Trending Categories
        </h2>

        <div className="category-grid">
          {categories.map((category, index) => (
            <div className="category-card" key={index}>
              <div className="category-icon">
                {category.icon}
              </div>

              <h3>{category.name}</h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;