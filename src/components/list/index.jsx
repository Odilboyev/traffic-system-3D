const List = ({ children, ...rest }) => {
  return (
    <div className="rounded-lg flex flex-col gap-2 relative" {...rest}>
      {children}
    </div>
  );
};

export default List;
