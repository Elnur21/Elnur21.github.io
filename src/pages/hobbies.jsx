import styles from "@/styles/HobbiesPage.module.css";
import { getHobbies } from "./api/hobbies";

const HobbiesPage = ({ hobbies }) => {
  return (
    <>
      <div className={styles.header}>
        <span className={styles.comment}>{"// hobbies.jsx"}</span>
        <span className={styles.comment}>
          {"// Things I enjoy outside of work"}
        </span>
      </div>
      <br />
      <div className={styles.container}>
        {hobbies.map((hobby) => (
          <div
            key={hobby.id}
            className={styles.card}
            style={{ "--card-color": hobby.color }}
          >
            <div className={styles.cardIcon}>{hobby.icon}</div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle} style={{ color: hobby.color }}>
                {hobby.title}
              </h3>
              <p className={styles.cardDesc}>{hobby.description}</p>
              <div className={styles.tags}>
                {hobby.tags.map((tag) => (
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
  const hobbies = getHobbies();

  return {
    props: { title: "Hobbies", hobbies },
  };
}

export default HobbiesPage;
