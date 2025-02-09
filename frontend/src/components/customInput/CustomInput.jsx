const CustomInput = ({
  label,
  name,
  errorMessage,
  type = "text",
  ...props
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={`px-3 py-2 rounded-md border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
            ${errorMessage ? "border-red-500" : "border-gray-300"}
            dark:bg-gray-700 dark:text-white dark:border-gray-600`}
        aria-invalid={errorMessage ? "true" : "false"}
        {...props}
      />
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default CustomInput;
