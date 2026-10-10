import styles from "@/styles/ResumePage.module.css";
import { useT } from "@/i18n";


const myResume = "/Resume.pdf";

const ResumePage = () => {
  const t = useT();
  return (
    <center>
      <h3>
        {t("resume.title")} (
        <a
          href={myResume}
          className={styles.underline}
          download="ElnurMaharramov_CV.pdf"
        >
          {t("resume.download")}
        </a>
        )
      </h3>
      {/* Most phone browsers can't show a PDF inside a page */}
      <a
        href={myResume}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.underline} ${styles.openLink}`}
      >
        {t("resume.open")}
      </a>
      <br />
      <div className={styles.pdfContainer}>
        <iframe
          src={myResume}
          style={{ width: "100%", height: "100%", border: "none" }}
          title={t("resume.title")}
        />
      </div>
    </center>
  );
};

export async function getStaticProps() {
  return {
    props: { title: "Resume" },
  };
}

export default ResumePage;
