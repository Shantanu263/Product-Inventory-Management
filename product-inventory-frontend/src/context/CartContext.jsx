import React, { createContext, useState, useEffect } from "react";
import { getCart } from "../api"; // your API call

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
      // Update cart item count to number of distinct products
      setCartItemCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart, cartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};
