import styles from "@/styles/HobbiesPage.module.css";
import { getHobbies } from "./api/hobbies";

// Line icons drawn on a 24x24 grid; stroke follows each card's color
const ICONS = {
  film: (
    <>
      <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />
      <path d="m6.2 5.3 3.1 3.9" />
      <path d="m12.4 3.4 3.1 4" />
      <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </>
  ),
  walk: (
    <>
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
      <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
      <path d="M16 17h4" />
      <path d="M4 13h4" />
    </>
  ),
  game: (
    <>
      <path d="M6 11h4" />
      <path d="M8 9v4" />
      <path d="M15 12h.01" />
      <path d="M18 10h.01" />
      <path d="M17.32 5H6.68a4 4 0 0 0-3.98 3.59C2.6 9.42 2 14.46 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.41-1.41A2 2 0 0 1 9.83 16h4.34a2 2 0 0 1 1.41.59L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.54-.6-6.58-.69-7.26A4 4 0 0 0 17.32 5Z" />
    </>
  ),
  chess: (
    <>
      <circle cx="12" cy="5.5" r="2.5" />
      <path d="M9.5 10h5" />
      <path d="M10.3 10c-.3 3-1.2 5.3-2.8 7h9c-1.6-1.7-2.5-4-2.8-7" />
      <rect x="5" y="17" width="14" height="4" rx="1" />
    </>
  ),
};

const HobbyIcon = ({ name }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={styles.icon}
  >
    {ICONS[name]}
  </svg>
);

const HobbiesPage = ({ hobbies }) => {
  return (
    <>
      <div className={styles.header}>
        <span className={styles.comment}>{"// hobbies.jsx"}</span>
        <span className={styles.comment}>
          {"// Things I enjoy outside of work"}
        </span>
      </div>
      <div className={styles.container}>
        {hobbies.map((hobby, index) => (
          <article
            key={hobby.id}
            className={styles.card}
            style={{ "--card-color": hobby.color }}
          >
            <div className={styles.cardHead}>
              <div className={styles.iconTile}>
                <HobbyIcon name={hobby.icon} />
              </div>
              <h3 className={styles.cardTitle}>{hobby.title}</h3>
              <span className={styles.cardIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className={styles.cardDesc}>{hobby.description}</p>
            <div className={styles.tags}>
              {hobby.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
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
