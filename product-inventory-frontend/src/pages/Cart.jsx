// src/pages/Cart.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  placeOrder,
} from "../api";
import LayoutWrapper from "../components/LayoutWrapper";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { fetchCart } = useContext(CartContext);

  const loadCart = async () => {
    try {
      const { data } = await getCart();
      setCartItems(data);
      setError(null);
    } catch (err) {
      setError("Failed to load cart items");
      console.error("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      await updateCartQuantity(itemId, newQuantity);
      await fetchCart();
    } catch (err) {
      setError("Failed to update quantity");
      console.error("Error updating quantity:", err);
      loadCart();
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      await removeFromCart(itemId);
      await fetchCart();
    } catch (err) {
      setError("Failed to remove item");
      console.error("Error removing item:", err);
      loadCart();
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await placeOrder();
      await fetchCart();
      navigate("/orders");
    } catch (err) {
      setError("Failed to place order");
      console.error("Error placing order:", err);
    }
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper>
        <div className="alert alert-error my-4">{error}</div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center text-base-content/70">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 
                             rounded-xl shadow-lg bg-base-100"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain rounded bg-base-200"
                    />
                    <div>
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm opacity-80">
                        ₹{item.product.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Quantity Control */}
                    <div className="flex items-center rounded-lg overflow-hidden h-10 border border-base-300">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="btn btn-sm bg-base-200 hover:bg-base-300 border-0 rounded-none h-full"
                      >
                        −
                      </button>
                      <span className="px-4 flex items-center justify-center text-center h-full">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="btn btn-sm bg-base-200 hover:bg-base-300 border-0 rounded-none h-full"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="btn btn-ghost btn-circle text-error"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8 flex justify-between items-center">
              <div className="text-xl font-bold">
                Total Amount: ₹
                {cartItems.reduce(
                  (sum, item) => sum + item.product.price * item.quantity,
                  0
                )}
              </div>
              <button onClick={handlePlaceOrder} className="btn btn-primary">
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </LayoutWrapper>
  );
};

export default Cart;
