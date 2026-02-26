/**
 * Route configuration for SEO-optimized URLs.
 * Maps tab names and configurator steps to localized URL path segments.
 */

export const tabPaths: Record<string, Record<string, string>> = {
  "es-ES": {
    configure: "grabacion-baterias-online",
    about: "baterista-online",
    studio: "estudio-grabacion-baterias",
    samples: "descarga-muestra-bateria-online",
    tutorials: "tutorial-mezcla-grabacion-bateria",
    faq: "faq-grabacion-bateria-online",
    contact: "contacto-baterista-remoto",
  },
  "en-GB": {
    configure: "remote-custom-drum-tracks",
    about: "remote-drummer",
    studio: "drums-recording-studio",
    samples: "download-remote-drum-sample",
    tutorials: "drum-mixing-recording-tutorial",
    faq: "online-drum-recording-faq",
    contact: "contact-remote-drummer",
  },
};

export const stepPaths: Record<string, string[]> = {
  "es-ES": [
    "elegir-bateria-online",
    "microfonos-grabacion-bateria",
    "previos-grabacion-bateria",
    "interfaz-grabacion-bateria",
    "produccion-grabacion-bateria",
    "video-grabacion-bateria",
    "tomas-grabacion-bateria",
    "entrega-grabacion-bateria-online",
    "extras-grabacion-bateria",
  ],
  "en-GB": [
    "choose-remote-drum-kit",
    "drum-recording-microphones",
    "drum-recording-preamps",
    "drum-recording-interface",
    "drum-recording-production",
    "drum-recording-video",
    "drum-recording-takes",
    "remote-drum-recording-delivery",
    "drum-recording-extras",
  ],
};

export const blogPaths: Record<string, string> = {
  "es-ES": "blog-grabacion-bateria",
  "en-GB": "drum-recording-blog",
};

/** Resolve a URL path segment to a tab name */
export const getTabFromPath = (pathSegment: string, lang: string): string | null => {
  const tabs = tabPaths[lang] || tabPaths["es-ES"];
  for (const [tab, path] of Object.entries(tabs)) {
    if (path === pathSegment) return tab;
  }
  return null;
};

/** Resolve a URL path segment to a step index (returns 0 for the configure tab path too) */
export const getStepFromPath = (pathSegment: string, lang: string): number | null => {
  // The configure tab path maps to step 0
  const tabs = tabPaths[lang] || tabPaths["es-ES"];
  if (pathSegment === tabs.configure) return 0;

  const steps = stepPaths[lang] || stepPaths["es-ES"];
  const index = steps.indexOf(pathSegment);
  return index >= 0 ? index : null;
};

/** Get the URL path segment for a tab */
export const getTabPath = (tab: string, lang: string): string => {
  const tabs = tabPaths[lang] || tabPaths["es-ES"];
  return tabs[tab] || tabs.configure;
};

/** Get the URL path segment for a configurator step */
export const getStepPath = (stepIndex: number, lang: string): string => {
  const steps = stepPaths[lang] || stepPaths["es-ES"];
  return steps[stepIndex] || steps[0];
};

/** Build a full path with language prefix */
export const getFullPath = (segment: string, lang: string): string => {
  const prefix = lang === "en-GB" ? "/en" : "";
  return `${prefix}/${segment}`;
};

/** Extract the path segment from a full pathname (removes /en/ prefix and leading slash) */
export const extractPathSegment = (pathname: string): string => {
  return pathname
    .replace(/^\/en\//, "")
    .replace(/^\/en$/, "")
    .replace(/^\//, "")
    .replace(/\/$/, "");
};

/**
 * Get the equivalent path in the other language.
 * Maps tab paths and step paths to their counterpart.
 */
export const getAlternateLanguagePathFromRoutes = (
  currentPath: string,
  currentLang: string
): string => {
  const targetLang = currentLang === "en-GB" ? "es-ES" : "en-GB";
  const segment = extractPathSegment(currentPath);

  // Check if it's a tab path
  const tab = getTabFromPath(segment, currentLang);
  if (tab) return getFullPath(getTabPath(tab, targetLang), targetLang);

  // Check if it's a step path
  const step = getStepFromPath(segment, currentLang);
  if (step !== null) return getFullPath(getStepPath(step, targetLang), targetLang);

  // Check if it's a blog path
  const currentBlog = blogPaths[currentLang] || blogPaths["es-ES"];
  const targetBlog = blogPaths[targetLang] || blogPaths["es-ES"];
  if (segment === currentBlog) return getFullPath(targetBlog, targetLang);
  if (segment.startsWith(currentBlog + "/")) {
    // Blog post — keep the slug (posts have their own localized slugs handled elsewhere)
    const slug = segment.replace(currentBlog + "/", "");
    return getFullPath(`${targetBlog}/${slug}`, targetLang);
  }

  // Fallback: swap prefix only
  if (currentLang === "en-GB") {
    return currentPath.replace(/^\/en/, "") || "/";
  }
  return `/en${currentPath === "/" ? "" : currentPath}`;
};

/** Get all main route path segments for a language (tabs + steps), used for route registration */
export const getAllMainPaths = (lang: string): string[] => {
  const tabs = tabPaths[lang] || tabPaths["es-ES"];
  const steps = stepPaths[lang] || stepPaths["es-ES"];
  return [...Object.values(tabs), ...steps];
};
