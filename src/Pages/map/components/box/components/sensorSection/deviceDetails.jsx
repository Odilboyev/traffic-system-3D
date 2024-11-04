import {
  Button,
  Card,
  CardBody,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { FaLocationDot } from "react-icons/fa6";

const DeviceDetails = ({ device_data, locationHandler, isInCrossRoad }) => (
  <div className={`dark:bg-blue-gray-900 dark:text-white `}>
    <Card className="dark:bg-blue-gray-900 dark:text-white shadow-lg border">
      <CardBody className="flex w-full flex-col justify-between gap-2 ">
        <div className="flex justify-between items-center border-b py-3">
          <Typography className="font-bold">{device_data.name}</Typography>
          <IconButton
            variant="text"
            // onClick={() =>
            // locationHandler({ lat: device_data.lat, lng: device_data.lng })
            // }
          >
            <FaLocationDot className="w-6 h-6  dark:text-white" />
          </IconButton>
        </div>
        {Object.entries({
          "Seriya raqami": device_data?.sn,
          "Obyekt nomi": device_data?.adres,
          "Mas'ul xodim": device_data?.masul_hodim,
          "Xodim telefon raqami": device_data?.phone || "Raqam mavjud emas",
        }).map(([label, value], i) => (
          <div key={i} className="flex flex-col border-b">
            <span>{label}</span>
            <Typography className="font-bold">{value}</Typography>
          </div>
        ))}
      </CardBody>
    </Card>
    <Card className="mt-5 w-full dark:bg-blue-gray-900 dark:text-white shadow-lg border">
      <CardBody className="flex flex-col gap-4">
        <Typography className="font-bold border-b pb-2">
          {device_data.name}
        </Typography>
        <Button color="blue">device_restart</Button>
        <Button color="blue">device_restart</Button>
        <Button color="blue">device_restart</Button>
        <Button color="blue">device_restart</Button>
      </CardBody>
    </Card>
  </div>
);

export default DeviceDetails;
