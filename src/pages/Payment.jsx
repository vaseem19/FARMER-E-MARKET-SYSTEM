import axios from "axios";

function Payment() {

  const handlePayment = async () => {

    const { data: order } = await axios.post(
      "http://localhost:5000/api/payment/create-order",
      {
        amount: 500,
      }
    );

    const options = {
      key: "YOUR_KEY_ID",
      amount: order.amount,
      currency: "INR",
      name: "Farmer E Market",
      description: "Crop Purchase",
      order_id: order.id,

      handler: async function (response) {

        const verify = await axios.post(
          "http://localhost:5000/api/payment/verify",
          response
        );

        if (verify.data.success) {
          alert("Payment Successful");
        } else {
          alert("Payment Failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <button onClick={handlePayment}>
        Pay ₹500
      </button>
    </div>
  );
}

export default Payment;