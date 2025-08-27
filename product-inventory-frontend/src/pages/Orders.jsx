import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api";
import LayoutWrapper from "../components/LayoutWrapper";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await getOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError("Failed to load orders");
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex justify-center items-center h-screen">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper>
        <div className="text-center text-error p-4">{error}</div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-base-content">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center text-base-content/60">
            You haven't placed any orders yet
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-base-100 rounded-lg shadow hover:shadow-lg transition-shadow border border-base-300"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-base-content">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-base-content/70">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base-content">
                      ₹{order.totalAmount}
                    </p>
                    <p className="text-sm text-base-content/70">{order.status}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-2 bg-base-200 rounded"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded bg-base-100 border border-base-300"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-base-content">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-base-content/70">
                          Quantity: {item.quantity} × ₹{item.product.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-base-content">
                          ₹{item.quantity * item.product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
};

export default Orders;
