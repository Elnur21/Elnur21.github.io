import styles from "@/styles/HobbiesPage.module.css";

const hobbies = [
  {
    id: "films",
    icon: "🎬",
    title: "Watching Films",
    description: "Enjoy a variety of film genres in my free time.",
    tags: ["Comedy", "Scientific", "Science Fiction"],
    color: "#569cd6",
  },
  {
    id: "walking",
    icon: "🚶",
    title: "Walking",
    description: "Love taking long walks to clear my mind and stay active.",
    tags: ["Outdoor", "Fitness", "Mindfulness"],
    color: "#4ec9b0",
  },
  {
    id: "mobile-games",
    icon: "📱",
    title: "Mobile Games",
    description: "Play mobile games to relax and challenge myself.",
    tags: ["Casual", "Strategy", "Puzzle"],
    color: "#dcdcaa",
  },
  {
    id: "chess",
    icon: "♟️",
    title: "Chess",
    description: "Study and play chess to sharpen strategic thinking.",
    tags: ["Strategy", "Logic", "Competitive"],
    color: "#ce9178",
  },
];

const HobbiesPage = () => {
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
          <div key={hobby.id} className={styles.card} style={{ "--card-color": hobby.color }}>
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
  return {
    props: { title: "Hobbies" },
  };
}

export default HobbiesPage;
