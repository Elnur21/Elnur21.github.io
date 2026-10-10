// Example questions for each chatbot intent, in English, Azerbaijani and Russian.
// They are embedded by scripts/build-chat-index.mjs; a visitor's question is
// matched to the closest example by meaning, so paraphrases the keyword rules
// miss still find the right answer. Ids match the intents in engine.js.

export const INTENT_EXAMPLES = {
  current: [
    "What is his current job?", "Where does Elnur work now?", "What is he doing these days?", "Who is his employer at the moment?",
    "Hazırda harada işləyir?", "İndi nə işlə məşğuldur?", "Hazırkı işi nədir?", "Hal-hazırda hansı şirkətdə çalışır?",
    "Где он сейчас работает?", "Чем он сейчас занимается?", "Какая у него текущая работа?", "В какой компании он работает?",
  ],
  years: [
    "How many years of experience does he have?", "How long has he been working as a developer?", "How experienced is Elnur?",
    "Neçə il təcrübəsi var?", "Nə qədər vaxtdır developer kimi işləyir?", "Təcrübəsi nə qədərdir?",
    "Сколько лет опыта у него?", "Как долго он работает разработчиком?", "Какой у него стаж?",
  ],
  first: [
    "What was his first job?", "Where did he start his career?", "How did his career begin?",
    "İlk işi nə olub?", "Karyerasına harada başlayıb?",
    "Какая была его первая работа?", "С чего он начинал карьеру?",
  ],
  location: [
    "Where does he live?", "Where is Elnur from?", "Which city is he based in?", "Is he based in Azerbaijan?",
    "Harada yaşayır?", "Haralıdır?", "Hansı şəhərdə yaşayır?",
    "Где он живёт?", "Откуда Эльнур?", "В каком городе он находится?",
  ],
  email: [
    "What is his email address?", "How can I email him?",
    "E-poçt ünvanı nədir?", "Ona necə məktub yaza bilərəm?",
    "Какой у него email?", "Как ему написать на почту?",
  ],
  contact: [
    "How can I contact him?", "I want to hire Elnur", "Is he open to new opportunities?", "Can we work together?",
    "Onunla necə əlaqə saxlaya bilərəm?", "Elnuru işə götürmək istəyirəm", "Birlikdə işləyə bilərikmi?",
    "Как с ним связаться?", "Хочу нанять Эльнура", "Открыт ли он к предложениям?", "Можно ли с ним сотрудничать?",
  ],
  resume: [
    "Can I see his CV?", "Where can I download his resume?",
    "Rezumesini harada görə bilərəm?", "CV-ni yükləmək istəyirəm",
    "Где можно скачать его резюме?", "Покажи его CV",
  ],
  education: [
    "Where did he study?", "What is his education?", "Does he have a degree?",
    "Harada oxuyub?", "Təhsili nədir?",
    "Где он учился?", "Какое у него образование?",
  ],
  frontend: [
    "Is he good at frontend development?", "What UI technologies does he use?",
    "Frontend-də nə bilir?", "Hansı frontend texnologiyalarını bilir?",
    "Что он умеет во фронтенде?", "Какие фронтенд-технологии он знает?",
  ],
  backend: [
    "Does he do backend development?", "What does he use on the server side?",
    "Backend-də nə ilə işləyir?", "Server tərəfində hansı texnologiyalar?",
    "Занимается ли он бэкендом?", "Что он использует на сервере?",
  ],
  database: [
    "Which databases does he know?", "Has he worked with SQL or MongoDB?",
    "Hansı verilənlər bazalarını bilir?",
    "С какими базами данных он работал?",
  ],
  devops: [
    "Does he know Docker and deployment?", "How does he deploy his apps?",
    "Deploy və Docker bilirmi?",
    "Умеет ли он деплоить и работать с Docker?",
  ],
  mobile: [
    "Has he built mobile apps?", "Does he develop for Android or iOS?",
    "Mobil tətbiq hazırlayıbmı?", "Telefon üçün proqram yazıb?",
    "Делал ли он мобильные приложения?", "Пишет ли он под Android?",
  ],
  ml: [
    "Does he know machine learning?", "Has he worked with AI or neural networks?", "Is he a data scientist?",
    "Süni intellektlə işləyibmi?", "Maşın öyrənməsi bilir?",
    "Знает ли он машинное обучение?", "Работал ли он с нейросетями?",
  ],
  research: [
    "What research has he done?", "Tell me about his scientific work", "Did he publish any research on time series?",
    "Hansı tədqiqatlar aparıb?", "Elmi işləri haqqında danış",
    "Какими исследованиями он занимался?", "Расскажи о его научной работе",
  ],
  hobbies: [
    "What does he do in his free time?", "What are his hobbies?", "What does he like outside of work?",
    "Boş vaxtında nə edir?", "Hobbiləri nələrdir?", "İşdən kənar nəyi sevir?",
    "Чем он занимается в свободное время?", "Какие у него хобби?", "Что он любит помимо работы?",
  ],
  projects: [
    "What projects has he built?", "Show me his work", "What has he made?",
    "Hansı layihələri var?", "Nələr qurub?",
    "Какие у него проекты?", "Покажи его работы",
  ],
  skills: [
    "What technologies does he know?", "What is his tech stack?", "What are his skills?",
    "Hansı texnologiyaları bilir?", "Bacarıqları nələrdir?",
    "Какие технологии он знает?", "Какой у него стек?",
  ],
  experience: [
    "Where has he worked?", "Tell me about his work experience", "Which companies has he worked for?",
    "Harada işləyib?", "İş təcrübəsi haqqında danış",
    "Где он работал?", "Расскажи о его опыте работы",
  ],
  blog: [
    "Does he write a blog?", "What are his latest articles?",
    "Bloq yazır?", "Son yazıları hansılardır?",
    "Ведёт ли он блог?", "Какие у него последние статьи?",
  ],
  about: [
    "Who is Elnur?", "Tell me about him", "Introduce Elnur",
    "Elnur kimdir?", "Onun haqqında danış",
    "Кто такой Эльнур?", "Расскажи о нём",
  ],
  website: [
    "How was this website built?", "What is this site made with?", "Which framework does this portfolio use?", "Why does this site look like VS Code?",
    "Bu sayt necə qurulub?", "Bu portfolio nə ilə hazırlanıb?", "Niyə sayt VS Code kimi görünür?",
    "Как сделан этот сайт?", "На чём написано это портфолио?", "Почему сайт похож на VS Code?",
  ],
  bot: [
    "Are you a real person?", "Who are you?", "Are you ChatGPT?", "How do you work?",
    "Sən kimsən?", "Sən insansan?", "Necə işləyirsən?",
    "Ты кто?", "Ты человек?", "Как ты работаешь?",
  ],
  hello: ["Hello", "Hi there", "Good morning", "Salam", "Salam, necəsən?", "Привет", "Здравствуйте"],
  thanks: ["Thank you", "Thanks a lot", "Təşəkkür edirəm", "Sağ ol", "Спасибо", "Большое спасибо"],
  bye: ["Goodbye", "See you", "Sağ ol, görüşənədək", "Hələlik", "До свидания", "Пока"],
};
