import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/Titlebar.module.css";
import { useAppStore } from "@/libs/store";
import { toast } from "react-toastify";

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
};

const SHORTCUTS = [
  ["Ctrl + `", "New Terminal"],
  ["Ctrl + W", "Close Tab"],
  ["Ctrl + Shift + P", "Command Palette"],
  ["Ctrl + /", "Toggle Comment"],
  ["Alt + ↑ / ↓", "Move Line"],
  ["Ctrl + L", "Copy Page URL"],
  ["Ctrl + F", "Find in Page"],
  ["F11", "Toggle Fullscreen"],
];

const MENUS = [
  {
    label: "File",
    items: [
      { label: "Open Home", shortcut: "Ctrl+H", action: "navigate", path: "/" },
      { label: "Download Resume", shortcut: "Ctrl+S", action: "downloadResume" },
      { type: "separator" },
      { label: "Close Tab", shortcut: "Ctrl+W", action: "closeTab" },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Copy Page URL", shortcut: "Ctrl+L", action: "copyUrl" },
      { label: "Find in Page", shortcut: "Ctrl+F", action: "findInPage" },
      { type: "separator" },
      { label: "Toggle Fullscreen", shortcut: "F11", action: "toggleFullscreen" },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Zoom In", shortcut: "Ctrl++", action: "zoomIn" },
      { label: "Zoom Out", shortcut: "Ctrl+-", action: "zoomOut" },
      { label: "Reset Zoom", shortcut: "Ctrl+0", action: "resetZoom" },
      { type: "separator" },
      { label: "Toggle Fullscreen", shortcut: "F11", action: "toggleFullscreen" },
    ],
  },
  {
    label: "Go",
    items: [
      { label: "Back", shortcut: "Alt+←", action: "goBack" },
      { label: "Forward", shortcut: "Alt+→", action: "goForward" },
      { type: "separator" },
      { label: "~/home.jsx", shortcut: "", action: "navigate", path: "/" },
      { label: "~/resume.html", shortcut: "", action: "navigate", path: "/resume" },
      { label: "~/experience.json", shortcut: "", action: "navigate", path: "/experience" },
      { label: "~/projects.js", shortcut: "", action: "navigate", path: "/projects-js" },
      { label: "~/projects.py", shortcut: "", action: "navigate", path: "/projects-py" },
      { label: "~/hobbies.jsx", shortcut: "", action: "navigate", path: "/hobbies" },
      { label: "~/languages.json", shortcut: "", action: "navigate", path: "/languages" },
      { label: "~/contact.yml", shortcut: "", action: "navigate", path: "/contact" },
    ],
  },
  {
    label: "Run",
    items: [
      { label: "▶  Start Dev Server", shortcut: "F5", action: "runDev" },
      { label: "⚙  Build Project", shortcut: "Ctrl+F5", action: "runBuild" },
      { type: "separator" },
      { label: "■  Stop", shortcut: "Shift+F5", action: "runStop" },
    ],
  },
  {
    label: "Terminal",
    items: [
      { label: "New Terminal", shortcut: "Ctrl+`", action: "newTerminal" },
      { label: "Run npm install", shortcut: "", action: "npmInstall" },
      { label: "Run npm run dev", shortcut: "", action: "npmDev" },
      { type: "separator" },
      { label: "Kill Terminal", shortcut: "", action: "killTerminal" },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "Welcome", shortcut: "", action: "welcome" },
      { label: "Keyboard Shortcuts", shortcut: "Ctrl+K S", action: "shortcuts" },
      { type: "separator" },
      { label: "View on GitHub", shortcut: "", action: "github" },
      { label: "Contact Me", shortcut: "", action: "navigate", path: "/contact" },
      { type: "separator" },
      { label: "About", shortcut: "", action: "about" },
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
        toast.success("📄 Downloading resume...");
        break;

      case "closeTab": {
        const path = router.pathname;
        if (path === "/") { toast.info("Cannot close the last tab."); return; }
        removeTab(path);
        const remaining = tabs.filter((t) => t.path !== path);
        router.push(remaining.length ? remaining[remaining.length - 1].path : "/");
        toast.info("Tab closed.");
        break;
      }

      case "copyUrl":
        navigator.clipboard.writeText(window.location.href).then(() =>
          toast.success("🔗 URL copied to clipboard!")
        );
        break;

      case "findInPage":
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "f", ctrlKey: true, bubbles: true }));
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "f", ctrlKey: true, bubbles: true }));
        toast.info("🔍 Use Ctrl+F to search in this page.");
        break;

      case "toggleFullscreen":
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          toast.info("⛶ Entered fullscreen. Press F11 or Esc to exit.");
        } else {
          document.exitFullscreen();
          toast.info("Exited fullscreen.");
        }
        break;

      case "zoomIn": {
        const next = Math.min(zoom + 10, 150);
        setZoom(next);
        document.body.style.zoom = `${next}%`;
        toast.info(`🔍 Zoom: ${next}%`);
        break;
      }

      case "zoomOut": {
        const next = Math.max(zoom - 10, 70);
        setZoom(next);
        document.body.style.zoom = `${next}%`;
        toast.info(`🔎 Zoom: ${next}%`);
        break;
      }

      case "resetZoom":
        setZoom(100);
        document.body.style.zoom = "100%";
        toast.info("↺ Zoom reset to 100%");
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
            { text: "Process terminated.", type: "dim" },
          ]} />,
          { autoClose: 3000 }
        );
        break;

      case "newTerminal":
        toast.info(
          <TerminalToast lines={[
            { text: "elnur@portfolio:~$", type: "success" },
            { text: "" },
            { text: 'Type "help" for available commands.', type: "dim" },
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
            { text: "^C  Process killed.", type: "error" },
          ]} />,
          { autoClose: 3000 }
        );
        break;

      case "welcome":
        toast.info(
          <TerminalToast lines={[
            { text: "👋 Welcome to Elnur's Portfolio!" },
            { text: "" },
            { text: "Built with Next.js + VS Code theme.", type: "dim" },
            { text: "Navigate using the sidebar or explorer.", type: "dim" },
          ]} />,
          { autoClose: 5000 }
        );
        break;

      case "shortcuts":
        toast.info(
          <div className={styles.shortcutsToast}>
            <div className={styles.shortcutsTitle}>Keyboard Shortcuts</div>
            {SHORTCUTS.map(([key, desc]) => (
              <div key={key} className={styles.shortcutRow}>
                <kbd className={styles.kbd}>{key}</kbd>
                <span className={styles.shortcutDesc}>{desc}</span>
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
            { text: "Fullstack Developer @ AgileSolutions", type: "dim" },
            { text: "Built with Next.js, React, Zustand", type: "dim" },
            { text: "Designed as a VS Code experience", type: "dim" },
          ]} />,
          { autoClose: 6000 }
        );
        break;

      default:
        break;
    }
  };

  const handleMinimize = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("↑ Scrolled to top.");
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
        { text: "👋 Thanks for visiting!" },
        { text: "" },
        { text: "Redirecting to GitHub...", type: "dim" },
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
              {menu.label}
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
                      <span className={styles.dropdownLabel}>{item.label}</span>
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
      <p className={styles.title}>Elnur Maharramov - Portfolio</p>
      <div className={styles.windowButtons}>
        <span onClick={handleMinimize} className={styles.minimize} title="Scroll to top" />
        <span onClick={handleMaximize} className={styles.maximize} title="Toggle Fullscreen" />
        <span onClick={handleClose} className={styles.close} title="Close" />
      </div>
    </section>
  );
}
