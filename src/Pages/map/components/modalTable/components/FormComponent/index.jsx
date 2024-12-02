import { useEffect, useState } from "react";

import BoxMonitorFields from "./Fields/BoxControllerFields";
import { Button } from "@material-tailwind/react";
import CameraPddFields from "./Fields/CameraPddFields";
import CameraTrafficFields from "./Fields/CameraTrafficFields";
import CameraViewFields from "./Fields/CameraViewFields";
import CrossroadFields from "./Fields/CrossroadFields";
import TrafficLightsFields from "./Fields/TrafficLightsFields";
import UserFields from "./Fields/UserFields";
import { getInitialData } from "./utils";
import { toast } from "react-toastify";

const FormComponent = ({
  data,
  options,
  onSubmit,
  onCancel,
  type,
  t,
  currentState,
}) => {
  const [formData, setFormData] = useState(null);

  // Initialize form data with defaults or from provided data
  useEffect(() => {
    if (data) {
      const { id, ...filteredData } = data; // Exclude 'id' from initial form data
      type === "boxmonitor" ? setFormData(data) : setFormData(data);
    } else {
      const initialData = getInitialData(type);
      setFormData(initialData);
    }
  }, [data, type]);

  // Handle input changes dynamically
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  /**
   * Handles cancel button click by resetting form data and calling onCancel callback.
   */
  const handleCancel = () => {
    setFormData(null);
    onCancel();
  };
  // Validate form data
  const validateFormData = () => {
    const initialData = getInitialData(type); // Get the initial data for the current type
    const relevantKeys = Object.keys(initialData); // Get the keys of the initial data

    // Loop through the relevant keys and check if any of them are empty
    for (const key of relevantKeys) {
      const value = formData[key];

      if (!value || (value + "").trim() === "") {
        toast.error(`${key.replace(/_/g, " ")} is required`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          containerId: "modal",
        });
        return false;
      }
    }

    return true;
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (validateFormData()) {
            onSubmit(formData); // Submit form data
            setFormData(null);
          }
        }}
        className="p-8 w-full max-w-[80vw] mt-[3%] mx-auto bg-white rounded-xl shadow-2xl dark:text-white dark:bg-gray-800"
      >
        {formData && (
          <div className="flex flex-col gap-6 static">
            {/* Dynamic Fields Based on Type */}
            {type === "users" && (
              <>
                <UserFields
                  formData={formData}
                  handleInputChange={handleInputChange}
                  options={options}
                />
              </>
            )}

            {type === "cameratraffic" && (
              <CameraTrafficFields
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}
            {type === "cameraview" && (
              <CameraViewFields
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}
            {type === "camerapdd" && (
              <CameraPddFields
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}
            {type === "boxmonitor" && (
              <BoxMonitorFields
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}
            {type === "crossroad" && (
              <CrossroadFields
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}
            {type === "svetofor" && (
              <TrafficLightsFields
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                color="red"
                onClick={handleCancel}
                className="font-semibold hover:bg-red-600 transition-all duration-300"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                color="green"
                className="font-semibold hover:bg-green-600 transition-all duration-300"
              >
                {t("save")}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormComponent;
