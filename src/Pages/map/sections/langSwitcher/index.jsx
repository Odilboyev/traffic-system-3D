import { LanguageIcon } from "@heroicons/react/16/solid";
import { IconButton, Radio, Typography } from "@material-tailwind/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import Control from "../../../../components/customControl";
import SidePanel from "../../../../components/sidePanel";

const LanguageSwitch = ({ activeSidePanel, setActiveSidePanel }) => {
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
    <Control position="topleft">
      <div>
        <IconButton size="lg" onClick={() => setActiveSidePanel("language")}>
          <LanguageIcon className="w-6 h-6" />
        </IconButton>
        <SidePanel
          title="Language"
          sndWrapperClass="min-w-[15vw] ml-2"
          isOpen={activeSidePanel === "language"}
          setIsOpen={() => setActiveSidePanel(null)}
          content={
            <div className="flex flex-col p-3">
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
          }
        />
      </div>
    </Control>
  );
};

const LanguageSwitcher = memo(LanguageSwitch);
export default LanguageSwitcher;
