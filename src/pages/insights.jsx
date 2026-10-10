import { useState } from "react";
import Image from "next/image";

import styles from "@/styles/InsightsPage.module.css";

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

const DAY = 24 * 60 * 60 * 1000;

// Formatted by hand (not toLocaleDateString) so server and client render the same string
const formatDate = (iso) => {
  const date = new Date(iso);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};

const formatDuration = (days) => {
  if (days < 1) return "same day";
  if (days < 60) return `${days} day${days === 1 ? "" : "s"}`;
  if (days < 730) return `${Math.round(days / 30)} months`;
  return `${(days / 365).toFixed(1)} years`;
};

const languageColor = (language) => LANGUAGE_COLORS[language] || "var(--accent-color)";

const Section = ({ title, comment, children }) => (
  <section className={styles.section}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    {comment && <span className={styles.comment}>{comment}</span>}
    {children}
  </section>
);

const Profile = ({ user, yearsOnGithub }) => (
  <a
    href={user.html_url}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.profile}
  >
    <Image
      src={user.avatar_url}
      alt={user.login}
      width={72}
      height={72}
      className={styles.avatar}
    />
    <div className={styles.profileText}>
      <span className={styles.prompt}>
        $ whoami <span className={styles.cursor}>▍</span>
      </span>
      <h2 className={styles.name}>{user.name || user.login}</h2>
      <span className={styles.profileMeta}>
        @{user.login}
        {user.location && ` · ${user.location}`} · on GitHub for {yearsOnGithub} years
      </span>
    </div>
  </a>
);

const YearChart = ({ years }) => {
  const [active, setActive] = useState(null);
  const max = Math.max(...years.map((y) => y.count));

  return (
    <div className={styles.yearChart}>
      {years.map((year) => (
        <div
          key={year.year}
          className={styles.yearColumn}
          onMouseEnter={() => setActive(year.year)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(year.year)}
          onBlur={() => setActive(null)}
          tabIndex={0}
        >
          {active === year.year && (
            <div className={styles.tooltip}>
              <strong>
                {year.year}: {year.count} repo{year.count === 1 ? "" : "s"}
              </strong>
              {year.names.slice(0, 6).map((name) => (
                <span key={name}>{name}</span>
              ))}
              {year.names.length > 6 && <span>+{year.names.length - 6} more</span>}
            </div>
          )}
          <span className={styles.yearValue}>{year.count}</span>
          <div className={styles.yearTrack}>
            <div
              className={`${styles.yearBar} ${active === year.year ? styles.yearBarActive : ""}`}
              style={{ height: `${(year.count / max) * 100}%` }}
            />
          </div>
          <span className={styles.yearLabel}>{year.year}</span>
        </div>
      ))}
    </div>
  );
};

const LanguageBars = ({ languages, total }) => (
  <div className={styles.languages}>
    {languages.map(({ language, count }) => (
      <div key={language} className={styles.languageRow} title={`${language}: ${count} repos`}>
        <span className={styles.languageName}>
          <span className={styles.dot} style={{ background: languageColor(language) }} />
          {language}
        </span>
        <div className={styles.languageTrack}>
          <div
            className={styles.languageBar}
            style={{
              width: `${(count / languages[0].count) * 100}%`,
              background: languageColor(language),
            }}
          />
        </div>
        <span className={styles.languageValue}>
          {count} · {Math.round((count / total) * 100)}%
        </span>
      </div>
    ))}
  </div>
);

const TopicCloud = ({ topics }) => {
  const max = topics[0]?.count || 1;
  return (
    <div className={styles.cloud}>
      {topics.map(({ topic, count }) => (
        <span
          key={topic}
          className={styles.cloudTopic}
          title={`${count} repo${count === 1 ? "" : "s"}`}
          style={{
            fontSize: `${0.75 + (count / max) * 0.75}rem`,
            opacity: 0.55 + (count / max) * 0.45,
          }}
        >
          #{topic}
        </span>
      ))}
    </div>
  );
};

