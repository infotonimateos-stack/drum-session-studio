import { useEffect, useMemo, useState } from "react";
import i18n from "@/i18n";

// Lightweight client-side translator for arbitrary strings (ES -> target)
// Caches per-language in localStorage to avoid repeated calls
export function useTranslate() {
  const lng = i18n.language;
  const [tick, setTick] = useState(0); // force re-render when cache updates

  const storageKey = useMemo(() => `i18n-dyn-cache-${lng}-v1`, [lng]);

  const cache: Record<string, string> = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  }, [storageKey, tick]);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    i18n.on("languageChanged", onChange);
    return () => {
      i18n.off("languageChanged", onChange);
    };
  }, []);

  const mapToLT = (lngCode: string) => {
    const base = lngCode.split("-")[0];
    if (base === "nb") return "no"; // Norwegian mapping
    return base;
  };

  async function translate(text: string): Promise<string> {
    try {
      const res = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, source: "es", target: mapToLT(lng), format: "text" })
      });
      const data = await res.json();
      return data?.translatedText || text;
    } catch {
      return text;
    }
  }

  const tr = (text: string): string => {
    if (!text) return text;
    if (lng === "es-ES") return text;
    const hit = cache[text];
    if (hit) return hit;
    // kick off async translation, cache and re-render when done
    translate(text).then((t) => {
      try {
        const next = { ...(cache || {}), [text]: t };
        localStorage.setItem(storageKey, JSON.stringify(next));
        setTick((v) => v + 1);
      } catch {}
    });
    return text; // fallback until translated
  };

  return tr;
}
