import { FaCircleCheck, FaCircleExclamation, FaXmark } from "react-icons/fa6";

export default function Alert({
  type = "error",
  message,
  onClose,
  className = "",
}) {
  if (!message) return null;

  const styles = {
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  const icons = {
    error: <FaCircleExclamation className="text-red-500 shrink-0" size={18} />,
    success: <FaCircleCheck className="text-green-500 shrink-0" size={18} />,
    warning: <FaCircleExclamation className="text-yellow-500 shrink-0" size={18} />,
  };

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 rounded-xl border p-4 text-sm ${
        styles[type] || styles.error
      } ${className}`}
    >
      <div className="flex items-start gap-2.5">
        {icons[type] || icons.error}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close alert"
          className="rounded-lg p-1 hover:bg-black/5 transition"
        >
          <FaXmark size={16} />
        </button>
      )}
    </div>
  );
}
