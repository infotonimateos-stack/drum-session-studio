import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { getBlogPostBySlug } from "@/data/blogPosts";
import { useLanguagePrefix } from "@/hooks/useLanguagePrefix";
import { useState } from "react";
import { blogPaths } from "@/config/routes";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const { localePath } = useLanguagePrefix();
  const blogPath = blogPaths[i18n.language] || blogPaths["es-ES"];
  const [activeTab, setActiveTab] = useState("blog");

  const post = slug ? getBlogPostBySlug(slug, i18n.language) : undefined;

  // Title is now managed by SEOHead via Helmet

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {t("blog.notFound", "Artículo no encontrado")}
            </h1>
            <Link to={localePath(`/${blogPath}`)} className="text-primary hover:underline">
              {t("blog.backToList", "← Volver al blog")}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Split content by newlines for paragraph rendering
  const paragraphs = t(post.contentKey).split("\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead titleKey={post.titleKey} descriptionKey={post.descriptionKey} image={`https://tonimateos.com${post.imageUrl}`} />
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <Link
          to={localePath(`/${blogPath}`)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("blog.backToList", "Volver al blog")}
        </Link>

        <article>
          <time className="text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString(i18n.language === "en-GB" ? "en-GB" : "es-ES", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </time>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-1 mb-6">
            {t(post.titleKey)}
          </h1>
          <img
            src={post.imageUrl}
            alt={t(post.titleKey)}
            className="w-full rounded-xl mb-8 bg-white object-cover max-h-96"
          />
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-foreground/90 leading-relaxed mb-4">
                {p}
              </p>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
