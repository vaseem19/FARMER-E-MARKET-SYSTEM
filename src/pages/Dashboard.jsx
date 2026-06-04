import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user"));

  const services = [
    { name: t("cropRecommendation"), icon: "🌱", path: "/crop-recommendation" },
    { name: t("yieldPrediction"), icon: "📈", path: "/yield-prediction" },
    { name: t("diseaseDetection"), icon: "🦠", path: "/disease-detection" },
    { name: t("fertilizerGuide"), icon: "🧪", path: "/fertilizer" },
    { name: t("weatherForecast"), icon: "🌦", path: "/weather" },
    { name: t("farmerConnect"), icon: "👨‍🌾", path: "/farmer-connect" }
  ];

  return (
    <div className="min-h-screen px-4 py-8">

      {/* ================= USER INFO ================= */}
      <div className="glass p-6 mb-8 flex justify-between items-center">

        <div>
          <h2 className="text-xl font-bold">
            👋 Welcome, {user?.name}
          </h2>

          <p className="text-gray-300">
            Role: {user?.role === "farmer" ? "🌾 Farmer" : "🛒 Buyer"}
          </p>
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="btn btn-green"
        >
          👤 Profile
        </button>

      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="glass p-8 text-center mb-10">

        <h1 className="text-4xl font-bold">
          {t("smartAgriTitle")}
        </h1>

        <p className="text-gray-300 mt-3">
          {t("smartAgriDesc")}
        </p>

        {/* BADGES */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">

          <span className="bg-white/10 px-4 py-2 rounded-full">
            🌱 {t("accuracy")}
          </span>

          <span className="bg-white/10 px-4 py-2 rounded-full">
            🦠 {t("diseaseDetection")}
          </span>

          <span className="bg-white/10 px-4 py-2 rounded-full">
            🌦 {t("weatherForecast")}
          </span>

        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">

          <button
            onClick={() => navigate("/crop-recommendation")}
            className="btn btn-green"
          >
            {t("startPredicting")}
          </button>

          <button
            onClick={() => navigate("/learn-more")}
            className="btn btn-yellow"
          >
            ℹ️ {t("learnMore")}
          </button>

        </div>

      </div>

      {/* ================= FEATURES ================= */}
      <h2 className="text-2xl font-bold text-center mb-6">
        {t("featuresTitle")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => navigate(service.path)}
            className="glass p-6 cursor-pointer hover:scale-105 transition"
          >
            <div className="text-3xl">{service.icon}</div>

            <h3 className="text-xl font-semibold mt-2">
              {service.name}
            </h3>

            <p className="text-gray-300 mt-2 text-sm">
              {t("clickToExplore")} {service.name}
            </p>
          </div>
        ))}

      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <h2 className="text-xl font-bold mt-10 mb-6">
        ⚡ {t("quickActions")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* HISTORY */}
        <div className="glass p-6">
          <h2 className="text-lg font-bold">📜 {t("predictionHistory")}</h2>
          <p className="text-gray-300 text-sm mt-2">
            {t("historyDesc")}
          </p>

          <button
            onClick={() => navigate("/history")}
            className="btn btn-green mt-4"
          >
            {t("viewHistory")}
          </button>
        </div>

        {/* WEATHER */}
        <div className="glass p-6">
          <h2 className="text-lg font-bold">🌦 {t("weather")}</h2>
          <p className="text-gray-300 text-sm mt-2">
            {t("weatherDesc2")}
          </p>

          <button
            onClick={() => navigate("/weather")}
            className="btn btn-green mt-4"
          >
            {t("checkWeather")}
          </button>
        </div>

        {/* ADD CROP */}
        <div className="glass p-6">
          <h2 className="text-lg font-bold">🌱 {t("addCrop")}</h2>
          <p className="text-gray-300 text-sm mt-2">
            {t("addCropDesc")}
          </p>

          <button
            onClick={() => navigate("/add-crop")}
            className="btn btn-yellow mt-4"
          >
            {t("addCrop")}
          </button>
        </div>

        {/* GOVERNMENT SCHEMES */}
        <div className="glass p-6 md:col-span-3">
          <h2 className="text-lg font-bold">🏛️ Government Schemes</h2>
          <p className="text-gray-300 text-sm mt-2">
            Apply for PM-KISAN, Crop Insurance, KCC and more support programs.
          </p>

          <button
            onClick={() => navigate("/learn-more")}
            className="btn btn-green mt-4"
          >
            View Schemes
          </button>
        </div>

      </div>

      {/* ================= ROLE SECTION ================= */}
      <div className="glass p-6 mt-10 text-center">

        <h2 className="text-xl font-bold">
          {user?.role === "farmer"
            ? "🌾 Farmer Dashboard"
            : "🛒 Buyer Dashboard"}
        </h2>

        <p className="text-gray-300 mt-2">
          {user?.role === "farmer"
            ? "Manage crops, sell products, and track earnings"
            : "Buy fresh crops, track orders, and explore marketplace"}
        </p>

      </div>

    </div>
  );
}

export default Dashboard;