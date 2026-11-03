import { FaXmark } from "react-icons/fa6";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-xl bg-white border border-[#31281F] shadow-[6px_6px_0_#31281F] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-orange-50">
          <h3 className="font-serif text-xl font-bold text-[#31281F]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition"
          >
            <FaXmark size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto text-gray-700">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-3 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
