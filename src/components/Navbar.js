import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user"));

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      <h2>🌾 {t("title")}</h2>

      <div style={styles.links}>
        <LanguageSwitcher />

        {!user && (
          <>
            <Link to="/login" style={styles.link}>
              {t("login")}
            </Link>
            <Link to="/register" style={styles.link}>
              {t("register")}
            </Link>
          </>
        )}

        {user?.role === "farmer" && (
          <Link to="/farmer-dashboard" style={styles.link}>
            {t("farmerDashboard")}
          </Link>
        )}

        {user?.role === "buyer" && (
          <Link to="/buyer-dashboard" style={styles.link}>
            {t("buyerDashboard")}
          </Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin-dashboard" style={styles.link}>
            👑 {t("adminPanel")}
          </Link>
        )}

        {user && (
          <>
            <Link to="/profile" style={{ ...styles.link, marginRight: "10px" }}>
              👤 {user.name}
            </Link>

            <button onClick={logoutHandler} style={styles.logoutBtn}>
              {t("logout")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    padding: "15px",
    background: "#2e7d32",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap"
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap"
  },
  link: {
    color: "white",
    textDecoration: "none"
  },
  logoutBtn: {
    background: "white",
    color: "#2e7d32",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
  }
};

export default Navbar;