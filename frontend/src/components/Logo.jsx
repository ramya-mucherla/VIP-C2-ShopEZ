import { FaShoppingCart } from "react-icons/fa";

function Logo() {
  return (
    <div className="logo-container">
      <FaShoppingCart className="cart-icon" />

      <h1 className="logo-text">
        shop<span>EZ</span>
      </h1>
    </div>
  );
}

export default Logo;