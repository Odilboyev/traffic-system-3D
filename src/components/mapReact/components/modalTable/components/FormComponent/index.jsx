import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import UserFields from "./Fields/UserFields";
import CameraTrafficFields from "./Fields/CameraTrafficFields";
import CrossroadFields from "./Fields/CrossroadFields";
import { getInitialData } from "./utils";
import BoxMonitorFields from "./Fields/BoxControllerFields";

const FormComponent = ({ data, options, onSubmit, onCancel, type }) => {
  const [formData, setFormData] = useState(null);

  // Initialize form data with defaults or from provided data
  useEffect(() => {
    if (data) {
      const { id, ...filteredData } = data; // Exclude 'id' from initial form data
      type === "boxmonitor" ? setFormData(data) : setFormData(filteredData);
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
  const handleCancel = () => {
    setFormData(null);
    onCancel();
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData); // Submit form data
        setFormData(null);
      }}
      className="space-y-6 p-8 w-full my-20 max-w-lg mx-auto bg-white rounded-xl shadow-2xl dark:text-white dark:bg-gray-800"
    >
      {formData && (
        <div className="flex flex-col gap-6 static">
          {/* Dynamic Fields Based on Type */}
          {type === "user" && (
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              color="red"
              onClick={handleCancel}
              className="font-semibold hover:bg-red-600 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="green"
              className="font-semibold hover:bg-green-600 transition-all duration-300"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default FormComponent;
