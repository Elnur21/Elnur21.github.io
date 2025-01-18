import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
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
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
          <Viewer
            fileUrl={myResume}
            defaultScale={1.5}
            onError={(error) => console.error("Error loading PDF:", error)}
          />
        </Worker>
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
