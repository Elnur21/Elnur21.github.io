import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/Titlebar.module.css";
import { useAppStore } from "@/libs/store";
import { toast } from "react-toastify";
import CommentIcon from "./icons/CommentIcon";
import LanguageSwitcher from "./LanguageSwitcher";
import { useT } from "@/i18n";

const PAGE_TABS = {
  "/": { icon: "/react_icon.svg", fileName: "home.jsx" },
  "/resume": { icon: "/html_icon.svg", fileName: "resume.html" },
  "/contact": { icon: "/yml_icon.svg", fileName: "contact.yml" },
  "/projects-js": { icon: "/js_icon.svg", fileName: "projects.js" },
  "/projects-py": { icon: "/py_icon.svg", fileName: "projects.py" },
  "/languages": { icon: "/json_icon.svg", fileName: "languages.json" },
  "/github": { icon: "/markdown_icon.svg", fileName: "github.md" },
  "/experience": { icon: "/json_icon.svg", fileName: "experience.json" },
  "/hobbies": { icon: "/react_icon.svg", fileName: "hobbies.jsx" },
  "/blogs": { icon: "/markdown_icon.svg", fileName: "blogs.md" },
};

// [keys, description key in titlebar.shortcuts]
const SHORTCUTS = [
  ["Ctrl + `", "newTerminal"],
  ["Ctrl + W", "closeTab"],
  ["Ctrl + Shift + P", "commandPalette"],
  ["Ctrl + /", "toggleComment"],
  ["Alt + ↑ / ↓", "moveLine"],
  ["Ctrl + L", "copyUrl"],
  ["Ctrl + F", "find"],
  ["F11", "fullscreen"],
];

// Items with a `key` are translated (titlebar.items.<key>); items with a
// `label` are file names and stay as they are
const MENUS = [
  {
    label: "File",
    items: [
      { key: "openHome", shortcut: "Ctrl+H", action: "navigate", path: "/" },
      { key: "downloadResume", shortcut: "Ctrl+S", action: "downloadResume" },
      { type: "separator" },
      { key: "closeTab", shortcut: "Ctrl+W", action: "closeTab" },
    ],
  },
  {
    label: "Edit",
    items: [
      { key: "copyUrl", shortcut: "Ctrl+L", action: "copyUrl" },
      { key: "findInPage", shortcut: "Ctrl+F", action: "findInPage" },
      { type: "separator" },
      { key: "toggleFullscreen", shortcut: "F11", action: "toggleFullscreen" },
    ],
  },
  {
    label: "View",
    items: [
      { key: "zoomIn", shortcut: "Ctrl++", action: "zoomIn" },
      { key: "zoomOut", shortcut: "Ctrl+-", action: "zoomOut" },
      { key: "resetZoom", shortcut: "Ctrl+0", action: "resetZoom" },
      { type: "separator" },
      { key: "toggleChat", shortcut: "Ctrl+Alt+I", action: "toggleChat" },
      { type: "separator" },
      { key: "toggleFullscreen", shortcut: "F11", action: "toggleFullscreen" },
    ],
  },
  {
    label: "Go",
    items: [
      { key: "back", shortcut: "Alt+←", action: "goBack" },
      { key: "forward", shortcut: "Alt+→", action: "goForward" },
      { type: "separator" },
      { label: "~/home.jsx", shortcut: "", action: "navigate", path: "/" },
      { label: "~/resume.html", shortcut: "", action: "navigate", path: "/resume" },
      { label: "~/experience.json", shortcut: "", action: "navigate", path: "/experience" },
      { label: "~/projects.js", shortcut: "", action: "navigate", path: "/projects-js" },
      { label: "~/projects.py", shortcut: "", action: "navigate", path: "/projects-py" },
      { label: "~/hobbies.jsx", shortcut: "", action: "navigate", path: "/hobbies" },
      { label: "~/blogs.md", shortcut: "", action: "navigate", path: "/blogs" },
      { label: "~/languages.json", shortcut: "", action: "navigate", path: "/languages" },
      { label: "~/contact.yml", shortcut: "", action: "navigate", path: "/contact" },
    ],
  },
  {
    label: "Run",
    items: [
      { key: "runDev", shortcut: "F5", action: "runDev" },
      { key: "runBuild", shortcut: "Ctrl+F5", action: "runBuild" },
      { type: "separator" },
      { key: "runStop", shortcut: "Shift+F5", action: "runStop" },
    ],
  },
  {
    label: "Terminal",
    items: [
      { key: "newTerminal", shortcut: "Ctrl+`", action: "newTerminal" },
      { key: "npmInstall", shortcut: "", action: "npmInstall" },
      { key: "npmDev", shortcut: "", action: "npmDev" },
      { type: "separator" },
      { key: "killTerminal", shortcut: "", action: "killTerminal" },
    ],
  },
  {
    label: "Help",
    items: [
      { key: "welcome", shortcut: "", action: "welcome" },
      { key: "shortcuts", shortcut: "Ctrl+K S", action: "shortcuts" },
      { type: "separator" },
      { key: "github", shortcut: "", action: "github" },
      { key: "contact", shortcut: "", action: "navigate", path: "/contact" },
      { type: "separator" },
      { key: "about", shortcut: "", action: "about" },
    ],
  },
];

