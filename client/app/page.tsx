"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface IMenuItem {
  _id: string;
  food_name: string;
  base_price: number;
  category: string;
  is_available: boolean;
}

interface ICartItem {
  food_name: string;
  price_at_purchase: number;
  quantity: number;
}

export default function Home() {
  const router = useRouter();
  const [menu, setMenu] = useState<IMenuItem[]>([]);
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/menu");
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // 1. Add Item to Cart Logic
  const addToCart = (item: IMenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.food_name === item.food_name);
      if (existing) {
        return prevCart.map((c) =>
          c.food_name === item.food_name
            ? { ...c, quantity: c.quantity + 1 }
            : c,
        );
      }
      return [
        ...prevCart,
        {
          food_name: item.food_name,
          price_at_purchase: item.base_price,
          quantity: 1,
        },
      ];
    });
  };

  // 2. Calculate Cart Total for UI display
  const cartTotal = cart.reduce(
    (total, item) => total + item.price_at_purchase * item.quantity,
    0,
  );

  // 3. Submit Checkout Payload to Express API
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !address || cart.length === 0) {
      alert("Please fill out delivery details and add items to your cart!");
      return;
    }

    setSubmitting(true);
    try {
      const orderResponse = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          delivery_address: address,
          items: cart,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        alert(`Order creation failed: ${orderData.message}`);
        setSubmitting(false);
        return;
      }

      const paymentResponse = await fetch(
        "http://localhost:5000/api/payment/initialize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.orderId,
          }),
        },
      );

      const paymentData = await paymentResponse.json();

      if(paymentResponse.ok && paymentData.authorization_url){
        setCart([]);
        setCustomerName("");
        setAddress("");

       // Redirect the browser tab straight to Paystack's secure checkout
        window.location.href = paymentData.authorization_url;
      }else{
        alert(`Payment initialization failed: ${paymentData.message}`);
      }

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Could not connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-orange-600 animate-pulse">
          Setting up the kitchen...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT & CENTER COLUMNS: Menu Display */}
        <div className="lg:col-span-2">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Welcome to <span className="text-orange-600">ChopAm</span> 🚀
            </h1>
            <p className="text-gray-500 mt-2">
              Fresh, authentic flavors delivered instantly.
            </p>
          </header>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Menu
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {menu.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2">
                    {item.food_name}
                  </h3>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900">
                    ₦{item.base_price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Cart & Checkout Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit lg:sticky lg:top-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            Your Basket
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-400 text-center py-6 text-sm">
              Your basket is empty.
            </p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-1">
              {cart.map((cartItem, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm text-gray-700 bg-gray-50 p-2 rounded-lg"
                >
                  <span>
                    {cartItem.food_name}{" "}
                    <strong className="text-gray-400">
                      x{cartItem.quantity}
                    </strong>
                  </span>
                  <span className="font-semibold">
                    ₦
                    {(
                      cartItem.price_at_purchase * cartItem.quantity
                    ).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Total:</span>
                <span className="text-orange-600">
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Checkout Form */}
          <form onSubmit={handleCheckout} className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Delivery Details
            </h3>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm focus:outline-orange-500 text-black"
                placeholder="e.g. Chidi Okafor"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Delivery Address
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm focus:outline-orange-500 text-black"
                placeholder="House address, Area, City"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
            >
              {submitting
                ? "Sending Order to Kitchen..."
                : "Place Order (Cash on Delivery)"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
