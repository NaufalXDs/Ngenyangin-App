export default function Card({
  title,
  subtitle,
  children,
  footer,
  className = "",
  bodyClassName = "",
  headerAction,
}) {
  return (
    <div
      className={`rounded-[10px] border border-border shadow-md bg-card overflow-hidden transition ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/40">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-foreground">
                {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5 font-medium">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className={`p-6 text-foreground ${bodyClassName}`}>{children}</div>

      {footer && (
        <div className="border-t border-border px-6 py-3 bg-muted/20 flex items-center justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  );
}
