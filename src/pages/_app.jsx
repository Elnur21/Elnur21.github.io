import { useEffect } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import "@/styles/themes.css";
import { Analytics } from "@vercel/analytics/react";
import CustomHead from "@/components/Head";
import Layout from "@/components/Layout";
import { ToastContainer } from "react-toastify";
import { useT } from "@/i18n";
import { personJsonLd, websiteJsonLd } from "@/libs/seo";

function MyApp({ Component, pageProps }) {
  const t = useT();
  const router = useRouter();
  const page = pageProps.title;
  const title = !page
    ? undefined
    : page === "Home"
      ? `${t("meta.name")} | ${t("home.role")}`
      : `${t(`titles.${page}`)} | ${t("meta.name")}`;

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      document.documentElement.setAttribute(
        "data-theme",
        localStorage.getItem("theme")
      );
    }
  }, []);

  return (
    <Layout>
      <CustomHead
        title={title}
        description={page && t(`meta.pages.${page}`)}
        jsonLd={[
          personJsonLd(t),
          ...(router.pathname === "/" ? [websiteJsonLd(t)] : []),
        ]}
        {...Component.getSeo?.(pageProps, router, t)}
      />
      <Component {...pageProps} />
      <ToastContainer />
      <Analytics />
    </Layout>
  );
}

export default MyApp;
