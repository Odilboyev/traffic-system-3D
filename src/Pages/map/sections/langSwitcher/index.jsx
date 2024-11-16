import { Radio, Typography } from "@material-tailwind/react";

import { memo } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitch = ({ setIsSidebarOpen }) => {
  const { i18n } = useTranslation();
  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "oz", name: "Oʻzbekcha" },
    { code: "uz", name: "Ўзбекча" },
    { code: "tr", name: "Türkçe" },
  ];
  const { language } = i18n;
  const selectedLanguage = language;
  const handleLanguageChange = (languageCode) => {
    setIsSidebarOpen(false);
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="flex flex-col p-3 rounded-md bg-gray-900/80  backdrop-blur-md">
      {languages.map((language, i) => (
        <Radio
          key={i}
          checked={selectedLanguage === language.code}
          className="checked:bg-white"
          variant={selectedLanguage === language.code ? "filled" : "outlined"}
          onChange={() => handleLanguageChange(language.code)}
          label={
            <Typography className="mr-3 text-white">{language.name}</Typography>
          }
        />
      ))}
    </div>
  );
};

const LanguageSwitcher = memo(LanguageSwitch);
export default LanguageSwitcher;
