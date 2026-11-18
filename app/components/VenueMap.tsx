"use client";

import { useEffect, useRef, useState } from "react";

const mapUrl = "https://www.google.com/maps?q=Grand+Monarch+Thalawathugoda&output=embed";

export default function VenueMap({ active }: { active: boolean }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active || ready || !frame.current) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(timer);
    }

    let cancelled = false;
    const observer = new IntersectionObserver(entries => {
      if (!cancelled && entries.some(entry => entry.isIntersecting)) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "600px 0px" });
    observer.observe(frame.current);
    return () => { cancelled = true; observer.disconnect(); };
  }, [active, ready]);

  return <iframe
    ref={frame}
    title="Map to Grand Monarch Thalawathugoda"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    src={ready ? mapUrl : undefined}
    onFocus={() => setReady(true)}
  />;
}
