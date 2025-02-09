const CustomSelect = ({
  label,
  name,
  errorMessage,
  options = [],
  disabled = false,
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
      <select
        id={name}
        name={name}
        className={`px-3 py-2 rounded-md border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
            ${errorMessage ? "border-red-500" : "border-gray-300"}
            dark:bg-gray-700 dark:text-white dark:border-gray-600`}
        disabled={disabled || options.length === 0}
        {...props}
      >
        <option value="" disabled>
          -- Sélectionnez --
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default CustomSelect;
