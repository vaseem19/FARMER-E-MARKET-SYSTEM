import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const currentLang = i18n.language?.split("-")[0] || "en";

  return (
    <select
      onChange={changeLanguage}
      value={currentLang}
      style={{
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        cursor: "pointer",
        backgroundColor: "white",
        color: "black",
        fontWeight: "500"
      }}
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="kn">ಕನ್ನಡ</option>
    </select>
  );
}

export default LanguageSwitcher;