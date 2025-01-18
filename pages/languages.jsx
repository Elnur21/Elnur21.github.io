import React, { useState } from "react";
import styles from "../styles/LanguagesPage.module.css";

const LanguagesPage = ({ repos }) => {
  const [openLanguage, setOpenLanguage] = useState(null);

  const toggleAccordion = (language) => {
    setOpenLanguage((prevLanguage) =>
      prevLanguage === language ? null : language
    );
  };

  return (
    <>
      <h3>Programming Languages</h3>
      <br />
      <div className={styles.container}>
        {Object.keys(repos).map((language) => (
          <div key={language} className={styles.accordion}>
            <div
              className={styles.accordionHeader}
              onClick={() => toggleAccordion(language)}
              style={{
                cursor: "pointer",
                padding: "10px",
                marginBottom: "5px",
                fontWeight: "bold",
                border: "1px solid #ccc",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{language}</span>
              <span
                style={{
                  transform:
                    openLanguage === language
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              >
                ▼
              </span>
            </div>
            {openLanguage === language && (
              <div
                className={styles.accordionContent}
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderTop: "none",
                  borderRadius: "4px",
                }}
              >
                <div className={styles.cardContainer}>
                  {repos[language]?.map((repo) => (
                    <div key={repo.name} className={styles.card}>
                      <div className={styles.content}>
                        <h3>{repo.name}</h3>
                        <p>
                          <strong>Description:</strong> {repo.description}
                        </p>
                        <p>
                          <strong>Last Pushed At:</strong>{" "}
                          {new Date(repo.pushed_at).toLocaleDateString()}
                        </p>
                        <div className={styles.cta}>
                          <a
                            href={`https://github.com/Elnur21/${repo.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.underline}
                          >
                            View Repository
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export async function getStaticProps() {
  const repoRes = await fetch(
    `https://api.github.com/users/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}/repos?per_page=200`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_API_KEY}`,
      },
    }
  );
  let repos = await repoRes.json();
  const groupedRepos = repos.reduce((acc, repo) => {
    const { language, name, description, pushed_at } = repo;
    if (!acc[language]) {
      acc[language] = [];
    }
    acc[language].push({ name, description, pushed_at, language });
    return acc;
  }, {});
  return {
    props: { title: "Languages", repos: groupedRepos },
  };
}

export default LanguagesPage;
