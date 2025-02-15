import { useEffect } from "react";
import "@/styles/globals.css";
import "@/styles/themes.css";
import { Analytics } from "@vercel/analytics/react";
import CustomHead from "@/components/Head";
import Layout from "@/components/Layout";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
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
      <CustomHead title={`Elnur Maharramov | ${pageProps.title}`} />
      <Component {...pageProps} />
      <ToastContainer />
      <Analytics />
    </Layout>
  );
}

export default MyApp;
