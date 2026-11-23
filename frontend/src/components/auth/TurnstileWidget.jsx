import React, { useEffect, useRef } from "react";

export default function TurnstileWidget({ onVerify, siteKey }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const resolvedSiteKey =
    siteKey ||
    import.meta.env.VITE_TURNSTILE_SITE_KEY ||
    import.meta.env.Turnstile_SITE_KEY ||
    "1x00000000000000000000AA";

  useEffect(() => {
    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: resolvedSiteKey,
            callback: (token) => {
              onVerify(token);
            },
            "expired-callback": () => {
              onVerify(null);
            },
            "error-callback": () => {
              onVerify(null);
            },
          });
        } catch (e) {
          console.error("Turnstile render error:", e);
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      if (!document.getElementById("turnstile-script")) {
        const script = document.createElement("script");
        script.id = "turnstile-script";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        script.onload = renderWidget;
        document.body.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(interval);
            renderWidget();
          }
        }, 100);
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {}
      }
    };
  }, [resolvedSiteKey]);

  return <div ref={containerRef} className="my-3 flex justify-center" />;
}