const TerminalToast = ({ lines }) => (
  <div className={styles.terminalToast}>
    {lines.map((line, i) =>
      line.type === "success" ? (
        <div key={i} className={styles.terminalSuccess}>{line.text}</div>
      ) : line.type === "error" ? (
        <div key={i} className={styles.terminalError}>{line.text}</div>
      ) : line.type === "dim" ? (
        <div key={i} className={styles.terminalDim}>{line.text}</div>
      ) : (
        <div key={i}>{line.text}</div>
      )
    )}
  </div>
);

export default function Titlebar() {
  const router = useRouter();
  const { addTab, removeTab, tabs } = useAppStore();
  const chatOpen = useAppStore((state) => state.chatOpen);
  const toggleChat = useAppStore((state) => state.toggleChat);
  // chatOpen is restored from localStorage; only reflect it after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const t = useT();
  const [openMenu, setOpenMenu] = useState(null);
  const [zoom, setZoom] = useState(100);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navigate = (path) => {
    const tab = PAGE_TABS[path];
    if (tab) addTab({ ...tab, path });
    router.push(path);
    setOpenMenu(null);
  };

  const handleAction = (item) => {
    setOpenMenu(null);
    switch (item.action) {
      case "navigate":
        navigate(item.path);
        break;

      case "downloadResume":
        const a = document.createElement("a");
        a.href = "/Resume.pdf";
        a.download = "ElnurMaharramov_CV.pdf";
        a.click();
        toast.success(t("titlebar.toasts.downloading"));
        break;

      case "closeTab": {
        const path = router.pathname;
        if (path === "/") { toast.info(t("titlebar.toasts.cannotClose")); return; }
        removeTab(path);
        const remaining = tabs.filter((t) => t.path !== path);
        router.push(remaining.length ? remaining[remaining.length - 1].path : "/");
        toast.info(t("titlebar.toasts.tabClosed"));
        break;
      }

      case "copyUrl":
        navigator.clipboard.writeText(window.location.href).then(() =>
          toast.success(t("titlebar.toasts.urlCopied"))
        );
        break;

      case "findInPage":
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "f", ctrlKey: true, bubbles: true }));
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "f", ctrlKey: true, bubbles: true }));
        toast.info(t("titlebar.toasts.findHint"));
        break;

      case "toggleChat":
        toggleChat();
        break;

      case "toggleFullscreen":
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          toast.info(t("titlebar.toasts.fullscreenOn"));
        } else {
          document.exitFullscreen();
          toast.info(t("titlebar.toasts.fullscreenOff"));
        }
        break;

      case "zoomIn": {
        const next = Math.min(zoom + 10, 150);
        setZoom(next);
        document.body.style.zoom = `${next}%`;
        toast.info(`🔍 ${t("titlebar.toasts.zoom", { n: next })}`);
        break;
      }

      case "zoomOut": {
        const next = Math.max(zoom - 10, 70);
        setZoom(next);
        document.body.style.zoom = `${next}%`;
        toast.info(`🔎 ${t("titlebar.toasts.zoom", { n: next })}`);
        break;
      }

      case "resetZoom":
        setZoom(100);
        document.body.style.zoom = "100%";
        toast.info(t("titlebar.toasts.zoomReset"));
        break;

      case "goBack":
        router.back();
        break;

      case "goForward":
        window.history.forward();
        break;

      case "runDev":
        toast.info(
          <TerminalToast lines={[
            { text: "$ npm run dev", type: "dim" },
            { text: "" },
            { text: "> portfolio@2.5.0 dev" },
            { text: "> next dev" },
            { text: "" },
            { text: "  ▲ Next.js 14", type: "success" },
            { text: "  - Local:  http://localhost:3000", type: "success" },
            { text: "" },
            { text: "✓ Ready in 1.1s", type: "success" },
          ]} />,
          { autoClose: 6000 }
        );
        break;

      case "runBuild":
        toast.info(
          <TerminalToast lines={[
            { text: "$ npm run build", type: "dim" },
            { text: "" },
            { text: "  ▲ Next.js 14 — Building..." },
            { text: "  ✓ Compiled successfully", type: "success" },
            { text: "  ✓ Collecting page data", type: "success" },
            { text: "  ✓ Generating static pages (12/12)", type: "success" },
            { text: "" },
            { text: "  Route (pages)          Size", type: "dim" },
            { text: "  ┌ / (home.jsx)         4.2 kB", type: "dim" },
            { text: "  ├ /experience          3.1 kB", type: "dim" },
            { text: "  └ /hobbies             2.8 kB", type: "dim" },
          ]} />,
          { autoClose: 8000 }
        );
        break;

      case "runStop":
        toast.warn(
          <TerminalToast lines={[
            { text: "^C", type: "error" },
            { text: t("titlebar.toasts.processTerminated"), type: "dim" },
          ]} />,
          { autoClose: 3000 }
        );
        break;

      case "newTerminal":
        toast.info(
          <TerminalToast lines={[
            { text: "elnur@portfolio:~$", type: "success" },
            { text: "" },
            { text: t("titlebar.toasts.typeHelp"), type: "dim" },
          ]} />,
          { autoClose: 4000 }
        );
        break;

      case "npmInstall":
        toast.info(
          <TerminalToast lines={[
            { text: "$ npm install", type: "dim" },
            { text: "" },
            { text: "added 312 packages in 4.2s", type: "success" },
            { text: "found 0 vulnerabilities", type: "success" },
          ]} />,
          { autoClose: 4000 }
        );
        break;

      case "npmDev":
        toast.info(
          <TerminalToast lines={[
            { text: "$ npm run dev", type: "dim" },
            { text: "  ▲ Next.js 14 — ready on http://localhost:3000", type: "success" },
          ]} />,
          { autoClose: 4000 }
        );
        break;

      case "killTerminal":
        toast.warn(
          <TerminalToast lines={[
            { text: `^C  ${t("titlebar.toasts.processKilled")}`, type: "error" },
          ]} />,
          { autoClose: 3000 }
        );
        break;

      case "welcome":
        toast.info(
          <TerminalToast lines={[
            { text: t("titlebar.toasts.welcomeTitle") },
            { text: "" },
            { text: t("titlebar.toasts.welcomeBuilt"), type: "dim" },
            { text: t("titlebar.toasts.welcomeNavigate"), type: "dim" },
          ]} />,
          { autoClose: 5000 }
        );
        break;

      case "shortcuts":
        toast.info(
          <div className={styles.shortcutsToast}>
            <div className={styles.shortcutsTitle}>{t("titlebar.toasts.shortcutsTitle")}</div>
            {SHORTCUTS.map(([key, desc]) => (
              <div key={key} className={styles.shortcutRow}>
                <kbd className={styles.kbd}>{key}</kbd>
                <span className={styles.shortcutDesc}>{t(`titlebar.shortcuts.${desc}`)}</span>
              </div>
            ))}
          </div>,
          { autoClose: 8000 }
        );
        break;

      case "github":
        window.open("https://github.com/Elnur21", "_blank");
        break;

      case "about":
        toast.info(
          <TerminalToast lines={[
            { text: "Elnur Maharramov — Portfolio v2.5.0" },
            { text: "" },
            { text: t("titlebar.toasts.aboutRole"), type: "dim" },
            { text: t("titlebar.toasts.aboutBuilt"), type: "dim" },
            { text: t("titlebar.toasts.aboutDesign"), type: "dim" },
          ]} />,
          { autoClose: 6000 }
        );
        break;

      default:
        break;
    }
  };

  const handleMinimize = () => {
    // The page scrolls inside <main>, not the window
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
    toast.info(t("titlebar.toasts.scrolledTop"));
  };

  const handleMaximize = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  const handleClose = () => {
    toast.success(
      <TerminalToast lines={[
        { text: t("titlebar.toasts.thanks") },
        { text: "" },
        { text: t("titlebar.toasts.redirecting"), type: "dim" },
      ]} />,
      { autoClose: 2500, onClose: () => window.open("https://github.com/Elnur21", "_blank") }
    );
  };

  return (
    <section className={styles.titlebar} ref={ref}>
      <Image
        src="/vscode_icon.svg"
        alt="VSCode Icon"
        height={15}
        width={15}
        className={styles.icon}
      />
      <div className={styles.items}>
        {MENUS.map((menu) => (
          <div key={menu.label} className={styles.menuWrapper}>
            <p
              className={openMenu === menu.label ? styles.menuActive : ""}
              onClick={() =>
                setOpenMenu(openMenu === menu.label ? null : menu.label)
              }
            >
              {t(`titlebar.menus.${menu.label}`)}
            </p>
            {openMenu === menu.label && (
              <div className={styles.dropdown}>
                {menu.items.map((item, i) =>
                  item.type === "separator" ? (
                    <div key={i} className={styles.dropdownSeparator} />
                  ) : (
                    <div
                      key={i}
                      className={styles.dropdownItem}
                      onClick={() => handleAction(item)}
                    >
                      <span className={styles.dropdownLabel}>
                        {item.key ? t(`titlebar.items.${item.key}`) : item.label}
                      </span>
                      {item.shortcut && (
                        <span className={styles.dropdownShortcut}>
                          {item.shortcut}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className={styles.title}>{t("titlebar.title")}</p>
      <div className={styles.windowButtons}>
        <LanguageSwitcher />
        <button
          onClick={toggleChat}
          className={`${styles.chatToggle} ${mounted && chatOpen ? styles.chatToggleActive : ""}`}
          title={t("titlebar.toggleChat")}
          aria-label={t("titlebar.items.toggleChat")}
          aria-pressed={mounted && chatOpen}
        >
          <CommentIcon width={15} height={15} />
          <span className={styles.chatLabel}>{t("titlebar.chat")}</span>
        </button>
        <span onClick={handleMinimize} className={styles.minimize} title={t("titlebar.scrollTop")} />
        <span onClick={handleMaximize} className={styles.maximize} title={t("titlebar.fullscreen")} />
        <span onClick={handleClose} className={styles.close} title={t("titlebar.close")} />
      </div>
    </section>
  );
}
