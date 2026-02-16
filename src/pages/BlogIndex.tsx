import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { blogPosts, getSlugForLang } from "@/data/blogPosts";
import { useLanguagePrefix } from "@/hooks/useLanguagePrefix";
import { useState } from "react";

const BlogIndex = () => {
  const { t, i18n } = useTranslation();
  const { localePath } = useLanguagePrefix();
  const [activeTab, setActiveTab] = useState("blog");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead titleKey="seo.blogTitle" descriptionKey="seo.blogDescription" />
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          {t("blog.heading")}
        </h1>
        <p className="text-muted-foreground mb-10">{t("blog.subheading")}</p>

        <div className="grid gap-8">
          {blogPosts.map((post) => {
            const slug = getSlugForLang(post, i18n.language);
            return (
              <Link
                key={post.slug}
                to={localePath(`/blog/${slug}`)}
                className="group flex flex-col sm:flex-row gap-5 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
              >
                <img
                  src={post.imageUrl}
                  alt={t(post.titleKey)}
                  className="w-full sm:w-48 h-36 object-cover rounded-lg bg-white"
                />
                <div className="flex flex-col justify-center">
                  <time className="text-xs text-muted-foreground mb-1">
                    {new Date(post.date).toLocaleDateString(i18n.language === "en-GB" ? "en-GB" : "es-ES", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </time>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t(post.titleKey)}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {t(post.descriptionKey)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;
