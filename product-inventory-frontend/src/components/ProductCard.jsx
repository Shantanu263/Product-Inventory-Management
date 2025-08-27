import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../api';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // For admin, navigate to product details
    // For customer, prevent navigation if clicking Add to Cart button
    if (!event.target.closest('button')) {
      navigate(`/product/${product.id}`);
    }
  };

  // Decide badge color based on stock
  const getStockBadgeClass = (quantity) => {
    if (quantity > 25) return "bg-green-600 text-white";
    if (quantity >= 10) return "bg-yellow-500 text-black";
    if (quantity > 0) return "bg-red-600 text-white";
    return "bg-gray-700 text-white"; // Out of stock
  };

  const userRole = localStorage.getItem('userRole');
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent navigation to product details
    try {
      setAddingToCart(true);
      await addToCart(product.id, 1);
      // Show success toast or notification
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Show error toast or notification
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div
      className="group relative w-60 h-72 rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl bg-base-100"
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="relative w-full h-48 bg-white flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain"
        />

        {/* Stock Badge */}
        {product.quantity === 0 ? (
          <div
            className={`absolute top-2 left-2 text-sm font-semibold px-2 py-1 rounded shadow ${getStockBadgeClass(
              product.quantity
            )}`}
          >
            Out of Stock
          </div>
        ) : (
          <div
            className={`absolute top-2 left-2 text-sm font-semibold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getStockBadgeClass(
              product.quantity
            )}`}
          >
            {product.quantity} in stock
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-300/90 via-base-300/60 to-transparent p-3 text-base-content">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-sm">
          ₹{product.price} • {product.category.categoryName} • ★ {product.averageRating}
        </p>
      </div>
      
      {/* Add to Cart Button - Only show for customers and if product is in stock
      {userRole === 'CUSTOMER' && product.quantity > 0 && (
        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="absolute bottom-4 right-4 btn btn-primary btn-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {addingToCart ? (
            <div className="loading loading-spinner loading-xs" />
          ) : (
            'Add to Cart'
          )}
        </button>
      )} */}
    </div>
  );
};

export default ProductCard;
