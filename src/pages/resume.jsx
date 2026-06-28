import styles from "@/styles/ResumePage.module.css";

const myResume = "/Resume.pdf";

const ResumePage = () => {
  return (
    <center>
      <h3>
        Resume (
        <a
          href={myResume}
          className={styles.underline}
          download="ElnurMaharramov_CV.pdf"
        >
          Download
        </a>
        )
      </h3>
      <br />
      <div
        className={styles.pdfContainer}
        style={{ height: "750px", width: "100%" }}
      >
        <iframe
          src={myResume}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Resume"
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
