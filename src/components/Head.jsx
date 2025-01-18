import Head from "next/head";

const CustomHead = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="Elnur Maharramov's Profolio." />
      <meta name="keywords" content="Elnur Maharramov, elnur, maharramov" />
      <meta property="og:title" content="Elnur Maharramov's Portfolio" />
      <meta property="og:description" content="Elnur Maharramov's Profolio." />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: "Elnur Maharramov",
};
