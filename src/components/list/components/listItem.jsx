const ListItem = ({ isActive, children, ...rest }) => {
  return (
    <div
      className={` text-left px-3 py-2 w-full border-l hover:bg-gray-800/50 !rounded-none transition-colors font-medium ${
        isActive && "bg-gray-800 text-blue-500"
      }`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default ListItem;
