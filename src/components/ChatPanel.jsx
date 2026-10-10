import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import styles from "../styles/ChatPanel.module.css";
import { useAppStore } from "@/libs/store";
import { useT } from "@/i18n";

const TYPING_DELAY = 450;

// Text with line breaks; runs of lines starting with "•" become lists
const BotText = ({ text }) => {
  const blocks = [];
  text.split("\n").forEach((line) => {
    if (line.startsWith("•")) {
      const last = blocks[blocks.length - 1];
      const item = line.replace(/^•\s*/, "");
      if (Array.isArray(last)) last.push(item);
      else blocks.push([item]);
    } else blocks.push(line);
  });
  return blocks.map((block, i) =>
    Array.isArray(block) ? (
      <ul key={i}>
        {block.map((item, j) => (
          <li key={j}>{item}</li>
        ))}
      </ul>
    ) : (
      <p key={i}>{block}</p>
    )
  );
};

const SparkleIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M8 0l1.7 4.6L14.4 6 9.7 7.7 8 12.3 6.3 7.7 1.6 6l4.7-1.4z" />
    <path d="M13 10l.8 2.2 2.2.8-2.2.8L13 16l-.8-2.2-2.2-.8 2.2-.8z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5z" />
  </svg>
);

const ChatPanel = () => {
  const router = useRouter();
  const t = useT();
  const messages = useAppStore((state) => state.chatMessages);
  const addMessage = useAppStore((state) => state.addChatMessage);
  const clearChat = useAppStore((state) => state.clearChat);
  const setChatOpen = useAppStore((state) => state.setChatOpen);
  const addTab = useAppStore((state) => state.addTab);

  const [bot, setBot] = useState(null);
  // Smart answers (multilingual embedding model in a Web Worker)
  const [smart, setSmart] = useState(null);
  const [smartStatus, setSmartStatus] = useState({ state: "off", progress: 0 });
  const [pages, setPages] = useState([]);
  const [typing, setTyping] = useState(false);
  // Language of the conversation: starts as the site language, then follows
  // whatever language the visitor writes in. Buttons answer in this language.
  const [chatLang, setChatLang] = useState(router.locale);
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Load the bot and the site's data only when the panel is opened
  useEffect(() => {
    let unsubscribe = () => {};
    Promise.all([
      import("@/libs/chatbot"),
      import("@/libs/chatbot/smart"),
      import("@/libs/chatbot/smartClient"),
    ]).then(([chatbot, { smartAnswer }, client]) => {
      setBot(chatbot.bot);
      setPages(chatbot.pages);
      setSmart({ ...client, smartAnswer });
      setSmartStatus(client.getStatus());
      unsubscribe = client.subscribe(setSmartStatus);
      if (client.shouldAutoEnable()) client.enable();
    });
    inputRef.current?.focus();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (bot && messages.length === 0) addMessage({ from: "bot", ...bot.start(chatLang) });
  }, [bot, messages.length, addMessage, chatLang]);

  // Switching the site language moves the conversation to it too; if nothing
  // was asked yet, the greeting is shown again in the new language
  useEffect(() => {
    setChatLang(router.locale);
    if (!useAppStore.getState().chatMessages.some((m) => m.from === "user")) clearChat();
  }, [router.locale, clearChat]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  // Show the user's message, then the bot's answer after a short "typing" pause
  const ask = (userText, getAnswer) => {
    if (!bot || typing) return;
    addMessage({ from: "user", text: userText });
    setTyping(true);
    const delay = new Promise((resolve) => setTimeout(resolve, TYPING_DELAY));
    Promise.all([getAnswer(), delay]).then(([answer]) => {
      if (answer.lang) setChatLang(answer.lang);
      addMessage({ from: "bot", ...answer });
      setTyping(false);
    });
  };

  // The rules answer first; when the model is ready it may find a better
  // answer by meaning (paraphrases, specific questions about a post)
  const answerText = async (text) => {
    const rule = bot.reply(text, chatLang);
    if (smartStatus.state !== "ready") return rule;
    const vector = await smart.embed(text);
    if (!vector) return rule;
    return smart.smartAnswer({ bot, index: smart.getIndex(), vector, text, rule }) || rule;
  };

  const toggleSmart = () => {
    if (!smart) return;
    if (smartStatus.state === "off" || smartStatus.state === "error") smart.enable();
    else smart.disable();
  };

  const openPage = (path, query = "") => {
    const page = pages.find((p) => p.path === path);
    if (page) addTab({ fileName: page.name, icon: page.icon, path });
    router.push(path + query);
    // On small screens the panel covers the page, so get out of the way
    if (window.innerWidth < 700) setChatOpen(false);
  };

  const runAction = (label, action) => {
    switch (action.type) {
      case "topic":
        return ask(label, () => bot.show(action.id, chatLang));
      case "intent":
        return ask(label, () => bot.intent(action.id, chatLang));
      case "navigate":
        return openPage(action.path);
      case "post":
        return openPage("/blogs", `?post=${action.slug}`);
      case "link":
        return window.open(action.href, action.href.startsWith("mailto:") ? "_self" : "_blank", "noopener");
      case "download": {
        const a = document.createElement("a");
        a.href = action.href;
        a.download = action.filename;
        a.click();
        return;
      }
    }
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    ask(text, () => answerText(text));
  };

  const lastBot = messages.map((m) => m.from).lastIndexOf("bot");

  return (
    <aside className={styles.panel} aria-label="Chat">
      <header className={styles.header}>
        <span className={styles.title}>{t("chat.title")}</span>
        <div className={styles.headerActions}>
          <button
            onClick={toggleSmart}
            className={`${styles.smartToggle} ${styles[`smart_${smartStatus.state}`] || ""}`}
            title={t(`chat.smart.${smartStatus.state}`, { size: 118, progress: smartStatus.progress })}
            aria-label={t(`chat.smart.${smartStatus.state}`, { size: 118, progress: smartStatus.progress })}
            aria-pressed={smartStatus.state === "ready" || smartStatus.state === "loading"}
          >
            <SparkleIcon />
            {smartStatus.state === "loading" && <span className={styles.smartProgress}>{smartStatus.progress}%</span>}
          </button>
          <button onClick={clearChat} title={t("chat.newChat")} aria-label={t("chat.newChat")}>
            +
          </button>
          <button onClick={() => setChatOpen(false)} title={t("chat.close")} aria-label={t("chat.close")}>
            ×
          </button>
        </div>
      </header>
      {smartStatus.state === "loading" && (
        <div className={styles.progressBar} role="progressbar" aria-valuenow={smartStatus.progress}>
          <div style={{ width: `${smartStatus.progress}%` }} />
        </div>
      )}

      <div className={styles.messages} ref={listRef}>
        {!bot && <p className={styles.loading}>{t("chat.loading")}</p>}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.message} ${m.from === "user" ? styles.user : styles.bot}`}
            lang={m.lang}
          >
            <div className={styles.author}>
              {m.from === "bot" ? (
                <>
                  <span className={styles.avatar}><SparkleIcon /></span>{t("chat.assistant")}
                  {m.smart && (
                    <span className={styles.smartBadge} title={t("chat.smart.badgeTitle")}>
                      {t("chat.smart.badge")}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className={`${styles.avatar} ${styles.userAvatar}`}><UserIcon /></span>{t("chat.you")}
                </>
              )}
            </div>
            <div className={styles.body}>
              {m.from === "bot" ? <BotText text={m.text} /> : <p>{m.text}</p>}

              {m.items?.length > 0 && (
                <div className={styles.items}>
                  {m.items.map((item) =>
                    item.action ? (
                      <button key={item.title} className={styles.item} onClick={() => runAction(item.title, item.action)}>
                        <span className={styles.itemTitle}>{item.title}</span>
                        {item.meta && <span className={styles.itemMeta}>{item.meta}</span>}
                        {item.desc && <span className={styles.itemDesc}>{item.desc}</span>}
                      </button>
                    ) : (
                      <div key={item.title} className={styles.item}>
                        <span className={styles.itemTitle}>{item.title}</span>
                        {item.meta && <span className={styles.itemMeta}>{item.meta}</span>}
                        {item.desc && <span className={styles.itemDesc}>{item.desc}</span>}
                      </div>
                    )
                  )}
                </div>
              )}

              {m.buttons?.length > 0 && (
                <div className={`${styles.buttons} ${i !== lastBot ? styles.old : ""}`}>
                  {m.buttons.map((b) => (
                    <button key={b.label} onClick={() => runAction(b.label, b.action)} className={styles.chip}>
                      {b.label}
                      {["navigate", "post", "link", "download"].includes(b.action.type) && (
                        <span className={styles.external}>↗</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className={`${styles.message} ${styles.bot}`}>
            <div className={styles.author}>
              <span className={styles.avatar}><SparkleIcon /></span>{t("chat.assistant")}
            </div>
            <div className={styles.typing}>
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        <textarea
          ref={inputRef}
          value={input}
          rows={2}
          placeholder={t("chat.placeholder")}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <div className={styles.inputFooter}>
          <span>{t("chat.hint")}</span>
          <button onClick={send} disabled={!input.trim() || !bot} aria-label={t("chat.send")} className={styles.send}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M1 1.9l14 6.1-14 6.1 2-6.1zm2.7 6.6L2.6 12l9.3-4-9.3-4 1.1 3.5H9v1z" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ChatPanel;