const Highlight = ({ label, repo, detail }) => (
  <a
    href={repo.html_url}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.highlight}
  >
    <span className={styles.highlightLabel}>{label}</span>
    <span className={styles.highlightName}>{repo.name}</span>
    <span className={styles.highlightDetail}>{detail}</span>
  </a>
);

const GitLog = ({ repos }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? repos : repos.slice(0, 8);

  return (
    <div className={styles.gitLog}>
      {visible.map((repo, i) => {
        const yearChanged =
          i === 0 || repos[i - 1].created_at.slice(0, 4) !== repo.created_at.slice(0, 4);
        return (
          <div key={repo.id}>
            {yearChanged && (
              <div className={styles.logYear}>
                <span className={styles.graph}>|</span>
                <span className={styles.tag}>tag: {repo.created_at.slice(0, 4)}</span>
              </div>
            )}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.logLine}
            >
              <span className={styles.graph}>*</span>
              <span className={styles.hash}>{repo.hash}</span>
              <span className={styles.logDate}>{formatDate(repo.created_at)}</span>
              {repo.language && (
                <span className={styles.logLanguage}>
                  <span className={styles.dot} style={{ background: languageColor(repo.language) }} />
                  {repo.language}
                </span>
              )}
              <span className={styles.logMessage}>
                init <strong>{repo.name}</strong>
                {repo.description && ` — ${repo.description}`}
              </span>
            </a>
          </div>
        );
      })}
      {repos.length > 8 && (
        <button className={styles.more} onClick={() => setShowAll(!showAll)}>
          {showAll ? "$ git log -n 8" : `$ git log --all  (${repos.length - 8} more)`}
        </button>
      )}
    </div>
  );
};

