// Everything the chat assistant says, in English, Azerbaijani and Russian.
// Plain strings are labels; functions build sentences from data.

const plural = (lang, n, forms) => {
  const form = new Intl.PluralRules(lang).select(n);
  return `${n} ${forms[form] ?? forms.other}`;
};

const list = (items, and) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;

const en = {
  present: "present",
  mainMenu: "Main menu",
  minRead: (n) => `${n} min read`,
  duration: (years, months) =>
    months ? `${plural("en", years, { one: "year", other: "years" })} and ${plural("en", months, { one: "month", other: "months" })}` : plural("en", years, { one: "year", other: "years" }),

  start: "Hi! I'm Elnur's assistant. Ask me anything about his work, or pick a topic below.",
  menu: "What would you like to know about Elnur? Pick a topic, or just type a question.",
  buttons: {
    about: "About Elnur", experience: "Experience", skills: "Skills", projects: "Projects", research: "Research",
    blog: "Blog", hobbies: "Hobbies", resume: "Resume", contact: "Contact", pages: "Explore the site",
    currentJob: "Current job", allExperience: "All experience", openExperience: "Open experience.json",
    otherSkills: "Other skills", allSkills: "All skills", skillArea: (area) => `${area} skills`,
    webApps: "Web apps", mobileApps: "Mobile apps", ml: "Machine learning", bots: "Bots & automation",
    allRepos: "All repositories", openProjectsJs: "Open projects.js", openProjectsPy: "Open projects.py",
    otherProjects: "Other projects", allResearch: "Show all research posts", irimas: "IRIMAS internship",
    browseTopics: "Browse by topic", openBlog: "Open blogs.md", blogInsights: "Blog insights", otherTopics: "Other topics",
    browseBlog: "Browse the blog", allHobbies: "All hobbies", openHobbies: "Open hobbies.jsx",
    openResume: "Open resume", downloadPdf: "Download PDF", sendEmail: "Send an email", contactForm: "Contact form",
    contactElnur: "Contact Elnur", openGithub: "Open GitHub", openLinkedin: "Open LinkedIn", repositories: "Repositories",
    githubInsights: "GitHub insights", now: " (now)",
  },
  intents: {
    current: "Current job", years: "Years of experience", first: "First job", location: "Location", email: "Email",
    linkedin: "LinkedIn", github: "GitHub", contact: "Contact", resume: "Resume", education: "Education",
    level: "Experience level", mlprojects: "ML projects", frontend: "Frontend", backend: "Backend", database: "Databases",
    devops: "DevOps", mobile: "Mobile apps", ml: "Data science", research: "Research", hobbies: "Hobbies",
    experience: "Experience", skills: "Skills", projects: "Projects", blog: "Blog", about: "About Elnur",
    pages: "Main menu", bot: "About this chat",
  },
  kinds: { Web: "Web project", "Machine learning": "Machine learning project", Bot: "Bot" },
  hobby: "Hobby",

  about: ({ years, role, company }) =>
    `Elnur Maharramov is a full stack developer based in Baku, Azerbaijan. He works with React and Node.js, and also builds mobile apps and does machine learning research.\nHe has about ${years} of professional experience and is currently a ${role} at ${company}.`,
  experience: ({ count, since, years }) =>
    `Elnur has worked in ${plural("en", count, { one: "position", other: "positions" })} since ${since}, about ${years} in total. Pick one to see the details:`,
  skills: "Elnur's skills by area. Pick one to see the tools and where he used them:",
  skillArea: (label, skills, hasPosts) => `${label}:\n• ${skills.join("\n• ")}${hasPosts ? "\nWhere he used them:" : ""}`,
  projects: "Which kind of projects?",
  projectsWeb: "Web projects:",
  projectsMobile: "Elnur's mobile apps, from his first Flutter app to an online UNO game:",
  projectsMl: "Machine learning projects:",
  projectsBots: "Bots and automation:",
  research: (count) =>
    `Elnur did a research internship at the IRIMAS laboratory in France (Jan – May 2024), working on deep learning for time series classification. He has written ${plural("en", count, { one: "research post", other: "research posts" })}:`,
  researchAll: "All research posts:",
  blog: ({ count, from, to }) => `There are ${plural("en", count, { one: "post", other: "posts" })} on the blog, from ${from} to ${to}. The latest:`,
  blogTopics: "Pick a topic:",
  tag: (tag) => `Posts about ${tag}:`,
  hobbies: "Outside of work, Elnur enjoys:",
  resume: "You can read Elnur's resume on the site or download it as a PDF.",
  contact: (email) => `The fastest way to reach Elnur is by email: ${email}. You can also use the contact form or find him on LinkedIn and GitHub.`,
  pages: 'Every page on this site is a "file". Where do you want to go?',
  bot: "I'm a small assistant built into this portfolio. I don't use an AI service: I run entirely in your browser, split your message into words and match them against Elnur's experience, projects and blog posts. I understand English, Azerbaijani and Russian.",
  job: ({ role, company, location, period, current, description }) =>
    `${role} at ${company}${location ? ` (${location})` : ""}, ${period}${current ? ", his current job" : ""}.\n${description}`,
  tech: ({ name, companies, projects, posts }) => {
    const parts = [];
    if (companies.length) parts.push(`used it at ${list(companies, "and")}`);
    if (projects) parts.push(`built ${plural("en", projects, { one: "project", other: "projects" })} with it`);
    if (posts) parts.push(`wrote ${plural("en", posts, { one: "post", other: "posts" })} that ${posts === 1 ? "involves" : "involve"} it`);
    return parts.length ? `${name}: Elnur ${list(parts, "and")}.` : `${name} is one of Elnur's skills listed on the home page.`;
  },
  hello: "Hi! I can tell you about Elnur's experience, projects, research and blog. What would you like to know?",
  thanks: "You're welcome! Anything else?",
  bye: "Bye! Thanks for visiting. You can reopen me any time with Ctrl+Alt+I.",
  years: ({ years, firstRole, firstCompany, since, role, company }) =>
    `Elnur has about ${years} of professional experience, starting as a ${firstRole} at ${firstCompany} in ${since}. Today he is a ${role} at ${company}.`,
  location: "Elnur is based in Baku, Azerbaijan. He also spent part of 2024 in France during his research internship.",
  email: (email) => `Elnur's email is ${email}.`,
  linkedin: "Here is Elnur's LinkedIn profile.",
  github: "Elnur's code is on GitHub (Elnur21). The site also has pages with his repositories and GitHub statistics.",
  education: "Elnur's full education is listed in his resume. On this site you can read about his Code Academy final project (2023) and his research internship at IRIMAS in France (2024).",
  found: "I found these posts that match your question:",
  hobbyFound: (names, more) => `${list(names, "and")} ${names.length > 1 ? "are" : "is"} one of Elnur's hobbies.${more ? " He also wrote about it:" : ""}`,
  unsure: "I'm not completely sure what you mean. Did you mean one of these?",
  unknown: "Sorry, I didn't understand that. I know about Elnur's experience, skills, projects, research, blog and contacts. Try one of these:",
  skillAreas: {
    frontend: { label: "Frontend", skills: ["HTML5 / CSS3 / Sass", "JavaScript / TypeScript", "React / Next.js", "Vue / Nuxt", "Mantine, responsive design"] },
    backend: { label: "Backend", skills: ["Node.js", "Express / NestJS", "REST, GraphQL, WebSockets", "RabbitMQ", "FastAPI (Python)"] },
    data: { label: "Databases", skills: ["MongoDB", "PostgreSQL / MySQL / MSSQL", "SQLite", "Firebase (Firestore, Realtime DB)", "Prisma, Mongoose, TypeORM, Sequelize"] },
    devops: { label: "DevOps", skills: ["Docker", "AWS", "pm2", "Vercel", "GitHub (PRs, Dependabot)"] },
    ml: { label: "Data science & AI", skills: ["Python, Pandas, NumPy", "TensorFlow / PyTorch", "scikit-learn", "Time series classification", "Local LLMs (Ollama, Whisper)"] },
    mobile: { label: "Mobile", skills: ["Flutter / Dart", "React Native / TypeScript", "Firebase", "SQLite on device"] },
    automation: { label: "Automation", skills: ["RPA with Automation Anywhere", "IQ Bot document AI", "Telegram bots"] },
  },
};

