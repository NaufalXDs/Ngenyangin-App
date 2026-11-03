export default function Card({
  title,
  subtitle,
  children,
  footer,
  className = "",
  headerAction,
}) {
  return (
    <div
      className={`rounded-xl border border-[#31281F] bg-white shadow-[4px_4px_0_#31281F] overflow-hidden transition ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-orange-50/50">
          <div>
            {title && (
              <h3 className="font-serif text-lg font-bold text-[#31281F]">
                {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className="p-6 text-gray-700">{children}</div>

      {footer && (
        <div className="border-t border-gray-100 px-6 py-3 bg-gray-50/50 flex items-center justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  );
}