const InsightsPage = ({ user, stats, years, languages, topics, highlights, log, yearsOnGithub }) => {
  if (!user) {
    return <p>GitHub data is currently unavailable. Please try again later.</p>;
  }

  return (
    <>
      <div className={styles.header}>
        <span className={styles.comment}>{"# insights.py"}</span>
        <span className={styles.comment}>
          {"# What my public GitHub repositories say about how I build"}
        </span>
      </div>

      <Profile user={user} yearsOnGithub={yearsOnGithub} />

      <div className={styles.stats}>
        {stats.map(({ label, value }) => (
          <div key={label} className={styles.stat}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <Section title="Repositories created per year" comment="# hover a bar to see the repos">
          <YearChart years={years} />
        </Section>
        <Section title="Languages" comment="# primary language of each repo">
          <LanguageBars languages={languages} total={log.length} />
        </Section>
      </div>

      <Section title="Highlights">
        <div className={styles.highlights}>
          {highlights.map((h) => (
            <Highlight key={h.label} {...h} />
          ))}
        </div>
      </Section>

      {topics.length > 0 && (
        <Section title="Topics" comment="# bigger = used in more repos">
          <TopicCloud topics={topics} />
        </Section>
      )}

      <Section title="Timeline" comment="# git log --graph --reverse-chronological">
        <GitLog repos={log} />
      </Section>
    </>
  );
};

export async function getStaticProps() {
  const empty = {
    props: { title: "Insights", user: null },
    revalidate: 30,
  };

  try {
    const headers = { Authorization: `token ${process.env.GITHUB_API_KEY}` };
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;

    const [userRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
    ]);

    if (!userRes.ok) throw new Error(`GitHub user API error: ${userRes.status}`);
    if (!repoRes.ok) throw new Error(`GitHub repos API error: ${repoRes.status}`);

    const rawUser = await userRes.json();
    const repos = await repoRes.json();
    if (!Array.isArray(repos) || repos.length === 0) throw new Error("Invalid repos response");

    const now = Date.now();
    const age = (from, to = now) => Math.max(0, Math.round((new Date(to) - new Date(from)) / DAY));

    const user = {
      login: rawUser.login,
      name: rawUser.name,
      avatar_url: rawUser.avatar_url,
      html_url: rawUser.html_url,
      location: rawUser.location,
    };
    const yearsOnGithub = (age(rawUser.created_at) / 365).toFixed(1);

    // Headline numbers
    const sum = (key) => repos.reduce((total, repo) => total + (repo[key] || 0), 0);
    const recentlyActive = repos.filter((repo) => age(repo.pushed_at) <= 90).length;
    const stats = [
      { label: "public repos", value: rawUser.public_repos },
      { label: "stars earned", value: sum("stargazers_count") },
      { label: "forks", value: sum("forks_count") },
      { label: "followers", value: rawUser.followers },
      { label: "live demos", value: repos.filter((repo) => repo.homepage).length },
      { label: "active in last 90 days", value: recentlyActive },
    ];

    // Repos created per year, with no gaps between the first and last year
    const byYear = {};
    repos.forEach((repo) => {
      const year = new Date(repo.created_at).getUTCFullYear();
      (byYear[year] = byYear[year] || []).push(repo.name);
    });
    const yearKeys = Object.keys(byYear).map(Number);
    const years = [];
    for (let y = Math.min(...yearKeys); y <= Math.max(...yearKeys); y++) {
      years.push({ year: y, count: byYear[y]?.length || 0, names: byYear[y] || [] });
    }

    // Primary language counts, small ones folded into "Other"
    const languageCounts = {};
    repos.forEach(({ language }) => {
      const key = language || "Other";
      languageCounts[key] = (languageCounts[key] || 0) + 1;
    });
    const named = Object.entries(languageCounts)
      .filter(([language]) => language !== "Other")
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);
    const otherCount =
      (languageCounts.Other || 0) + named.slice(7).reduce((total, l) => total + l.count, 0);
    const languages = [
      ...named.slice(0, 7),
      ...(otherCount ? [{ language: "Other", count: otherCount }] : []),
    ];

    // Topic frequency
    const topicCounts = {};
    repos.forEach((repo) =>
      (repo.topics || []).forEach((topic) => (topicCounts[topic] = (topicCounts[topic] || 0) + 1))
    );
    const topics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic))
      .slice(0, 40);

    // Highlights
    const pick = (score) => repos.reduce((best, repo) => (score(repo) > score(best) ? repo : best));
    const slim = ({ name, html_url }) => ({ name, html_url });
    const oldest = pick((r) => -new Date(r.created_at));
    const newest = pick((r) => +new Date(r.created_at));
    const latestPush = pick((r) => +new Date(r.pushed_at));
    const starred = pick((r) => r.stargazers_count * 1000 + r.forks_count * 100 + r.watchers_count);
    const biggest = pick((r) => r.size);
    const longest = pick((r) => new Date(r.pushed_at) - new Date(r.created_at));
    const tagged = pick((r) => (r.topics || []).length);

    const highlights = [
      { label: "first repository", repo: slim(oldest), detail: formatDate(oldest.created_at) },
      { label: "newest repository", repo: slim(newest), detail: formatDate(newest.created_at) },
      { label: "last push", repo: slim(latestPush), detail: formatDate(latestPush.pushed_at) },
      {
        label: "most popular",
        repo: slim(starred),
        detail: `${starred.stargazers_count} ★ · ${starred.forks_count} forks`,
      },
      {
        label: "longest maintained",
        repo: slim(longest),
        detail: formatDuration(age(longest.created_at, longest.pushed_at)),
      },
      {
        label: "largest codebase",
        repo: slim(biggest),
        detail: `${(biggest.size / 1024).toFixed(1)} MB`,
      },
      {
        label: "most tagged",
        repo: slim(tagged),
        detail: `${(tagged.topics || []).length} topics`,
      },
    ];

    // Timeline, newest first, with a short commit-like hash per repo
    const log = [...repos]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((repo) => ({
        id: repo.id,
        hash: repo.id.toString(16).slice(-7).padStart(7, "0"),
        name: repo.name,
        description: repo.description,
        language: repo.language,
        html_url: repo.html_url,
        created_at: repo.created_at,
      }));

    return {
      props: {
        title: "Insights",
        user,
        stats,
        years,
        languages,
        topics,
        highlights,
        log,
        yearsOnGithub,
      },
      revalidate: 30,
    };
  } catch {
    return empty;
  }
}

export default InsightsPage;
