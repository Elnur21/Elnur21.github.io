// A static, rule-based chat assistant. No API calls: it answers from the
// site's own data (experience, projects, blog posts, hobbies, contacts),
// in English, Azerbaijani or Russian, following the language of each message.
//
// Messages:  { from: "bot" | "user", text, items?, buttons?, lang? }
//   items:   [{ title, meta?, desc?, action? }]   small cards under the text
//   buttons: [{ label, action }]                  quick replies
// Actions:   { type: "topic", id }   show another topic
//            { type: "intent", id }  answer an intent (used by suggestion buttons)
//            { type: "navigate", path } | { type: "post", slug }
//            { type: "link", href }  | { type: "download", href, filename }

import { STRINGS } from "./strings";

export const LANGS = ["en", "az", "ru"];

/* ------------------------------------------------------------------ */
/* Text processing                                                     */
/* ------------------------------------------------------------------ */

// Lowercase, Azerbaijani letters to plain Latin, ё -> е, accents and й's breve removed
export const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/ə/g, "e").replace(/ı/g, "i").replace(/ş/g, "s").replace(/ç/g, "c")
    .replace(/ğ/g, "g").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ё/g, "е")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");

const words = (text) =>
  normalize(text)
    .split(/[^a-z0-9а-я+#.\-]+/)
    .map((w) => w.replace(/^[.\-]+|[.\-]+$/g, ""))
    .filter(Boolean);

// Stopwords per language (already normalised). Kept separate because,
// for example, Azerbaijani "iş" (work) becomes "is", an English stopword.
const STOPWORDS = {
  en: new Set(
    ("a an the and or but if of to in on at by for with from about into over " +
      "is are was were be been being am do does did done have has had " +
      "i me my he him his she her it its we our they them their " +
      "this that these those there here what which whom whose how " +
      "can could would should will shall may might must " +
      "please tell show give let know want like just some any all " +
      "more most very much also too so than then as up out " +
      "elnur maharramov magerramov meherremov he's").split(" ")
  ),
  az: new Set(
    ("ve ile bu bir ne mi mu da de ucun haqqinda barede ki hansi necedir " +
      "elnur elnurun elnura elnurla maherremov meherremov onun ona o men menim " +
      "var olub edir edib zehmet olmasa goster de deyin danis danisin " +
      "nedir nelerdir kimi daha cox cox cox").split(" ")
  ),
  ru: new Set(
    ("и в во на с со о об обо а но по к ко у из за от до для что как это " +
      "он его ему ли же бы мне я мы они она оно там тут есть был была были быть " +
      "какие каков какая какое какои каких расскажи расскажите покажи покажите " +
      "скажи скажите пожалуиста про можно очень еще уже все весь свои такои " +
      "эльнур эльнура эльнуре эльнуру эльнуром магеррамов магеррамова").split(" ")
  ),
};

// Short or special words the English stemmer must leave alone
const KEEP = new Set([
  "js", "ts", "css", "aws", "sass", "sql", "mssql", "mysql", "nodejs", "nextjs",
  "vuejs", "reactjs", "expressjs", "nestjs", "rabbitmq", "pandas", "jest", "ios",
  "news", "gas", "class", "process", "access", "less", "business", "analysis",
  "series", "statistics", "status", "physics", "chess", "uno", "cnns",
]);

// English word -> concept. Concepts are what topics and intents listen for.
const SYNONYMS = {
  job: "experience", jobs: "experience", work: "experience", worked: "experience",
  working: "experience", career: "experience", company: "experience",
  companies: "experience", position: "experience", role: "experience",
  employer: "experience", intern: "internship", internships: "internship",
  cv: "resume", resum: "resume",
  mail: "email", "e-mail": "email", gmail: "email", reach: "contact",
  hire: "contact", hiring: "contact", message: "contact", contacts: "contact",
  phone: "contact", call: "contact", connect: "contact",
  app: "project", apps: "project", portfolio: "project", built: "project",
  build: "project", made: "project", repo: "project", repos: "project",
  repository: "project", github: "github",
  skill: "skills", stack: "skills", tech: "skills", technology: "skills",
  technologies: "skills", tools: "skills", language: "skills", languages: "skills",
  framework: "skills", frameworks: "skills", knows: "skills",
  post: "blog", posts: "blog", article: "blog", articles: "blog", blogs: "blog",
  writing: "blog", wrote: "blog",
  hobby: "hobbies", free: "hobbies", fun: "hobbies", interest: "hobbies",
  interests: "hobbies", enjoy: "hobbies", likes: "hobbies",
  ml: "machinelearning", ai: "machinelearning", dl: "deeplearning",
  paper: "research", papers: "research", science: "research", lab: "research",
  android: "mobile", ios: "mobile",
  movie: "film", movies: "film", films: "film", cinema: "film", watch: "film",
  freetime: "hobbies", sparetime: "hobbies", weekend: "hobbies",
  machinelearning: "machinelearning", deeplearning: "deeplearning",
  timeseries: "timeseries",
  hi: "hello", hey: "hello", hello: "hello", salam: "hello", hola: "hello",
  bonjour: "hello", thanks: "thanks", thank: "thanks", thx: "thanks",
  bye: "bye", goodbye: "bye",
  live: "location", lives: "location", located: "location", city: "location",
  country: "location", based: "location", where: "location",
  current: "now", currently: "now", today: "now", present: "now",
};

// Azerbaijani and Russian words change their endings a lot (layihə, layihələr,
// layihələri; проект, проекты, проектах), so they are matched by beginning.
// Order matters: the first matching prefix wins.
const PREFIXES = {
  az: [
    ["tecrub", "experience"], ["isle", "experience"], ["vezife", "experience"], ["sirket", "experience"],
    ["karyera", "experience"], ["tecrubeci", "internship"],
    ["layihe", "project"], ["tetbiq", "project"], ["repozitor", "project"], ["qurub", "project"],
    ["bacariq", "skills"], ["bilir", "skills"], ["texnolog", "skills"], ["alet", "skills"],
    ["elaqe", "contact"], ["goturmek", "contact"], ["vakansiya", "contact"], ["emekdas", "contact"],
    ["poct", "email"], ["e-poct", "email"],
    ["rezume", "resume"], ["yukle", "download"],
    ["bloq", "blog"], ["meqale", "blog"], ["yazi", "blog"], ["yazib", "blog"],
    ["hobbi", "hobbies"], ["maraq", "hobbies"], ["sevdiy", "hobbies"], ["asude", "hobbies"],
    ["tedqiqat", "research"], ["arasdirma", "research"], ["elmi", "research"], ["laborator", "research"],
    ["fransa", "france"], ["zaman", "timeseries"], ["sira", "series"],
    ["mobil", "mobile"],
    ["verilenler", "database"], ["baza", "database"],
    ["suni", "machinelearning"], ["masin", "machinelearning"], ["oyrenme", "machinelearning"],
    ["neyron", "machinelearning"], ["melumat", "data"],
    ["salam", "hello"], ["tesekkur", "thanks"], ["sagol", "thanks"], ["helelik", "bye"], ["gorusen", "bye"],
    ["harada", "location"], ["yasayir", "location"], ["seher", "location"], ["olke", "location"],
    ["baki", "baku"], ["azerbaycan", "azerbaijan"],
    ["hazirda", "now"], ["hazirki", "now"], ["indi", "now"], ["cari", "now"],
    ["nece", "many"], ["qeder", "many"], ["uzun", "long"], ["umumi", "total"],
    ["ilk", "first"], ["basla", "start"],
    ["kimdir", "who"], ["assistent", "assistant"], ["insan", "human"],
    ["tehsil", "education"], ["oxuy", "study"], ["universitet", "university"], ["kurs", "course"],
    ["akademiya", "academy"], ["mekteb", "school"],
    ["kino", "film"], ["sahmat", "chess"], ["gezinti", "walk"], ["gezm", "walk"], ["oyun", "game"],
    ["seviyye", "level"], ["sayt", "site"], ["sehife", "page"], ["menyu", "menu"], ["komek", "help"],
  ],
  ru: [
    ["стажир", "internship"], ["стаж", "total"],
    ["опыт", "experience"], ["работ", "experience"], ["должност", "experience"], ["карьер", "experience"],
    ["компан", "experience"],
    ["проект", "project"], ["приложен", "project"], ["портфол", "project"], ["репозитор", "project"],
    ["сделал", "project"],
    ["навык", "skills"], ["умее", "skills"], ["умен", "skills"], ["знает", "skills"], ["технолог", "skills"],
    ["стек", "skills"], ["инструмент", "skills"], ["фреимворк", "skills"],
    ["контакт", "contact"], ["связ", "contact"], ["нанят", "contact"], ["наим", "contact"],
    ["ваканс", "contact"], ["сотруднич", "contact"], ["написать", "contact"],
    ["почт", "email"], ["имеил", "email"], ["емеил", "email"],
    ["резюме", "resume"], ["скача", "download"],
    ["блог", "blog"], ["стать", "blog"], ["публикац", "blog"], ["пост", "blog"], ["писал", "blog"],
    ["последн", "latest"],
    ["хобби", "hobbies"], ["увлечен", "hobbies"], ["досуг", "hobbies"], ["интерес", "hobbies"],
    ["исследов", "research"], ["наук", "research"], ["научн", "research"], ["лаборат", "research"],
    ["франц", "france"], ["временн", "timeseries"], ["ряд", "series"],
    ["мобил", "mobile"], ["андроид", "mobile"], ["телефон", "mobile"],
    ["фронтенд", "frontend"], ["фронт", "frontend"], ["бэкенд", "backend"], ["бекенд", "backend"],
    ["бэк", "backend"], ["сервер", "backend"], ["апи", "api"],
    ["баз", "database"], ["бд", "database"],
    ["девопс", "devops"], ["деплои", "devops"], ["облак", "devops"],
    ["обучени", "machinelearning"], ["нейросет", "machinelearning"], ["ии", "machinelearning"],
    ["искусствен", "machinelearning"], ["данн", "data"], ["модел", "model"],
    ["привет", "hello"], ["здравств", "hello"], ["салам", "hello"],
    ["спасиб", "thanks"], ["благодар", "thanks"], ["пока", "bye"], ["свидан", "bye"],
    ["где", "location"], ["живет", "location"], ["город", "location"], ["стран", "location"],
    ["откуда", "location"], ["баку", "baku"], ["азербаидж", "azerbaijan"],
    ["сеичас", "now"], ["текущ", "now"], ["нынешн", "now"], ["сегодн", "now"],
    ["лет", "year"], ["год", "year"], ["сколько", "many"], ["долго", "long"],
    ["перв", "first"], ["начина", "start"], ["начал", "start"],
    ["кто", "who"], ["ты", "you"], ["вы", "you"], ["бот", "bot"], ["ассистент", "assistant"], ["человек", "human"],
    ["образован", "education"], ["учил", "study"], ["учеб", "study"], ["универ", "university"],
    ["курс", "course"], ["академ", "academy"], ["школ", "school"],
    ["фильм", "film"], ["кино", "film"], ["шахмат", "chess"], ["прогул", "walk"], ["ходьб", "walk"], ["игр", "game"],
    ["сеньор", "senior"], ["синьор", "senior"], ["джун", "junior"], ["мидл", "level"], ["уровен", "level"],
    ["сайт", "site"], ["страниц", "page"], ["меню", "menu"], ["помо", "help"],
  ],
};

// Exact Azerbaijani words that are too short for prefix matching
const AZ_EXACT = {
  is: "experience", isi: "experience", il: "year", kim: "who", kimsen: "who", kimsiz: "who", kimdir: "who",
  sen: "you", siz: "you", bot: "bot", cv: "resume", son: "latest",
};

const stem = (word) => {
  if (KEEP.has(word) || word.length <= 3) return word;
  if (word.endsWith("ies") && word.length > 4) return word.slice(0, -3) + "y";
  if (word.endsWith("ing") && word.length > 5) return word.slice(0, -3);
  if (word.endsWith("ed") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("es") && /(sh|ch|x|ss)es$/.test(word)) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
};

const concept = (word, lang) => {
  if (lang === "az" && AZ_EXACT[word]) return AZ_EXACT[word];
  if (SYNONYMS[word]) return SYNONYMS[word];
  const rules = PREFIXES[lang] || (/[а-я]/.test(word) ? PREFIXES.ru : null);
  const rule = rules?.find(([prefix]) => word.startsWith(prefix));
  if (rule) return rule[1];
  if (/[а-я]/.test(word)) return word;
  return SYNONYMS[stem(word)] || stem(word);
};

// "What React projects has he built?" -> ["react", "project", "built"]
export const tokenize = (text, lang = "en") => words(text).filter((w) => !STOPWORDS[lang].has(w));

/* ---------- Which language is the message in? ---------- */

const AZ_WORDS = new Set(
  ("salam sagol sagolun tesekkur elnurun haqqinda layihe layiheler layihesi layiheleri tecrube " +
    "tecrubesi bacariq bacariqlari elaqe harada nece necedir nedir hansi hazirda indi isleyir " +
    "isleyib edib olub ucun barede rezume bloq hobbi hobbileri tedqiqat meqale yazilar " +
    "kimdir kimsen kimsiz nesen sen siz mene bize var yoxdur").split(" ")
);
const EN_WORDS = new Set(
  ("what who where when which how does do did is are the his he him about tell me show " +
    "hi hello hey thanks thank you your can could please projects project experience job " +
    "skills posts contact resume hobbies research current years work").split(" ")
);

export const detectLanguage = (text, fallback = "en") => {
  if (/[а-яё]/i.test(text)) return "ru";
  if (/[əğı]/i.test(text)) return "az";
  const ws = words(text);
  if (/[şç]/i.test(text) || ws.some((w) => AZ_WORDS.has(w))) return "az";
  if (ws.some((w) => EN_WORDS.has(w))) return "en";
  // A bare name like "React" keeps the language of the conversation
  return fallback;
};

/* ---------- Fuzzy matching ---------- */

// Small edit distance, for typos like "experiance" or "reserch"
const distance = (a, b) => {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
};

const commonPrefix = (a, b) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
};

// How well one typed word matches a keyword: exact 1, typo 0.75,
// same stem with a different ending 0.7 (шахматы / шахматами), prefix 0.6
const wordScore = (word, key) => {
  if (word === key) return 1;
  if (word.length >= 5 && key.length >= 5 && distance(word, key) <= 1) return 0.75;
  const shared = commonPrefix(word, key);
  if (shared >= 4 && shared >= Math.min(word.length, key.length) - 2) return 0.7;
  if (word.length >= 6 && key.length >= 6 && distance(word, key) <= 2) return 0.6;
  if (word.length >= 4 && key.startsWith(word)) return 0.6;
  return 0;
};

const techKey = (tag) => {
  const key = normalize(tag).replace(/[^a-z0-9+#]/g, "");
  const canon = {
    reactjs: "react", vuejs: "vue", node: "nodejs", expressjs: "express",
    sklearn: "scikitlearn", nextjs: "nextjs", mantinedev: "mantine",
  };
  return canon[key] || key;
};

// Blog tags that are topics, not technologies. Questions about them go to
// the matching topic instead of the technology answer.
const GENERIC_TAGS = new Set([
  "research", "mobile", "ai", "games", "machinelearning", "deeplearning",
  "timeseries", "dataanalysis", "computergraphics", "webscraping",
]);

// Tech names people type -> canonical tech key (see techKey)
const TECH_ALIASES = {
  node: "nodejs", js: "javascript", ts: "typescript", py: "python",
  tf: "tensorflow", rn: "reactnative", mongo: "mongodb", postgres: "postgresql",
  nuxt: "nuxtjs", scss: "sass", nest: "nestjs",
  sklearn: "scikitlearn", "scikit-learn": "scikitlearn", rabbit: "rabbitmq",
  gpt: "llm", llms: "llm", openai: "llm",
  "реакт": "react", "ноде": "nodejs", "нода": "nodejs", "питон": "python", "паитон": "python",
  "флаттер": "flutter", "докер": "docker", "монго": "mongodb", "тайпскрипт": "typescript",
  "джаваскрипт": "javascript", "фаербейс": "firebase",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const MONTHS = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  az: ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avq", "sen", "okt", "noy", "dek"],
  ru: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
};
const formatDate = (date, lang) => {
  const [y, m, d] = date.split("-");
  const label = `${MONTHS[lang][Number(m) - 1]} ${y}`;
  return d ? `${Number(d)} ${label}` : label;
};

// "08.2024 – present" -> { start: Date, end: Date }
const parsePeriod = (period, now) => {
  const [from, to] = period.split(/\s*[–-]\s*/);
  const toDate = (s) => {
    const [m, y] = s.split(".");
    return new Date(Number(y), Number(m) - 1, 1);
  };
  return { start: toDate(from), end: /present/i.test(to) ? now : toDate(to) };
};

const topic = (label, id) => ({ label, action: { type: "topic", id } });
const go = (label, path) => ({ label, action: { type: "navigate", path } });
const link = (label, href) => ({ label, action: { type: "link", href } });

/* ------------------------------------------------------------------ */
/* The bot                                                             */
/* ------------------------------------------------------------------ */

// data: { en: { experience, blogs, jsProjects, mlProjects, botProjects, hobbies }, az: {...}, ru: {...},
//         contacts, pages }. The three languages have the same items in the same order.
export function createBot(data, { now = new Date() } = {}) {
  const { contacts } = data;
  const contact = (name) => contacts.find((c) => c.social === name);

  // Per-language views of the data
  const view = Object.fromEntries(
    LANGS.map((lang) => {
      const d = data[lang] || data.en;
      const posts = [...d.blogs].sort((a, b) => b.date.localeCompare(a.date));
      return [
        lang,
        {
          experience: d.experience,
          jobById: (id) => d.experience.find((j) => String(j.id) === String(id)),
          posts,
          postBySlug: Object.fromEntries(posts.map((p) => [p.slug, p])),
          projects: [
            ...d.jsProjects.map((p) => ({ ...p, kind: "Web" })),
            ...d.mlProjects.map((p) => ({ ...p, kind: "Machine learning" })),
            ...d.botProjects.map((p) => ({ ...p, kind: "Bot" })),
          ],
          jsProjects: d.jsProjects,
          mlProjects: d.mlProjects,
          botProjects: d.botProjects,
          hobbies: d.hobbies,
        },
      ];
    })
  );
  const en = view.en;
  const jobs = [...en.experience].reverse(); // newest first
  const currentJob = jobs.find((j) => j.current) || jobs[0];
  const firstJob = en.experience[0];

  const postsWith = (...tags) => {
    const keys = tags.map(techKey);
    return en.posts.filter((p) => p.tags.some((t) => keys.includes(techKey(t))));
  };

  // Total time worked, counting overlapping jobs only once
  const monthsOfExperience = () => {
    const months = new Set();
    en.experience.forEach((job) => {
      const { start, end } = parsePeriod(job.period, now);
      for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1))
        months.add(`${d.getFullYear()}-${d.getMonth()}`);
    });
    return months.size;
  };
  const totalMonths = monthsOfExperience();
  const yearsLabel = (lang) => STRINGS[lang].duration(Math.floor(totalMonths / 12), totalMonths % 12);

  /* ---------- Tech index: every tag used in jobs, projects and posts ---------- */

  const tech = {};
  const addTech = (tag, kind, ref) => {
    const key = techKey(tag);
    if (!key) return;
    tech[key] = tech[key] || { name: tag, jobs: [], projects: [], posts: [] };
    if (!tech[key][kind].includes(ref)) tech[key][kind].push(ref);
  };
  en.experience.forEach((j) => j.tags.forEach((t) => addTech(t, "jobs", j.id)));
  en.projects.forEach((p, i) => p.tags.forEach((t) => addTech(t, "projects", i)));
  en.posts.forEach((p) => p.tags.forEach((t) => addTech(t, "posts", p.slug)));
  // Skills from the home page that never appear as a tag
  ["Vue", "NestJS", "GraphQL", "PyTorch", "HTML", "CSS"].forEach((t) => {
    const key = techKey(t);
    tech[key] = tech[key] || { name: t, jobs: [], projects: [], posts: [] };
  });

  /* ---------- Rendering helpers (all take the reply language) ---------- */

  const MAIN = (lang) => topic(STRINGS[lang].mainMenu, "menu");
  const B = (lang) => STRINGS[lang].buttons;

  const postItem = (slug, lang) => {
    const post = view[lang].postBySlug[slug] || en.postBySlug[slug];
    return {
      title: post.title,
      meta: `${formatDate(post.date, lang)} · ${STRINGS[lang].minRead(post.readTime)}`,
      desc: post.summary,
      action: { type: "post", slug },
    };
  };
  const posts = (list, lang) => list.map((p) => postItem(p.slug, lang));
  const projectItem = (index, lang) => {
    const p = view[lang].projects[index];
    return { title: p.name, meta: p.tags.join(", "), desc: p.description, action: { type: "link", href: p.source_code } };
  };
  const period = (job, lang) => job.period.replace("present", STRINGS[lang].present);

  /* ---------- Topics: the guided, button-driven flow ---------- */

  const SKILL_TAGS = {
    frontend: ["React", "Next.js", "Vite", "Sass", "HTML", "Micro-Frontends"],
    backend: ["Node.js", "Express", "RabbitMQ", "Prisma"],
    data: ["MongoDB", "MSSQL", "SQLite", "Firebase", "Prisma", "Mongoose"],
    devops: ["Docker", "AWS"],
    ml: ["Deep Learning", "Machine Learning", "Time Series", "scikit-learn", "LLM"],
    mobile: ["Mobile", "Flutter", "React Native"],
    automation: ["RPA", "Automation Anywhere"],
  };

  const topics = {
    menu: (lang) => ({
      text: STRINGS[lang].menu,
      buttons: [
        topic(B(lang).about, "about"),
        topic(B(lang).experience, "experience"),
        topic(B(lang).skills, "skills"),
        topic(B(lang).projects, "projects"),
        topic(B(lang).research, "research"),
        topic(B(lang).blog, "blog"),
        topic(B(lang).hobbies, "hobbies"),
        topic(B(lang).resume, "resume"),
        topic(B(lang).contact, "contact"),
        topic(B(lang).pages, "pages"),
      ],
    }),

    about: (lang) => {
      const job = view[lang].jobById(currentJob.id);
      return {
        text: STRINGS[lang].about({ years: yearsLabel(lang), role: job.role, company: job.company }),
        buttons: [topic(B(lang).currentJob, "job:current"), topic(B(lang).skills, "skills"), topic(B(lang).projects, "projects"), topic(B(lang).contact, "contact"), MAIN(lang)],
      };
    },

    experience: (lang) => ({
      text: STRINGS[lang].experience({ count: en.experience.length, since: firstJob.period.split(" ")[0], years: yearsLabel(lang) }),
      buttons: [
        ...jobs.map((j) => topic(`${j.company}${j.current ? B(lang).now : ""}`, `job:${j.id}`)),
        go(B(lang).openExperience, "/experience"),
        MAIN(lang),
      ],
    }),

    skills: (lang) => ({
      text: STRINGS[lang].skills,
      buttons: [...Object.keys(SKILL_TAGS).map((id) => topic(STRINGS[lang].skillAreas[id].label, `skill:${id}`)), MAIN(lang)],
    }),

    projects: (lang) => ({
      text: STRINGS[lang].projects,
      buttons: [
        topic(B(lang).webApps, "projects:web"),
        topic(B(lang).mobileApps, "projects:mobile"),
        topic(B(lang).ml, "projects:ml"),
        topic(B(lang).bots, "projects:bots"),
        go(B(lang).allRepos, "/repositories"),
        MAIN(lang),
      ],
    }),

    "projects:web": (lang) => ({
      text: STRINGS[lang].projectsWeb,
      items: [
        ...en.jsProjects.map((_, i) => projectItem(i, lang)),
        ...posts(postsWith("Micro-Frontends", "Express").slice(0, 3), lang),
      ],
      buttons: [go(B(lang).openProjectsJs, "/projects-js"), topic(B(lang).otherProjects, "projects"), MAIN(lang)],
    }),

    "projects:mobile": (lang) => ({
      text: STRINGS[lang].projectsMobile,
      items: posts(postsWith("Mobile"), lang),
      buttons: [topic(B(lang).skillArea(STRINGS[lang].skillAreas.mobile.label), "skill:mobile"), topic(B(lang).otherProjects, "projects"), MAIN(lang)],
    }),

    "projects:ml": (lang) => ({
      text: STRINGS[lang].projectsMl,
      items: en.mlProjects.map((_, i) => projectItem(en.jsProjects.length + i, lang)),
      buttons: [go(B(lang).openProjectsPy, "/projects-py"), topic(B(lang).research, "research"), topic(B(lang).otherProjects, "projects"), MAIN(lang)],
    }),

    "projects:bots": (lang) => ({
      text: STRINGS[lang].projectsBots,
      items: [
        ...en.botProjects.map((_, i) => projectItem(en.jsProjects.length + en.mlProjects.length + i, lang)),
        ...posts(postsWith("RPA"), lang),
      ],
      buttons: [topic(B(lang).otherProjects, "projects"), MAIN(lang)],
    }),

    research: (lang) => {
      const research = postsWith("Research");
      const irimas = en.experience.find((j) => /irimas/i.test(j.company));
      return {
        text: STRINGS[lang].research(research.length),
        items: posts(research.slice(0, 5), lang),
        buttons: [
          ...(research.length > 5 ? [topic(B(lang).allResearch, "research:all")] : []),
          ...(irimas ? [topic(B(lang).irimas, `job:${irimas.id}`)] : []),
          topic(B(lang).skillArea(STRINGS[lang].skillAreas.ml.label), "skill:ml"),
          MAIN(lang),
        ],
      };
    },

    "research:all": (lang) => ({
      text: STRINGS[lang].researchAll,
      items: posts(postsWith("Research"), lang),
      buttons: [topic(B(lang).research, "research"), MAIN(lang)],
    }),

    blog: (lang) => ({
      text: STRINGS[lang].blog({
        count: en.posts.length,
        from: formatDate(en.posts[en.posts.length - 1].date, lang),
        to: formatDate(en.posts[0].date, lang),
      }),
      items: posts(en.posts.slice(0, 3), lang),
      buttons: [topic(B(lang).browseTopics, "blog:topics"), go(B(lang).openBlog, "/blogs"), go(B(lang).blogInsights, "/blog-insights"), MAIN(lang)],
    }),

    "blog:topics": (lang) => {
      const counts = {};
      en.posts.forEach((p) => p.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
      const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 10);
      return {
        text: STRINGS[lang].blogTopics,
        buttons: [...top.map((t) => topic(`${data.tagLabel?.(t, lang) ?? t} (${counts[t]})`, `tag:${t}`)), MAIN(lang)],
      };
    },

    hobbies: (lang) => ({
      text: STRINGS[lang].hobbies,
      items: view[lang].hobbies.map((h) => ({ title: h.title, meta: h.tags.join(", "), desc: h.description })),
      buttons: [go(B(lang).openHobbies, "/hobbies"), MAIN(lang)],
    }),

    resume: (lang) => ({
      text: STRINGS[lang].resume,
      buttons: [
        go(B(lang).openResume, "/resume"),
        { label: B(lang).downloadPdf, action: { type: "download", href: "/Resume.pdf", filename: "ElnurMaharramov_CV.pdf" } },
        topic(B(lang).contact, "contact"),
        MAIN(lang),
      ],
    }),

    contact: (lang) => ({
      text: STRINGS[lang].contact(contact("Email").link),
      buttons: [
        link(B(lang).sendEmail, contact("Email").href),
        go(B(lang).contactForm, "/contact"),
        link("LinkedIn", contact("LinkedIn").href),
        link("GitHub", contact("GitHub").href),
        MAIN(lang),
      ],
    }),

    pages: (lang) => ({
      text: STRINGS[lang].pages,
      buttons: data.pages.map((p) => go(p.name, p.path)).concat(MAIN(lang)),
    }),

    bot: (lang) => ({ text: STRINGS[lang].bot, buttons: [MAIN(lang)] }),
  };

  // Topics with a parameter: job:<id>, skill:<area>, tag:<name>, tech:<key>
  const dynamicTopic = (id, lang) => {
    const [kind, ...rest] = id.split(":");
    const arg = rest.join(":");

    if (kind === "job") {
      const base = arg === "current" ? currentJob : en.jobById(arg);
      if (!base) return null;
      const job = view[lang].jobById(base.id);
      return {
        text: STRINGS[lang].job({ ...job, period: period(job, lang) }),
        items: posts(postsAbout(base).slice(0, 3), lang),
        buttons: [
          ...base.tags.slice(0, 3).map((t) => topic(t, `tech:${techKey(t)}`)),
          topic(B(lang).allExperience, "experience"),
          MAIN(lang),
        ],
      };
    }

    if (kind === "skill") {
      const area = STRINGS[lang].skillAreas[arg];
      if (!area) return null;
      const related = postsWith(...SKILL_TAGS[arg]).slice(0, 3);
      return {
        text: STRINGS[lang].skillArea(area.label, area.skills, related.length > 0),
        items: posts(related, lang),
        buttons: [topic(B(lang).otherSkills, "skills"), topic(B(lang).projects, "projects"), MAIN(lang)],
      };
    }

    if (kind === "tag") {
      return {
        text: STRINGS[lang].tag(data.tagLabel?.(arg, lang) ?? arg),
        items: posts(postsWith(arg), lang),
        buttons: [topic(B(lang).otherTopics, "blog:topics"), MAIN(lang)],
      };
    }

    if (kind === "tech") return techAnswer(arg, lang);
    return null;
  };

  // Everything Elnur did with one technology
  const techAnswer = (key, lang) => {
    const t = tech[key];
    if (!t) return null;
    return {
      text: STRINGS[lang].tech({
        name: t.name,
        companies: t.jobs.map((id) => en.jobById(id).company),
        projects: t.projects.length,
        posts: t.posts.length,
      }),
      items: [
        ...t.projects.map((i) => ({ ...projectItem(i, lang), meta: STRINGS[lang].kinds[en.projects[i].kind] })),
        ...t.posts.slice(0, 4).map((slug) => postItem(slug, lang)),
      ],
      buttons: [
        ...t.jobs.slice(0, 3).map((id) => topic(en.jobById(id).company, `job:${id}`)),
        // The skill areas this technology belongs to, e.g. Flutter -> Mobile
        ...Object.entries(SKILL_TAGS)
          .filter(([, tags]) => tags.some((tag) => techKey(tag) === key))
          .map(([id]) => topic(B(lang).skillArea(STRINGS[lang].skillAreas[id].label), `skill:${id}`)),
        topic(B(lang).allSkills, "skills"),
        MAIN(lang),
      ],
    };
  };

  const show = (id, lang = "en") => topics[id]?.(lang) || dynamicTopic(id, lang) || topics.menu(lang);

  /* ---------- Free text: intents scored by keywords ---------- */

  // keys: concepts that point to this intent. Some intents answer directly,
  // others open a topic.
  const intents = [
    { id: "hello", keys: ["hello"], small: true, answer: (lang) => ({ ...topics.menu(lang), text: STRINGS[lang].hello }) },
    { id: "thanks", keys: ["thanks"], small: true, answer: (lang) => ({ text: STRINGS[lang].thanks, buttons: [MAIN(lang), topic(B(lang).contactElnur, "contact")] }) },
    { id: "bye", keys: ["bye"], small: true, answer: (lang) => ({ text: STRINGS[lang].bye, buttons: [topic(B(lang).contactElnur, "contact")] }) },
    { id: "bot", keys: ["you", "who", "bot", "assistant", "chatbot", "gpt", "real", "human"], need: 2, answer: (lang) => topics.bot(lang) },
    { id: "current", keys: ["now", "experience", "company"], need: 2, answer: (lang) => dynamicTopic("job:current", lang) },
    { id: "years", keys: ["year", "long", "experience", "many", "senior", "total"], need: 2,
      answer: (lang) => {
        const first = view[lang].jobById(firstJob.id);
        const current = view[lang].jobById(currentJob.id);
        return {
          text: STRINGS[lang].years({
            years: yearsLabel(lang), firstRole: first.role, firstCompany: first.company,
            since: firstJob.period.split(" ")[0], role: current.role, company: current.company,
          }),
          buttons: [topic(B(lang).allExperience, "experience"), topic(B(lang).currentJob, "job:current"), MAIN(lang)],
        };
      } },
    { id: "first", keys: ["first", "experience", "start", "began", "begin"], need: 2, answer: (lang) => dynamicTopic(`job:${firstJob.id}`, lang) },
    { id: "location", keys: ["location", "from", "azerbaijan", "baku"],
      answer: (lang) => ({ text: STRINGS[lang].location, buttons: [topic(B(lang).contact, "contact"), MAIN(lang)] }) },
    { id: "email", keys: ["email"],
      answer: (lang) => ({ text: STRINGS[lang].email(contact("Email").link), buttons: [link(B(lang).sendEmail, contact("Email").href), go(B(lang).contactForm, "/contact"), MAIN(lang)] }) },
    { id: "linkedin", keys: ["linkedin", "линкедин"],
      answer: (lang) => ({ text: STRINGS[lang].linkedin, buttons: [link(B(lang).openLinkedin, contact("LinkedIn").href), topic(B(lang).contact, "contact"), MAIN(lang)] }) },
    { id: "github", keys: ["github", "source", "гитхаб"],
      answer: (lang) => ({ text: STRINGS[lang].github, buttons: [link(B(lang).openGithub, contact("GitHub").href), go(B(lang).repositories, "/repositories"), go(B(lang).githubInsights, "/insights"), MAIN(lang)] }) },
    { id: "level", keys: ["senior", "junior", "seniority", "level", "experienced"],
      answer: (lang) => intents.find((i) => i.id === "years").answer(lang) },
    { id: "contact", keys: ["contact", "available", "freelance", "collaborate", "offer"], answer: (lang) => topics.contact(lang) },
    { id: "resume", keys: ["resume", "download", "pdf"], answer: (lang) => topics.resume(lang) },
    { id: "education", keys: ["education", "study", "studied", "university", "degree", "course", "academy", "school"],
      answer: (lang) => ({
        text: STRINGS[lang].education,
        items: posts(en.posts.filter((p) => /code academy|irimas/i.test(p.title)), lang),
        buttons: [go(B(lang).openResume, "/resume"), MAIN(lang)],
      }) },
    // Specific areas come before the broad topics, so they win a tie
    { id: "mlprojects", keys: ["machinelearning", "deeplearning", "project"], need: 2, answer: (lang) => topics["projects:ml"](lang) },
    { id: "frontend", keys: ["frontend", "front", "ui", "design", "responsive"], answer: (lang) => dynamicTopic("skill:frontend", lang) },
    { id: "backend", keys: ["backend", "back", "server", "api"], answer: (lang) => dynamicTopic("skill:backend", lang) },
    { id: "database", keys: ["database", "db", "orm", "sql", "nosql", "postgresql", "mysql"], answer: (lang) => dynamicTopic("skill:data", lang) },
    { id: "devops", keys: ["devops", "deploy", "cloud", "deployment"], answer: (lang) => dynamicTopic("skill:devops", lang) },
    { id: "mobile", keys: ["mobile"], answer: (lang) => topics["projects:mobile"](lang) },
    { id: "ml", keys: ["machinelearning", "deeplearning", "data", "neural", "model"], answer: (lang) => dynamicTopic("skill:ml", lang) },
    { id: "research", keys: ["research", "timeseries", "series", "irimas", "france"], answer: (lang) => topics.research(lang) },
    // Single hobbies ("chess", "movies") are answered by the search step, together with related posts
    { id: "hobbies", keys: ["hobbies"], answer: (lang) => topics.hobbies(lang) },
    { id: "experience", keys: ["experience", "internship"], answer: (lang) => topics.experience(lang) },
    { id: "skills", keys: ["skills"], answer: (lang) => topics.skills(lang) },
    { id: "projects", keys: ["project"], answer: (lang) => topics.projects(lang) },
    { id: "blog", keys: ["blog", "read", "latest"], answer: (lang) => topics.blog(lang) },
    { id: "about", keys: ["about", "who", "yourself", "introduce", "summary", "bio"], answer: (lang) => topics.about(lang) },
    { id: "pages", keys: ["page", "site", "website", "navigate", "menu", "help", "start"], answer: (lang) => topics.menu(lang) },
  ];
  const intentById = Object.fromEntries(intents.map((i) => [i.id, i]));

  // A button that answers another intent the message also touched
  const intentButton = (intent, lang) => ({
    label: STRINGS[lang].intents[intent.id] || intent.id,
    action: { type: "intent", id: intent.id },
  });

  // Blog search index: concepts from every post's title, tags and summary, in all three languages
  const postIndex = en.posts.map((p) => {
    const strong = new Set();
    const weak = new Set();
    LANGS.forEach((lang) => {
      const post = view[lang].postBySlug[p.slug] || p;
      [...tokenize(post.title, lang), ...post.tags.flatMap((t) => tokenize(t, "en"))].forEach((w) => strong.add(concept(w, lang)));
      tokenize(post.summary, lang).forEach((w) => weak.add(concept(w, lang)));
    });
    return { slug: p.slug, strong, weak };
  });

  // Match companies only on their distinctive words ("academy" alone is not enough)
  const COMMON = new Set(["llc", "laboratoire", "laboratory", "lab", "academy", "solution", "solutions", "inc"]);
  const companyWords = (job) => tokenize(job.company).filter((w) => !COMMON.has(w));
  const companyOf = (ws) =>
    en.experience.find((j) => ws.some((w) => companyWords(j).some((n) => wordScore(w, n) >= 0.75)));

  // Posts that mention a company by name
  const postsAbout = (job) => {
    const names = companyWords(job);
    return en.posts.filter((p) => {
      const text = normalize([p.title, p.summary, ...p.body.filter((b) => typeof b === "string")].join(" "));
      return names.some((n) => text.includes(n));
    });
  };

  const techIn = (ws) => {
    const found = [];
    const tryKey = (k) => k && tech[k] && !GENERIC_TAGS.has(k) && !found.includes(k) && found.push(k);
    ws.forEach((w, i) => {
      if (w in TECH_ALIASES) tryKey(TECH_ALIASES[w]);
      else tryKey(techKey(w));
      if (i < ws.length - 1) tryKey(techKey(w + ws[i + 1])); // "react native", "node js"
    });
    return found;
  };

  const replyIn = (text, lang) => {
    const ws = tokenize(text, lang);
    if (!ws.length) {
      // "Who is Elnur?" / "Elnur haqqında" / "Расскажи об Эльнуре" leave nothing but the name
      return /elnur|эльнур/i.test(normalize(text)) ? topics.about(lang) : topics.menu(lang);
    }
    // Single words plus joined pairs, so "machine learning" also matches "machinelearning"
    const concepts = [
      ...ws.map((w) => concept(w, lang)),
      ...ws.slice(1).map((w, i) => SYNONYMS[ws[i] + w] || ws[i] + w),
    ];

    // Score every intent
    const scored = intents
      .map((intent) => {
        let score = 0;
        let hits = 0;
        intent.keys.forEach((key) => {
          const best = Math.max(0, ...concepts.map((c) => wordScore(c, key)));
          if (best) hits++;
          score += best;
        });
        return { intent, score, hits };
      })
      .filter(({ intent, hits }) => hits >= (intent.need || 1))
      .sort((a, b) => b.score - a.score);

    const company = companyOf(ws);
    const techs = techIn(ws);
    const top = scored[0];

    // 1. Greetings and thanks, when that's all the message says
    if (top?.intent.small && ws.length <= 3) return top.intent.answer(lang);

    // 2. A company name: answer about that job
    if (company) return dynamicTopic(`job:${company.id}`, lang);

    // 3. Specific questions (current job, years, email...) beat tech names
    const specific = ["current", "years", "first", "location", "email", "linkedin", "bot", "education", "resume", "level"];
    if (top && specific.includes(top.intent.id) && top.score >= 1) return top.intent.answer(lang);

    // 4. A technology: everything Elnur did with it
    if (techs.length) {
      const answer = techAnswer(techs[0], lang);
      if (techs.length > 1)
        answer.buttons = [...techs.slice(1, 4).map((k) => topic(tech[k].name, `tech:${k}`)), ...answer.buttons];
      return answer;
    }

    // 5. A clear topic
    if (top && top.score >= 0.75) {
      const answer = top.intent.answer(lang);
      // Other topics the message also touched, as extra buttons
      const BROAD = ["skills", "projects", "experience", "blog", "pages", "about"];
      const labels = new Set((answer.buttons || []).map((b) => b.label));
      const others = scored
        .slice(1, 3)
        .filter((s) => s.score >= 0.75 && !s.intent.small && !BROAD.includes(s.intent.id))
        .map((s) => intentButton(s.intent, lang))
        .filter((b) => !labels.has(b.label));
      answer.buttons = [...others, ...(answer.buttons || [])];
      return answer;
    }

    // 6. Search blog posts and hobbies by their words
    const found = postIndex
      .map(({ slug, strong, weak }) => ({
        slug,
        score: concepts.reduce((s, c) => s + (strong.has(c) ? 2 : weak.has(c) ? 1 : 0), 0),
      }))
      .filter((r) => r.score >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    const hobbyHits = en.hobbies
      .map((h, i) => i)
      .filter((i) =>
        LANGS.some((l) =>
          tokenize(view[l].hobbies[i].title, l).some((t) => concepts.some((c) => wordScore(c, concept(t, l)) >= 0.7))
        )
      );
    if (found.length || hobbyHits.length) {
      const H = view[lang].hobbies;
      return {
        text: hobbyHits.length
          ? STRINGS[lang].hobbyFound(hobbyHits.map((i) => H[i].title), found.length > 0)
          : STRINGS[lang].found,
        items: [
          ...hobbyHits.map((i) => ({ title: H[i].title, meta: STRINGS[lang].hobby, desc: H[i].description })),
          ...found.map((r) => postItem(r.slug, lang)),
        ],
        buttons: [
          hobbyHits.length ? topic(B(lang).allHobbies, "hobbies") : topic(B(lang).browseBlog, "blog"),
          MAIN(lang),
        ],
      };
    }

    // 7. Not sure: suggest topics with partly matching words, or the menu
    const maybe = scored.filter((s) => s.score >= 0.5 && !s.intent.small).slice(0, 4);
    return {
      text: maybe.length ? STRINGS[lang].unsure : STRINGS[lang].unknown,
      buttons: maybe.length ? [...maybe.map((s) => intentButton(s.intent, lang)), MAIN(lang)] : topics.menu(lang).buttons,
    };
  };

  return {
    start: (lang = "en") => ({ text: STRINGS[lang].start, buttons: topics.menu(lang).buttons, lang }),
    show: (id, lang = "en") => ({ ...show(id, lang), lang }),
    intent: (id, lang = "en") => ({ ...(intentById[id]?.answer(lang) || topics.menu(lang)), lang }),
    // Answers in the language of the message; `fallback` is used when the
    // message has no clear language (e.g. just "React")
    reply: (text, fallback = "en") => {
      const lang = detectLanguage(text, fallback);
      return { ...replyIn(text, lang), lang };
    },
  };
}
