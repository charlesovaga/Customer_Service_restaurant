const Message = ({ variant, children }) => {
  const variantClasses = {
    info: "bg-blue-100 text-blue-800 border-blue-300",
    success: "bg-green-100 text-green-800 border-green-300",
    danger: "bg-red-100 text-red-800 border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };

  const classes =
    variantClasses[variant] || "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <div className={`p-4 rounded-lg border ${classes}`} role="alert">
      {children}
    </div>
  );
};

Message.defaultProps = {
  variant: "info",
};

export default Message;
