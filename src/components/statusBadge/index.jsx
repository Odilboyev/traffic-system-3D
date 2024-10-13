import getRowColor from "../../configurations/getRowColor";

const StatusBadge = ({ status, statusName = "", ...rest }) => {
  const getStatusIconColor = () => {
    switch (status) {
      case 0:
        return "bg-green-500 text-green-800";
      case 1:
        return "bg-orange-500 text-orange-800";
      case 2:
        return "bg-red-500 text-red-800";
      default:
        return "bg-gray-500 text-gray-800";
    }
  };

  return (
    <div
      className={`flex items-center space-x-2 px-2 py-1 rounded-full ${getRowColor(
        status
      )}`}
      {...rest}
    >
      <span className={`w-2 h-2 rounded-full ${getStatusIconColor()}`}></span>
      <span className="text-sm font-medium">{statusName}</span>
    </div>
  );
};

export default StatusBadge;
