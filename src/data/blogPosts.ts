export interface BlogPost {
  slug: string;
  slugEn: string;
  titleKey: string;
  descriptionKey: string;
  contentKey: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "como-grabar-baterias-online-profesionalmente",
    slugEn: "how-to-record-drums-online-professionally",
    titleKey: "blog.post1.title",
    descriptionKey: "blog.post1.description",
    contentKey: "blog.post1.content",
    date: "2025-06-15",
    imageUrl: "/lovable-uploads/903f1003-c2ac-486f-970e-14aeef1bdc43.png",
    tags: ["grabación", "batería", "online"],
  },
  {
    slug: "mejores-microfonos-para-bateria",
    slugEn: "best-microphones-for-drums",
    titleKey: "blog.post2.title",
    descriptionKey: "blog.post2.description",
    contentKey: "blog.post2.content",
    date: "2025-05-20",
    imageUrl: "/lovable-uploads/55fddddd-e10a-4c7d-9852-36db51337402.png",
    tags: ["micrófonos", "equipo", "técnica"],
  },
  {
    slug: "previos-api-neve-dad-diferencias",
    slugEn: "api-neve-dad-preamps-differences",
    titleKey: "blog.post3.title",
    descriptionKey: "blog.post3.description",
    contentKey: "blog.post3.content",
    date: "2025-04-10",
    imageUrl: "/lovable-uploads/preamps-pro-pack.png",
    tags: ["previos", "API", "Neve", "DAD"],
  },
  {
    slug: "toni-mateos-35-anos-de-carrera",
    slugEn: "toni-mateos-35-years-career",
    titleKey: "blog.post4.title",
    descriptionKey: "blog.post4.description",
    contentKey: "blog.post4.content",
    date: "2025-03-01",
    imageUrl: "/lovable-uploads/890c7bbc-79ba-4df4-8441-4cbf232e9b5c.png",
    tags: ["Toni Mateos", "carrera", "artistas"],
  },
  {
    slug: "como-preparar-proyecto-daw-sesion-bateria-remota",
    slugEn: "how-to-prepare-daw-project-remote-drum-session",
    titleKey: "blog.post5.title",
    descriptionKey: "blog.post5.description",
    contentKey: "blog.post5.content",
    date: "2025-07-10",
    imageUrl: "/lovable-uploads/0de754df-90d3-49fe-b9df-9d10250b037c.png",
    tags: ["DAW", "preparación", "sesión remota"],
  },
  {
    slug: "bateria-real-vs-ritmos-programados",
    slugEn: "real-drums-vs-programmed-beats",
    titleKey: "blog.post6.title",
    descriptionKey: "blog.post6.description",
    contentKey: "blog.post6.content",
    date: "2025-08-05",
    imageUrl: "/lovable-uploads/5b4e514d-0c50-42a1-834a-3b4c1d7ab825.png",
    tags: ["batería real", "programación", "producción"],
  },
  {
    slug: "30-anos-baterista-sesion-lecciones",
    slugEn: "30-years-session-drumming-lessons-global-stars",
    titleKey: "blog.post7.title",
    descriptionKey: "blog.post7.description",
    contentKey: "blog.post7.content",
    date: "2025-09-01",
    imageUrl: "/lovable-uploads/b68b9884-03e0-40e8-8f4e-21e5ce19fc08.png",
    tags: ["carrera", "experiencia", "artistas internacionales"],
  },
  {
    slug: "bateria-de-alejandro-sanz",
    slugEn: "drumming-for-alejandro-sanz",
    titleKey: "blog.post8.title",
    descriptionKey: "blog.post8.description",
    contentKey: "blog.post8.content",
    date: "2025-10-01",
    imageUrl: "/lovable-uploads/alejandro-sanz-es-concierto.png",
    tags: ["Alejandro Sanz", "sesión", "experiencia", "estudio"],
  },
  {
    slug: "bateria-de-la-voz",
    slugEn: "drummer-for-la-voz-the-voice",
    titleKey: "blog.post9.title",
    descriptionKey: "blog.post9.description",
    contentKey: "blog.post9.content",
    date: "2025-11-01",
    imageUrl: "/lovable-uploads/the-voice-logo.png",
    tags: ["La Voz", "televisión", "directo", "experiencia"],
  },
  {
    slug: "bateria-de-sergio-dalma",
    slugEn: "drummer-for-sergio-dalma",
    titleKey: "blog.post10.title",
    descriptionKey: "blog.post10.description",
    contentKey: "blog.post10.content",
    date: "2025-12-01",
    imageUrl: "/lovable-uploads/sergio-dalma-treinta-y-tanto.png",
    tags: ["Sergio Dalma", "sesión", "estudio", "rock"],
  },
];

export const getBlogPostBySlug = (slug: string, lang: string): BlogPost | undefined => {
  return blogPosts.find((p) =>
    lang === "en-GB" ? p.slugEn === slug : p.slug === slug
  );
};

export const getSlugForLang = (post: BlogPost, lang: string): string =>
  lang === "en-GB" ? post.slugEn : post.slug;
