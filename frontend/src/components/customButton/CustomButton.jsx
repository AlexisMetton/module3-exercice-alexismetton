import cn from "../../utils/cn" // Permet de gérer les classes dynamiquement

const CustomButton = ({ type = "button", className, children, ...props }) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-all",
        "bg-blue-600 text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className // Permet d'ajouter des classes supplémentaires si besoin
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
