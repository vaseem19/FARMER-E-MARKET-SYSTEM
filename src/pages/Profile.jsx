import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const token = localStorage.getItem("token");
  const userLocal = JSON.parse(localStorage.getItem("user") || "null");

  // ================= FETCH PROFILE =================
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setForm({
          name: res.data.name,
          email: res.data.email
        });

        setPreview(
          res.data.profileImage ||
          userLocal?.profileImage ||
          "https://i.pravatar.cc/150"
        );

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  // ================= NAME CHANGE =================
  const handleNameUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:5000/api/user/update",
        { name: form.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Name updated ✅");

      const user = JSON.parse(localStorage.getItem("user"));
      user.name = form.name;
      localStorage.setItem("user", JSON.stringify(user));

    } catch {
      alert("Update failed ❌");
    }
  };

  // ================= EMAIL OTP =================
  const sendOTP = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/send-email-otp",
        { email: form.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOtpSent(true);
      alert("OTP sent 📩");

    } catch {
      alert("Failed ❌");
    }
  };

  const verifyOTP = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/verify-email-otp",
        { email: form.email, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Email updated ✅");

      const user = JSON.parse(localStorage.getItem("user"));
      user.email = form.email;
      localStorage.setItem("user", JSON.stringify(user));

      setOtp("");
      setOtpSent(false);

    } catch {
      alert("Invalid OTP ❌");
    }
  };

  // ================= IMAGE UPLOAD =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await axios.post(
        "http://localhost:5000/api/user/upload-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setPreview(res.data.imageUrl);

      const user = JSON.parse(localStorage.getItem("user"));
      user.profileImage = res.data.imageUrl;
      localStorage.setItem("user", JSON.stringify(user));

      alert("Profile updated ✅");

    } catch {
      alert("Upload failed ❌");
    }
  };

  if (loading)
    return <h2 className="text-center mt-10 text-white">Loading...</h2>;

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-r from-green-100 to-blue-100">

      <div className="glass w-full max-w-5xl p-8 rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">👤 My Profile</h1>
          <p className="text-gray-600">
            Manage your account and personal details
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="flex flex-col items-center text-center">

            <img
              src={preview}
              className="w-32 h-32 rounded-full border-4 border-green-500 object-cover"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-3 text-sm"
            />

            {image && (
              <button
                onClick={uploadImage}
                className="btn btn-green mt-2"
              >
                Upload Photo
              </button>
            )}

            <h2 className="text-xl font-bold mt-3">
              {form.name}
            </h2>

            <p className="text-gray-600">{form.email}</p>

            {/* ROLE BADGE */}
            <div className="mt-2 px-3 py-1 bg-green-600 text-white rounded-full text-sm">
              {userLocal?.role === "farmer" ? "🌾 Farmer" : "🛒 Buyer"}
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="md:col-span-2 space-y-5">

            {/* UPDATE NAME */}
            <form onSubmit={handleNameUpdate} className="glass p-5">
              <h3 className="font-bold mb-2">✏️ Update Name</h3>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <button className="btn btn-green mt-2">
                Save Name
              </button>
            </form>

            {/* UPDATE EMAIL */}
            <div className="glass p-5">
              <h3 className="font-bold mb-2">📧 Update Email</h3>

              <input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <button onClick={sendOTP} className="btn btn-yellow mt-2">
                Send OTP
              </button>

              {otpSent && (
                <>
                  <input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <button
                    onClick={verifyOTP}
                    className="btn btn-green mt-2"
                  >
                    Verify Email
                  </button>
                </>
              )}
            </div>

            {/* INFO CARD */}
            <div className="glass p-5">
              <h3 className="font-bold mb-2">📋 Account Info</h3>
              <p>👤 Name: {form.name}</p>
              <p>📧 Email: {form.email}</p>
              <p>🧑 Role: {userLocal?.role}</p>
              <p>🌱 Platform: Farmer E - Digital Market System</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;