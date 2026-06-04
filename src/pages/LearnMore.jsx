import { useNavigate } from "react-router-dom";

function LearnMore() {
  const navigate = useNavigate();

  const schemes = [
    {
      title: "🌾 PM-KISAN Samman Nidhi",
      desc: "Direct income support of ₹6000 per year for farmers.",
      link: "https://pmkisan.gov.in/"
    },
    {
      title: "🌦️ Crop Insurance Scheme (PMFBY)",
      desc: "Financial support for crop loss due to natural calamities.",
      link: "https://pmfby.gov.in/"
    },
    {
      title: "💳 Kisan Credit Card (KCC)",
      desc: "Easy credit access for farmers at low interest rates.",
      link: "https://www.jansamarth.in/kisan-credit-card"
    },
    {
      title: "🌱 Soil Health Card Scheme",
      desc: "Improves soil quality for better crop yield.",
      link: "https://soilhealth.dac.gov.in/"
    },
    {
      title: "🛒 eNAM (National Agriculture Market)",
      desc: "Online trading platform for agricultural produce.",
      link: "https://enam.gov.in/"
    }
  ];

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>🌾 Smart Agriculture Platform</h1>
        <p>Empowering Farmers with AI + Government Schemes</p>
      </div>

      {/* ABOUT */}
      <div style={styles.card}>
        <h2>📌 About This System</h2>
        <p>
          This platform connects farmers with buyers, provides AI-based farming tools,
          and gives easy access to government schemes in one place.
        </p>
      </div>

      {/* FEATURES */}
      <div style={styles.card}>
        <h2>🚀 Key Features</h2>
        <ul>
          <li>🌱 AI Crop Recommendation</li>
          <li>🦠 Disease Detection System</li>
          <li>🌦 Weather Forecast Integration</li>
          <li>🛒 Farmer–Buyer Marketplace</li>
          <li>📊 Smart Dashboard</li>
        </ul>
      </div>

      {/* GOVERNMENT SCHEMES (CARDS) */}
      <h2 style={{ marginBottom: "15px" }}>🏛️ Government Schemes</h2>

      <div style={styles.grid}>
        {schemes.map((item, index) => (
          <div
            key={index}
            style={styles.schemeCard}
            onClick={() => window.open(item.link, "_blank")}
          >
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <button style={styles.openBtn}>
              🔗 Open Scheme
            </button>
          </div>
        ))}
      </div>

      {/* CONTACT */}
      <div style={styles.card}>
        <h2>📞 Contact</h2>
        <p><b>Name:</b> Mohammed Vaseem</p>
        <p><b>Email:</b> vaseemmohammed1985@gmail.com</p>
        <p><b>Phone:</b> 8050283748</p>
      </div>

      {/* BACK BUTTON */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "30px",
    background: "linear-gradient(to right, #e8f5e9, #e3f2fd)",
    minHeight: "100vh",
    fontFamily: "Arial"
  },

  header: {
    textAlign: "center",
    marginBottom: "30px"
  },

  card: {
    background: "white",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
    marginBottom: "20px"
  },

  schemeCard: {
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "0.3s",
    border: "1px solid #e0e0e0"
  },

  openBtn: {
    marginTop: "10px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  backBtn: {
    background: "#2e7d32",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default LearnMore;