const az = {
  present: "hazırda",
  mainMenu: "Əsas menyu",
  minRead: (n) => `${n} dəq oxu`,
  duration: (years, months) => (months ? `${years} il ${months} ay` : `${years} il`),

  start: "Salam! Mən Elnurun assistentiyəm. Onun işi haqqında istədiyinizi soruşun və ya aşağıdan mövzu seçin.",
  menu: "Elnur haqqında nə bilmək istərdiniz? Mövzu seçin və ya sualınızı yazın.",
  buttons: {
    about: "Elnur haqqında", experience: "Təcrübə", skills: "Bacarıqlar", projects: "Layihələr", research: "Tədqiqat",
    blog: "Bloq", hobbies: "Hobbilər", resume: "Rezume", contact: "Əlaqə", pages: "Saytı gəz",
    currentJob: "Hazırkı işi", allExperience: "Bütün təcrübə", openExperience: "experience.json-u aç",
    otherSkills: "Digər bacarıqlar", allSkills: "Bütün bacarıqlar", skillArea: (area) => `${area} bacarıqları`,
    webApps: "Veb tətbiqlər", mobileApps: "Mobil tətbiqlər", ml: "Maşın öyrənməsi", bots: "Botlar və avtomatlaşdırma",
    allRepos: "Bütün repozitoriyalar", openProjectsJs: "projects.js-i aç", openProjectsPy: "projects.py-ı aç",
    otherProjects: "Digər layihələr", allResearch: "Bütün tədqiqat yazıları", irimas: "IRIMAS təcrübəsi",
    browseTopics: "Mövzular üzrə bax", openBlog: "blogs.md-ni aç", blogInsights: "Bloq statistikası", otherTopics: "Digər mövzular",
    browseBlog: "Bloqa bax", allHobbies: "Bütün hobbilər", openHobbies: "hobbies.jsx-i aç",
    openResume: "Rezumeni aç", downloadPdf: "PDF yüklə", sendEmail: "E-poçt göndər", contactForm: "Əlaqə forması",
    contactElnur: "Elnurla əlaqə", openGithub: "GitHub-ı aç", openLinkedin: "LinkedIn-i aç", repositories: "Repozitoriyalar",
    githubInsights: "GitHub statistikası", now: " (hazırda)",
  },
  intents: {
    current: "Hazırkı işi", years: "Təcrübə müddəti", first: "İlk işi", location: "Yaşadığı yer", email: "E-poçt",
    linkedin: "LinkedIn", github: "GitHub", contact: "Əlaqə", resume: "Rezume", education: "Təhsil",
    level: "Təcrübə səviyyəsi", mlprojects: "ML layihələri", frontend: "Frontend", backend: "Backend", database: "Verilənlər bazaları",
    devops: "DevOps", mobile: "Mobil tətbiqlər", ml: "Data elmi", research: "Tədqiqat", hobbies: "Hobbilər",
    experience: "Təcrübə", skills: "Bacarıqlar", projects: "Layihələr", blog: "Bloq", about: "Elnur haqqında",
    pages: "Əsas menyu", bot: "Bu çat haqqında",
  },
  kinds: { Web: "Veb layihə", "Machine learning": "Maşın öyrənməsi layihəsi", Bot: "Bot" },
  hobby: "Hobbi",

  about: ({ years, role, company }) =>
    `Elnur Məhərrəmov Bakıda yaşayan full stack developerdir. React və Node.js ilə işləyir, həmçinin mobil tətbiqlər hazırlayır və maşın öyrənməsi üzrə tədqiqatlar aparır.\nTəxminən ${years} peşəkar təcrübəsi var. Hazırda ${company} şirkətində ${role} kimi çalışır.`,
  experience: ({ count, since, years }) =>
    `Elnur ${since} tarixindən bəri ${count} vəzifədə çalışıb, ümumilikdə təxminən ${years}. Ətraflı baxmaq üçün birini seçin:`,
  skills: "Elnurun sahələr üzrə bacarıqları. Alətləri və harada istifadə etdiyini görmək üçün birini seçin:",
  skillArea: (label, skills, hasPosts) => `${label}:\n• ${skills.join("\n• ")}${hasPosts ? "\nHarada istifadə edib:" : ""}`,
  projects: "Hansı layihələr maraqlıdır?",
  projectsWeb: "Veb layihələr:",
  projectsMobile: "Elnurun mobil tətbiqləri: ilk Flutter tətbiqindən onlayn UNO oyununa qədər:",
  projectsMl: "Maşın öyrənməsi layihələri:",
  projectsBots: "Botlar və avtomatlaşdırma:",
  research: (count) =>
    `Elnur Fransadakı IRIMAS laboratoriyasında tədqiqat təcrübəsi keçib (yanvar – may 2024) və zaman sıralarının təsnifatı üçün deep learning üzərində işləyib. Tədqiqatla bağlı ${count} yazı yazıb:`,
  researchAll: "Bütün tədqiqat yazıları:",
  blog: ({ count, from, to }) => `Bloqda ${from} – ${to} arasında ${count} yazı var. Ən sonuncular:`,
  blogTopics: "Mövzu seçin:",
  tag: (tag) => `${tag} mövzusunda yazılar:`,
  hobbies: "İşdən kənar Elnurun sevdiyi məşğuliyyətlər:",
  resume: "Elnurun rezumesini saytda oxuya və ya PDF kimi yükləyə bilərsiniz.",
  contact: (email) => `Elnurla əlaqə saxlamağın ən sürətli yolu e-poçtdur: ${email}. Əlaqə formasından da istifadə edə və ya onu LinkedIn və GitHub-da tapa bilərsiniz.`,
  pages: "Bu saytda hər səhifə bir \"fayl\"dır. Hara keçmək istəyirsiniz?",
  bot: "Mən bu portfolioya qurulmuş kiçik assistentəm. Heç bir AI xidmətindən istifadə etmirəm: tamamilə brauzerinizdə işləyirəm, mesajınızı sözlərə bölürəm və onları Elnurun təcrübəsi, layihələri və bloq yazıları ilə müqayisə edirəm. Azərbaycan, ingilis və rus dillərini başa düşürəm.",
  job: ({ role, company, location, period, current, description }) =>
    `${role}, ${company}${location ? ` (${location})` : ""}, ${period}${current ? ", hazırkı işi" : ""}.\n${description}`,
  tech: ({ name, companies, projects, posts }) => {
    const parts = [];
    if (companies.length) parts.push(`bu şirkətlərdə istifadə edib: ${list(companies, "və")}`);
    if (projects) parts.push(`onunla ${projects} layihə qurub`);
    if (posts) parts.push(`bu mövzuda ${posts} yazı yazıb`);
    return parts.length ? `${name}: Elnur ${parts.join("; ")}.` : `${name} Elnurun ana səhifədə qeyd olunan bacarıqlarından biridir.`;
  },
  hello: "Salam! Sizə Elnurun təcrübəsi, layihələri, tədqiqatları və bloqu haqqında danışa bilərəm. Nəyi bilmək istərdiniz?",
  thanks: "Dəyməz! Başqa sualınız var?",
  bye: "Sağ olun! Baxdığınız üçün təşəkkürlər. Məni istənilən vaxt Ctrl+Alt+I ilə yenidən aça bilərsiniz.",
  years: ({ years, firstRole, firstCompany, since, role, company }) =>
    `Elnurun təxminən ${years} peşəkar təcrübəsi var. ${since} tarixində ${firstCompany} şirkətində ${firstRole} kimi başlayıb. Hazırda ${company} şirkətində ${role} kimi çalışır.`,
  location: "Elnur Bakıda, Azərbaycanda yaşayır. 2024-cü ilin bir hissəsini tədqiqat təcrübəsi üçün Fransada keçirib.",
  email: (email) => `Elnurun e-poçt ünvanı: ${email}.`,
  linkedin: "Elnurun LinkedIn profili buradadır.",
  github: "Elnurun kodları GitHub-dadır (Elnur21). Saytda onun repozitoriyaları və GitHub statistikası olan səhifələr də var.",
  education: "Elnurun təhsili haqqında tam məlumat rezumesindədir. Bu saytda onun Code Academy final layihəsi (2023) və Fransadakı IRIMAS tədqiqat təcrübəsi (2024) haqqında oxuya bilərsiniz.",
  found: "Sualınıza uyğun bu yazıları tapdım:",
  hobbyFound: (names, more) => `${list(names, "və")} Elnurun hobbilərindəndir.${more ? " Bu barədə yazısı da var:" : ""}`,
  unsure: "Nəyi nəzərdə tutduğunuzu tam başa düşmədim. Bunlardan birini nəzərdə tuturdunuz?",
  unknown: "Bağışlayın, bunu başa düşmədim. Elnurun təcrübəsi, bacarıqları, layihələri, tədqiqatları, bloqu və əlaqə məlumatları haqqında danışa bilərəm. Bunlardan birini sınayın:",
  skillAreas: {
    frontend: { label: "Frontend", skills: ["HTML5 / CSS3 / Sass", "JavaScript / TypeScript", "React / Next.js", "Vue / Nuxt", "Mantine, responsiv dizayn"] },
    backend: { label: "Backend", skills: ["Node.js", "Express / NestJS", "REST, GraphQL, WebSockets", "RabbitMQ", "FastAPI (Python)"] },
    data: { label: "Verilənlər bazaları", skills: ["MongoDB", "PostgreSQL / MySQL / MSSQL", "SQLite", "Firebase (Firestore, Realtime DB)", "Prisma, Mongoose, TypeORM, Sequelize"] },
    devops: { label: "DevOps", skills: ["Docker", "AWS", "pm2", "Vercel", "GitHub (PR-lar, Dependabot)"] },
    ml: { label: "Data elmi və AI", skills: ["Python, Pandas, NumPy", "TensorFlow / PyTorch", "scikit-learn", "Zaman sıralarının təsnifatı", "Lokal LLM-lər (Ollama, Whisper)"] },
    mobile: { label: "Mobil", skills: ["Flutter / Dart", "React Native / TypeScript", "Firebase", "Cihazda SQLite"] },
    automation: { label: "Avtomatlaşdırma", skills: ["Automation Anywhere ilə RPA", "IQ Bot (Document AI)", "Telegram botları"] },
  },
};

