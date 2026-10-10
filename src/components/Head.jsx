import Head from "next/head";
import { useT } from "@/i18n";

const CustomHead = ({ title }) => {
  const t = useT();
  return (
    <Head>
      <title>{title || t("meta.name")}</title>
      <meta name="description" content={t("meta.description")} />
      <meta name="keywords" content="Elnur Maharramov, elnur, maharramov, Elnur Məhərrəmov, Эльнур Магеррамов" />
      <meta property="og:title" content={t("meta.title")} />
      <meta property="og:description" content={t("meta.description")} />
      <meta property="og:locale" content={{ en: "en_US", az: "az_AZ", ru: "ru_RU" }[t.locale]} />
    </Head>
  );
};

export default CustomHead;
