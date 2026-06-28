import styles from "@/styles/ExperiencePage.module.css";
import { getExperience } from "./api/experience";

const ExperiencePage = ({ experiences }) => {
  return (
    <>
      <div className={styles.header}>
        <span className={styles.comment}>{"// experience.json"}</span>
        <span className={styles.comment}>{"// Work history & positions"}</span>
      </div>
      <br />
      <div className={styles.timeline}>
        {experiences.map((exp) => (
          <div key={exp.id} className={styles.item}>
            <div className={styles.dot} />
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <h3 className={styles.role}>{exp.role}</h3>
                  <span className={styles.company}>
                    {exp.company}
                    {exp.location && (
                      <span className={styles.location}> · {exp.location}</span>
                    )}
                  </span>
                </div>
                <div className={styles.meta}>
                  <span className={styles.period}>{exp.period}</span>
                  <span
                    className={`${styles.badge} ${
                      exp.current ? styles.badgeCurrent : ""
                    }`}
                  >
                    {exp.current ? "Current" : exp.type}
                  </span>
                </div>
              </div>
              <p className={styles.desc}>{exp.description}</p>
              <div className={styles.tags}>
                {exp.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export async function getStaticProps() {
  const experiences = getExperience();

  return {
    props: { title: "Experience", experiences },
  };
}

export default ExperiencePage;
