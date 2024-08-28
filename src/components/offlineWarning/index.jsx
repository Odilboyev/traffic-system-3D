import { Button } from "@material-tailwind/react";

const WarningMessage = () => {
  // Function to reload the page
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="w-screen h-screen z-[99999000] fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md flex items-center justify-center">
      <div className="dark:bg-blue-gray-900 dark:text-white bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Warning: You are offline!</h2>
        <p className=" mb-6">Please check your internet connection.</p>
        <Button onClick={handleReload}>Reload</Button>
      </div>
    </div>
  );
};

export default WarningMessage;
