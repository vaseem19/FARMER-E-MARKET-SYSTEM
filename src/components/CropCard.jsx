import React, { useState } from "react";

function CropCard({ crop, onAddToCart, onBuy }) {

  const isOutOfStock = crop.quantity <= 0;

  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [predictPrice, setPredictPrice] = useState(null);

  const token = localStorage.getItem("token");

  // ================= AI PREDICTION =================
  const handlePredict = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          crop: crop.crop_name,
          location: crop.location || "karnataka",
          quantity: qty,
        }),
      });

      const data = await res.json();

      if (data?.predicted_price) {
        setPredictPrice(data.predicted_price);
      } else {
        alert("❌ Invalid prediction response");
      }

    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= CART =================
  const handleAddToCart = () => {
    if (qty > crop.quantity) return alert("❌ Not enough stock");

    onAddToCart({
      ...crop,
      selectedQty: qty,
      total: crop.price * qty
    });
  };

  // ================= BUY =================
  const handleBuyNow = () => {
    if (qty > crop.quantity) return alert("❌ Not enough stock");

    onBuy({
      ...crop,
      selectedQty: qty,
      total: crop.price * qty
    });
  };

  // ================= PAYMENT =================
  const handlePayment = async () => {
    try {

      const loadScript = (src) =>
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

      const sdkLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!sdkLoaded) return alert("❌ Razorpay failed to load");

      const response = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: crop.price * qty,
          }),
        }
      );

      const order = await response.json();

      const options = {
        key: "rzp_test_SjYRwKlrpje8Im",
        amount: order.amount,
        currency: "INR",
        name: "Farmer E-Market",
        description: `${crop.crop_name} Purchase`,
        order_id: order.id,

        handler: async function (response) {

          const verify = await fetch(
            "http://localhost:5000/api/payment/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            }
          );

          const data = await verify.json();

          if (data.success) {
            alert("✅ Payment Successful");

            handleBuyNow();

          } else {
            alert("❌ Payment Failed");
          }
        },

        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#16a34a",
        },
      };

      new window.Razorpay(options).open();

    } catch (err) {
      console.error(err);
      alert("❌ Payment Error");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col border border-green-100">

      {/* NAME */}
      <h2 className="text-lg font-bold text-green-700">
        🌾 {crop.crop_name}
      </h2>

      {/* PRICE */}
      <p className="text-gray-800 font-semibold">
        💰 ₹{crop.price} / kg
      </p>

      {/* PREDICT */}
      {predictPrice && (
        <p className="text-blue-600 text-sm font-medium">
          🤖 Predicted: ₹{predictPrice}
        </p>
      )}

      {/* STOCK */}
      <p className="text-sm text-gray-500">
        ⚖️ Available: {crop.quantity} kg
      </p>

      {/* LOCATION */}
      {crop.location && (
        <p className="text-sm text-gray-500">
          📍 {crop.location}
        </p>
      )}

      {/* QUANTITY */}
      <div className="flex items-center justify-center gap-3 mt-3">

        <button onClick={() => setQty(Math.max(1, qty - 1))}>
          -
        </button>

        <span>{qty}</span>

        <button
          onClick={() =>
            setQty(Math.min(crop.quantity, qty + 1))
          }
        >
          +
        </button>

      </div>

      {/* BUTTONS */}
      <div className="mt-auto pt-4 space-y-2">

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full py-2 bg-yellow-500 text-white rounded-lg"
        >
          🛒 Add to Cart
        </button>

        <button
          onClick={handlePayment}
          disabled={isOutOfStock}
          className="w-full py-2 bg-green-600 text-white rounded-lg"
        >
          ⚡ Buy Now
        </button>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Predicting..." : "🤖 Predict Price"}
        </button>

      </div>

    </div>
  );
}

export default CropCard;