import { ArrowsPointingOutIcon } from "@heroicons/react/16/solid";
import {
  Card,
  CardBody,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import CrossroadDataModal from "./modal";

const CrossroadWidget = ({ data }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const sections = [
    {
      title: "Traffic Cameras",
      value: "76",
      status: "Online",
      offline: "13",
      onlinePercentage: "85.4%",
    },
    {
      title: "Overview Cameras",
      value: "30",
      status: "Online",
      offline: "0",
      onlinePercentage: "100%",
    },
    {
      title: "Traffic Violation Cameras",
      value: "63",
      status: "Online",
      offline: "0",
      onlinePercentage: "100%",
    },
    {
      title: "Traffic Lights",
      value: "49",
      status: "Online",
      offline: "10",
      onlinePercentage: "83.1%",
    },
  ];

  const handleOpenModal = (section) => {
    setSelectedSection(section);
    setOpenModal(true);
  };

  return (
    <>
      <Card className="w-[15vw] bg-transparent text-white shadow-xl rounded-lg bg-gray-900/80 backdrop-blur-md">
        <CardBody className="p-4">
          <div className="flex flex-col gap-3">
            {sections.map((section, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white/10 rounded-lg p-3"
              >
                <div className="flex-1">
                  <Typography variant="small" className="text-gray-300">
                    {section.title}
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Typography className="text-xl font-bold">
                      {section.value}
                    </Typography>
                    <Typography variant="small" color="red">
                      ({section.offline} offline)
                    </Typography>
                  </div>
                  <Typography variant="small" className="text-green-400">
                    {section.onlinePercentage}
                  </Typography>
                </div>
                <IconButton
                  variant="text"
                  className="text-white"
                  onClick={() => handleOpenModal(section)}
                >
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                </IconButton>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <CrossroadDataModal
        open={openModal}
        handler={() => setOpenModal(false)}
        section={selectedSection}
      />
    </>
  );
};

export default CrossroadWidget;
