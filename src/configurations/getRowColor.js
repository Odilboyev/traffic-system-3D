const getRowColor = (status) => {
  switch (Number(status)) {
    case 0:
      return "bg-green-100 text-center dark:bg-green-900 dark:text-white";
    case 1:
      return "bg-orange-100 text-center dark:bg-orange-900 dark:text-white";
    case 2:
      return "bg-red-100 text-center dark:bg-red-900 dark:text-white";
    case 3:
      return "bg-blue-gray-100 text-gray-900 text-center dark:bg-blue-gray-700 dark:text-white";
    default:
      return "bg-white text-center dark:bg-blue-gray-900 dark:text-white";
  }
};
export default getRowColor;
