import { LanguageIcon } from "@heroicons/react/16/solid";
import {
  IconButton,
  Radio,
  SpeedDial,
  SpeedDialContent,
  SpeedDialHandler,
  Typography,
} from "@material-tailwind/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import Control from "../customControl";

const LanguageSwitcher = ({ position }) => {
  const { i18n } = useTranslation();
  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "oz", name: "Oʻzbekcha" },
    { code: "uz", name: "Ўзбекча" },
    { code: "tr", name: "Türkçe" },
  ];

  const selectedLanguage = i18n.language;

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <Control position={position}>
      <SpeedDial placement="left">
        <IconButton size="lg">
          <SpeedDialHandler className="w-10 h-10 cursor-pointer">
            <LanguageIcon className="w-6 h-6 p-2" />
          </SpeedDialHandler>
        </IconButton>
        <SpeedDialContent className="m-4">
          <div className="flex flex-col p-3 mb-10 rounded-md bg-gray-900/80  backdrop-blur-md">
            {languages.map((language, i) => (
              <Radio
                key={i}
                checked={selectedLanguage === language.code}
                className="checked:bg-white"
                variant={
                  selectedLanguage === language.code ? "filled" : "outlined"
                }
                onChange={() => handleLanguageChange(language.code)}
                label={
                  <Typography className="mr-3 text-white">
                    {language.name}
                  </Typography>
                }
              />
            ))}
          </div>
        </SpeedDialContent>
      </SpeedDial>
    </Control>
  );
};

export default memo(LanguageSwitcher);
