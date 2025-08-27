import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const CartButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/cart')}
      className="btn btn-ghost btn-circle"
    >
      <FaShoppingCart className="h-5 w-5" />
    </button>
  );
};

export default CartButton;
