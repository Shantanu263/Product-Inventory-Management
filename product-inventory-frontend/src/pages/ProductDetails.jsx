import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import {Star} from "lucide-react";
import {
  deleteProductById,
  fetchProductById,
  updateCartQuantity,
  addToCart,
  getUserProductRating,
  rateProduct,
} from "../api";
import { CartContext } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [originalUserRating, setOriginalUserRating] = useState(0);
  const [userHasRated, setUserHasRated] = useState(false);
  const [message, setMessage] = useState("");
  const { cart, fetchCart } = useContext(CartContext);
  const userRole = localStorage.getItem("userRole");
  
  // Load product details
  useEffect(() => {
    fetchProductById(id)
      .then((res) => {
        const data = res.data;
        setProduct(data);
        setSelectedImage(data.imageUrls?.[0] || data.imageUrl || null);
        // fetch user's rating separately
        getUserProductRating(data.id)
          .then((r) => {
            const text = String(r.data);
            const match = text.match(/(\d+(?:\.\d+)?)\s*$/);
            if (match) {
              const userRating = Math.round(Number(match[1]));
              setRating(userRating);
              setOriginalUserRating(userRating);
              setUserHasRated(true);
            } else {
              setRating(0);
              setOriginalUserRating(0);
              setUserHasRated(false);
            }
          })
          .catch(() => {
            setRating(0);
            setOriginalUserRating(0);
            setUserHasRated(false);
          });
      })
      .catch((err) => console.error("Error loading product:", err));
  }, [id]);
  
  // Sync cart quantity
  useEffect(() => {
    const cartItem = cart.find((item) => item.product.id === Number(id));
    setCartQuantity(cartItem ? cartItem.quantity : 0);
  }, [cart, id]);
  
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductById(id).then(() => {
        alert("Product deleted successfully!");
        navigate(-1);
      });
    }
  };
  
  const handleUpdate = () => navigate(`/update-product/${id}`);
  const handleBack = () => navigate(-1);
  
  const handleCartUpdate = async (newQty) => {
    try {
      const cartItem = cart.find((item) => item.product.id === Number(id));
  
      if (!cartItem && newQty > 0) {
        await addToCart(id, newQty);
        setMessage("Product added to cart successfully!");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      } else if (cartItem) {
        await updateCartQuantity(cartItem.id, newQty);
        setMessage("Cart updated successfully!");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      }
  
      await fetchCart();
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };
  
  const handleAddToCart = () => {
    if (product.quantity > 0) handleCartUpdate(quantity);
  };
  
  const handleBuyNow = () => {
    if (product.quantity > 0) {
      handleCartUpdate(quantity);
      navigate('/cart');
    }
  };
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };
  
  // Submit or update rating
  const submitRating = async () => {
    try {
      await rateProduct(product.id, rating);
      const wasRatedAlready = userHasRated;
      setUserHasRated(true);
      setOriginalUserRating(rating);
      setMessage(wasRatedAlready ? "Rating updated" : "Rating submitted");
      // refresh product to get new average rating
      const refreshed = await fetchProductById(product.id);
      setProduct(refreshed.data);
    } catch (e) {
      console.error("Error submitting rating:", e);
    }
  };

  const handleRate = (value) => {
    setRating(value);
    setMessage("");
  };
  
  
  if (!product) return <p className="text-center mt-8 text-lg">Loading...</p>;
  
  return (
    <div className="min-h-screen w-full px-4 py-8 bg-base-200">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={handleBack} 
          className="mb-6 text-base-content hover:text-primary transition-colors duration-200"
        >
          ← Back to Products
        </button>
  
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Image Gallery */}
          <div className="w-full lg:w-1/2">
            {/* Main Product Image */}
            <div className="w-full aspect-square bg-base-100 rounded-lg overflow-hidden mb-6">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-base-300 text-base-content">
                  No Image
                </div>
              )}
            </div>
  
            {/* Thumbnail Images */}
            <div className="flex gap-4">
              {(product.imageUrls && product.imageUrls.length > 0
                ? product.imageUrls
                : [product.imageUrl]
              )?.map((img, idx) => (
                <div
                  key={idx}
                  className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                    selectedImage === img
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
  
          {/* Right Side - Product Information */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-6">
              {/* Brand/Collection */}
              <div className="text-sm font-medium text-primary uppercase tracking-wider">
                {product.category?.categoryName || "COLLECTION"}
              </div>
  
              {/* Product Name with avg rating */}
             <h1 className="text-4xl font-bold text-base-content leading-tight flex items-center gap-4">
               {product.name}
                <span className="flex items-center text-lg font-medium text-yellow-500 gap-1">
                  <Star size={20} />
                  {product.averageRating?.toFixed(1) || 0}/5
                </span>
             </h1>
  
              {/* Price */}
              <div className="text-3xl font-semibold text-base-content">
                ₹{product.price}
              </div>
  
              {/* Quantity Selector (hidden for admin) */}
              {userRole !== "ADMIN" && (
                <div>
                  <label className="block text-sm font-medium text-base-content mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center rounded-lg overflow-hidden h-10 border border-base-300 w-fit">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="btn btn-sm bg-base-200 hover:bg-base-300 border-0 rounded-none h-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <span className="px-4 flex items-center justify-center text-center h-full">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.quantity}
                      className="btn btn-sm bg-base-200 hover:bg-base-300 border-0 rounded-none h-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
  
              {/* Action Buttons (hidden for admin) */}
              {userRole !== "ADMIN" && (
                <div className="space-y-3">
                  {message && (
                    <div className="alert alert-success text-sm py-2">
                      {message}
                    </div>
                  )}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0}
                    className="w-full py-3 px-6 bg-base-content text-base-100 border-2 border-base-content rounded-lg font-medium hover:bg-base-content/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.quantity === 0 ? "Out of Stock" : "Add to cart"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.quantity === 0}
                    className="w-full py-3 px-6 bg-base-100 text-base-content border-2 border-base-content rounded-lg font-medium hover:bg-base-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy it now
                  </button>
                </div>
              )}
  
              {/* Product Description */}
                <label className="block text-lg font-bold text-base-content mb-3">
                  Product Description
                </label>              
                <div>
                <p className="text-base-content/80 leading-relaxed">
                  {product.productDescription || "A nod to the past, reimagined for the now, the Medallion Reboot T-Shirt brings back a legacy design with a bold new attitude. Crafted from midweight French terry cotton, it features a reworked 3D emblem at the chest, an evolved expression of the Medallion identity."}
                </p>
              </div>
  
              {/* Additional Product Info */}
              <div className="pt-6 border-t border-base-300">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-base-content/60">Category:</span>
                    <span className="ml-2 text-base-content font-medium">
                      {product.category?.categoryName || "Uncategorized"}
                    </span>
                  </div>
                  <div>
                    <span className="text-base-content/60">Stock:</span>
                    <span className="ml-2 text-base-content font-medium">
                      {product.quantity} available
                    </span>
                  </div>
                  <div>
                    <span className="text-base-content/60">Product ID:</span>
                    <span className="ml-2 text-base-content font-medium">
                      #{product.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-base-content/60">Added:</span>
                    <span className="ml-2 text-base-content font-medium">
                      {product.createdDate}
                    </span>
                  </div>
                </div>
              </div>
  
              {/* Rating Section (hidden for admin) */}
              {userRole !== "ADMIN" && (
                <div className="pt-6 border-t border-base-300">
                  {userHasRated ? (
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-base-content">You have rated this product:</span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
<svg
  key={star}
  onClick={() => handleRate(star)}
  onMouseEnter={() => setHoverRating(star)}
  onMouseLeave={() => setHoverRating(0)}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill={star <= (hoverRating || rating) ? "#fbbf24" : "#9ca3af"}
  className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-200"
>
  <path
    fillRule="evenodd"
    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.03 4.884 5.211.442c1.164.099 1.636 1.545.749 2.305l-3.946 3.39 1.184 5.073c.271 1.162-.984 2.062-2.002 1.47L12 18.354l-4.438 2.42c-1.018.592-2.273-.308-2.002-1.47l1.184-5.072-3.946-3.39c-.887-.76-.415-2.207.749-2.306l5.211-.442 2.03-4.883z"
    clipRule="evenodd"
  />
</svg>
                        ))}
                      </div>
                      {rating !== originalUserRating && (
                        <button onClick={submitRating} className="ml-4 px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90">Update Rating</button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-base-content">Rate this product:</span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            onClick={() => handleRate(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill={
                              star <= (hoverRating || rating) ? "#fbbf24" : "#9ca3af"
                            }
                            className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform duration-200"
                          >
                            <path d="M17.56 21a1 1 0 0 1-.46-.11L12 18.22l-5.1 2.67a1 1 0 0 1-1.45-1.06l1-5.63-4.12-4a1 1 0 0 1-.25-1 1 1 0 0 1 .81-.68l5.7-.83 2.51-5.13a1 1 0 0 1 1.8 0l2.54 5.12 5.7.83a1 1 0 0 1 .81.68 1 1 0 0 1-.25 1l-4.12 4 1 5.63a1 1 0 0 1-.4 1 1 0 0 1-.62.18z" />
                          </svg>
                        ))}
                      </div>
                      <button onClick={submitRating} className="ml-4 px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90">Rate</button>
                    </div>
                  )}
                  {message && (
                    <p className="mt-2 text-green-600 font-medium">{message}</p>
                  )}
                </div>
              )}
  
              {/* Admin Actions */}
              {userRole === "ADMIN" && (
                <div className="pt-6 border-t border-base-300">
                  <div className="flex gap-3">
                    <button 
                      onClick={handleUpdate} 
                      className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors duration-200"
                    >
                      Update Product
                    </button>
                    <button 
                      onClick={handleDelete} 
                      className="px-4 py-2 bg-error text-error-content rounded-lg hover:bg-error/90 transition-colors duration-200"
                    >
                      Delete Product
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