const ru = {
  present: "наст. время",
  mainMenu: "Главное меню",
  minRead: (n) => `${n} мин чтения`,
  duration: (years, months) => {
    const y = plural("ru", years, { one: "год", few: "года", many: "лет", other: "года" });
    return months ? `${y} и ${plural("ru", months, { one: "месяц", few: "месяца", many: "месяцев", other: "месяца" })}` : y;
  },

  start: "Привет! Я ассистент Эльнура. Спросите что угодно о его работе или выберите тему ниже.",
  menu: "Что бы вы хотели узнать об Эльнуре? Выберите тему или просто напишите вопрос.",
  buttons: {
    about: "Об Эльнуре", experience: "Опыт", skills: "Навыки", projects: "Проекты", research: "Исследования",
    blog: "Блог", hobbies: "Хобби", resume: "Резюме", contact: "Контакты", pages: "Обзор сайта",
    currentJob: "Текущая работа", allExperience: "Весь опыт", openExperience: "Открыть experience.json",
    otherSkills: "Другие навыки", allSkills: "Все навыки", skillArea: (area) => `Навыки: ${area}`,
    webApps: "Веб-приложения", mobileApps: "Мобильные приложения", ml: "Машинное обучение", bots: "Боты и автоматизация",
    allRepos: "Все репозитории", openProjectsJs: "Открыть projects.js", openProjectsPy: "Открыть projects.py",
    otherProjects: "Другие проекты", allResearch: "Все статьи об исследованиях", irimas: "Стажировка в IRIMAS",
    browseTopics: "По темам", openBlog: "Открыть blogs.md", blogInsights: "Статистика блога", otherTopics: "Другие темы",
    browseBlog: "Открыть блог", allHobbies: "Все хобби", openHobbies: "Открыть hobbies.jsx",
    openResume: "Открыть резюме", downloadPdf: "Скачать PDF", sendEmail: "Написать письмо", contactForm: "Форма связи",
    contactElnur: "Связаться с Эльнуром", openGithub: "Открыть GitHub", openLinkedin: "Открыть LinkedIn", repositories: "Репозитории",
    githubInsights: "Статистика GitHub", now: " (сейчас)",
  },
  intents: {
    current: "Текущая работа", years: "Стаж", first: "Первая работа", location: "Где живёт", email: "Email",
    linkedin: "LinkedIn", github: "GitHub", contact: "Контакты", resume: "Резюме", education: "Образование",
    level: "Уровень опыта", mlprojects: "ML-проекты", frontend: "Фронтенд", backend: "Бэкенд", database: "Базы данных",
    devops: "DevOps", mobile: "Мобильные приложения", ml: "Data science", research: "Исследования", hobbies: "Хобби",
    experience: "Опыт", skills: "Навыки", projects: "Проекты", blog: "Блог", about: "Об Эльнуре",
    pages: "Главное меню", bot: "Об этом чате",
  },
  kinds: { Web: "Веб-проект", "Machine learning": "Проект по машинному обучению", Bot: "Бот" },
  hobby: "Хобби",

  about: ({ years, role, company }) =>
    `Эльнур Магеррамов — full stack разработчик из Баку, Азербайджан. Работает с React и Node.js, а также делает мобильные приложения и занимается исследованиями в машинном обучении.\nУ него примерно ${years} профессионального опыта, сейчас он ${role} в ${company}.`,
  experience: ({ count, since, years }) =>
    `С ${since} Эльнур сменил ${plural("ru", count, { one: "позицию", few: "позиции", many: "позиций", other: "позиции" })}, в сумме примерно ${years}. Выберите, чтобы узнать подробности:`,
  skills: "Навыки Эльнура по направлениям. Выберите, чтобы увидеть инструменты и где он их применял:",
  skillArea: (label, skills, hasPosts) => `${label}:\n• ${skills.join("\n• ")}${hasPosts ? "\nГде он их применял:" : ""}`,
  projects: "Какие проекты вас интересуют?",
  projectsWeb: "Веб-проекты:",
  projectsMobile: "Мобильные приложения Эльнура — от первого приложения на Flutter до онлайн-игры UNO:",
  projectsMl: "Проекты по машинному обучению:",
  projectsBots: "Боты и автоматизация:",
  research: (count) =>
    `Эльнур проходил исследовательскую стажировку в лаборатории IRIMAS во Франции (январь – май 2024) и занимался глубоким обучением для классификации временных рядов. Об исследованиях он написал ${plural("ru", count, { one: "статью", few: "статьи", many: "статей", other: "статьи" })}:`,
  researchAll: "Все статьи об исследованиях:",
  blog: ({ count, from, to }) => `В блоге ${plural("ru", count, { one: "статья", few: "статьи", many: "статей", other: "статьи" })}, с ${from} по ${to}. Последние:`,
  blogTopics: "Выберите тему:",
  tag: (tag) => `Статьи по теме «${tag}»:`,
  hobbies: "Вне работы Эльнур любит:",
  resume: "Резюме Эльнура можно прочитать на сайте или скачать в PDF.",
  contact: (email) => `Быстрее всего связаться с Эльнуром по email: ${email}. Также можно заполнить форму связи или найти его в LinkedIn и на GitHub.`,
  pages: "Каждая страница этого сайта — «файл». Куда перейти?",
  bot: "Я небольшой ассистент, встроенный в это портфолио. Я не использую ИИ-сервисы: работаю прямо в вашем браузере, разбиваю сообщение на слова и сопоставляю их с опытом, проектами и статьями Эльнура. Понимаю русский, английский и азербайджанский.",
  job: ({ role, company, location, period, current, description }) =>
    `${role} в ${company}${location ? ` (${location})` : ""}, ${period}${current ? " — текущая работа" : ""}.\n${description}`,
  tech: ({ name, companies, projects, posts }) => {
    const parts = [];
    if (companies.length) parts.push(`применял в ${list(companies, "и")}`);
    if (projects) parts.push(`сделал ${plural("ru", projects, { one: "проект", few: "проекта", many: "проектов", other: "проекта" })}`);
    if (posts) parts.push(`написал ${plural("ru", posts, { one: "статью", few: "статьи", many: "статей", other: "статьи" })} по теме`);
    return parts.length ? `${name}: Эльнур ${list(parts, "и")}.` : `${name} — один из навыков Эльнура, указанных на главной странице.`;
  },
  hello: "Привет! Могу рассказать об опыте Эльнура, его проектах, исследованиях и блоге. Что вас интересует?",
  thanks: "Пожалуйста! Что-нибудь ещё?",
  bye: "До встречи! Спасибо, что заглянули. Открыть меня снова можно в любой момент через Ctrl+Alt+I.",
  years: ({ years, firstRole, firstCompany, since, role, company }) =>
    `У Эльнура примерно ${years} профессионального опыта. Он начинал в ${since} как ${firstRole} в ${firstCompany}, а сейчас работает как ${role} в ${company}.`,
  location: "Эльнур живёт в Баку, Азербайджан. Часть 2024 года он провёл во Франции на исследовательской стажировке.",
  email: (email) => `Email Эльнура: ${email}.`,
  linkedin: "Вот профиль Эльнура в LinkedIn.",
  github: "Код Эльнура — на GitHub (Elnur21). На сайте также есть страницы с его репозиториями и статистикой GitHub.",
  education: "Полная информация об образовании Эльнура есть в его резюме. На сайте можно почитать о его финальном проекте в Code Academy (2023) и об исследовательской стажировке в IRIMAS во Франции (2024).",
  found: "Нашёл статьи по вашему вопросу:",
  hobbyFound: (names, more) => `${list(names, "и")} — ${names.length > 1 ? "это хобби" : "одно из хобби"} Эльнура.${more ? " Он также писал об этом:" : ""}`,
  unsure: "Не совсем понял, что вы имеете в виду. Может, одно из этого?",
  unknown: "Извините, я не понял вопрос. Я знаю об опыте Эльнура, его навыках, проектах, исследованиях, блоге и контактах. Попробуйте одно из этого:",
  skillAreas: {
    frontend: { label: "Фронтенд", skills: ["HTML5 / CSS3 / Sass", "JavaScript / TypeScript", "React / Next.js", "Vue / Nuxt", "Mantine, адаптивная вёрстка"] },
    backend: { label: "Бэкенд", skills: ["Node.js", "Express / NestJS", "REST, GraphQL, WebSockets", "RabbitMQ", "FastAPI (Python)"] },
    data: { label: "Базы данных", skills: ["MongoDB", "PostgreSQL / MySQL / MSSQL", "SQLite", "Firebase (Firestore, Realtime DB)", "Prisma, Mongoose, TypeORM, Sequelize"] },
    devops: { label: "DevOps", skills: ["Docker", "AWS", "pm2", "Vercel", "GitHub (PR, Dependabot)"] },
    ml: { label: "Data science и ИИ", skills: ["Python, Pandas, NumPy", "TensorFlow / PyTorch", "scikit-learn", "Классификация временных рядов", "Локальные LLM (Ollama, Whisper)"] },
    mobile: { label: "Мобильная разработка", skills: ["Flutter / Dart", "React Native / TypeScript", "Firebase", "SQLite на устройстве"] },
    automation: { label: "Автоматизация", skills: ["RPA в Automation Anywhere", "IQ Bot (Document AI)", "Telegram-боты"] },
  },
};

export const STRINGS = { en, az, ru };
