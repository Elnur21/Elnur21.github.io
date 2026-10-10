import { useMemo, useState } from "react";

import ForkIcon from "@/components/icons/ForkIcon";
import StarIcon from "@/components/icons/StarIcon";
import GithubIcon from "@/components/icons/GithubIcon";
import LinkIcon from "@/components/icons/LinkIcon";
import styles from "@/styles/RepositoriesPage.module.css";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Same colors GitHub uses for its language dots
const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  "Jupyter Notebook": "#DA5B0B",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  PHP: "#4F5D95",
  Go: "#00ADD8",
  Shell: "#89e051",
  Vue: "#41b883",
  EJS: "#a91e50",
  Dart: "#00B4AB",
};

const SORTS = {
  pushed: { label: "Recently pushed", fn: (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at) },
  created: { label: "Newest", fn: (a, b) => new Date(b.created_at) - new Date(a.created_at) },
  stars: { label: "Most stars", fn: (a, b) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count },
  name: { label: "Name", fn: (a, b) => a.name.localeCompare(b.name) },
};

// Formatted by hand (not toLocaleDateString) so server and client render the same string
const formatDate = (iso) => {
  const date = new Date(iso);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};

const RepoRow = ({ repo }) => (
  <article className={styles.repo}>
    <div className={styles.repoMain}>
      <div className={styles.repoHead}>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.repoName}
        >
          {repo.name}
        </a>
        {repo.fork && <span className={styles.badge}>fork</span>}
        {repo.archived && <span className={styles.badge}>archived</span>}
      </div>
      {repo.description && <p className={styles.description}>{repo.description}</p>}
      {repo.topics.length > 0 && (
        <div className={styles.topics}>
          {repo.topics.map((topic) => (
            <span key={topic} className={styles.topic}>
              {topic}
            </span>
          ))}
        </div>
      )}
      <div className={styles.meta}>
        {repo.language && (
          <span>
            <span
              className={styles.dot}
              style={{ background: LANGUAGE_COLORS[repo.language] || "var(--accent-color)" }}
            />
            {repo.language}
          </span>
        )}
        <span>
          <StarIcon className={styles.icon} /> {repo.stargazers_count}
        </span>
        <span>
          <ForkIcon className={styles.icon} /> {repo.forks_count}
        </span>
        <span>Updated {formatDate(repo.pushed_at)}</span>
      </div>
    </div>
    <div className={styles.links}>
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" title="Source">
        <GithubIcon height={18} width={18} className={styles.icon} />
      </a>
      {repo.homepage && (
        <a href={repo.homepage} target="_blank" rel="noopener noreferrer" title="Live demo">
          <LinkIcon height={18} width={18} className={styles.icon} />
        </a>
      )}
    </div>
  </article>
);

const RepositoriesPage = ({ repos, languages }) => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState(null);
  const [sort, setSort] = useState("pushed");
  const [liveOnly, setLiveOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repos
      .filter((repo) => !language || repo.language === language)
      .filter((repo) => !liveOnly || repo.homepage)
      .filter(
        (repo) =>
          !q ||
          repo.name.toLowerCase().includes(q) ||
          repo.description?.toLowerCase().includes(q) ||
          repo.topics.some((topic) => topic.includes(q))
      )
      .sort(SORTS[sort].fn);
  }, [repos, query, language, sort, liveOnly]);

  if (repos.length === 0) {
    return <p>GitHub data is currently unavailable. Please try again later.</p>;
  }

  const stats = [
    { label: "repositories", value: repos.length },
    { label: "stars", value: repos.reduce((sum, r) => sum + r.stargazers_count, 0) },
    { label: "forks", value: repos.reduce((sum, r) => sum + r.forks_count, 0) },
    { label: "languages", value: languages.length },
    { label: "live demos", value: repos.filter((r) => r.homepage).length },
  ];

  return (
    <>
      <div className={styles.header}>
        <span className={styles.comment}>{"// repositories.json"}</span>
        <span className={styles.comment}>
          {"// Every public repository, searchable and sortable"}
        </span>
      </div>

      <div className={styles.stats}>
        {stats.map(({ label, value }) => (
          <div key={label} className={styles.stat}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search name, description or topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={styles.select}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {Object.entries(SORTS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={liveOnly}
            onChange={(e) => setLiveOnly(e.target.checked)}
          />
          Live demo
        </label>
      </div>

      <div className={styles.filters}>
        {[null, ...languages].map((lang) => (
          <button
            key={lang || "all"}
            className={`${styles.filter} ${language === lang ? styles.filterActive : ""}`}
            onClick={() => setLanguage(lang)}
          >
            {lang && (
              <span
                className={styles.dot}
                style={{ background: LANGUAGE_COLORS[lang] || "var(--accent-color)" }}
              />
            )}
            {lang || "All"}
          </button>
        ))}
      </div>

      <p className={styles.count}>
        {filtered.length} of {repos.length} repositories
      </p>

      <div className={styles.list}>
        {filtered.map((repo) => (
          <RepoRow key={repo.id} repo={repo} />
        ))}
        {filtered.length === 0 && (
          <p className={styles.empty}>{"// no repositories match these filters"}</p>
        )}
      </div>
    </>
  );
};

export async function getStaticProps() {
  try {
    const repoRes = await fetch(
      `https://api.github.com/users/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}/repos?per_page=100`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      }
    );

    if (!repoRes.ok) throw new Error(`GitHub repos API error: ${repoRes.status}`);
    const data = await repoRes.json();

    if (!Array.isArray(data)) throw new Error("Invalid repos response");

    // Keep only the fields the page uses; the raw API objects are mostly URLs
    const repos = data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage || null,
      language: repo.language,
      topics: repo.topics || [],
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      fork: repo.fork,
      archived: repo.archived,
      created_at: repo.created_at,
      pushed_at: repo.pushed_at,
    }));

    // Languages ordered by how many repos use them
    const counts = {};
    repos.forEach(({ language }) => {
      if (language) counts[language] = (counts[language] || 0) + 1;
    });
    const languages = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    return {
      props: { title: "Repositories", repos, languages },
      revalidate: 30,
    };
  } catch {
    return {
      props: { title: "Repositories", repos: [], languages: [] },
      revalidate: 30,
    };
  }
}

export default RepositoriesPage;
