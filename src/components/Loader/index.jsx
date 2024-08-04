const Loader = () => {
  return (
    <div className=" top-0 left-0 w-full min-h-[80vh] bg-gray-200 dark:bg-blue-gray-900 backdrop-blur-md rounded bg-opacity-75 flex items-center justify-center ">
      <div className=" rounded-lg p-8 flex items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white mr-4"></div>
        <span className="text-gray-900 font-bold text-2xl dark:text-white">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loader;
