import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getTexts } from "./api/api.handlers";

const loadTranslations = async () => {
  try {
    const response = await getTexts();
    i18n.use(initReactI18next).init({
      debug: false,
      resources: response,
      lng: "ru", // default language
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
  } catch (error) {
    console.error("Error loading translations:", error);
  }
};

loadTranslations();

export default i18n;
