import { useEffect, useState } from "react";

import Titlebar from "../components/Titlebar";
import Sidebar from "./Sidebar";
import Explorer from "../components/Explorer";
import Bottombar from "../components/Bottombar";
import Tabsbar from "./Tabsbar";
import ChatPanel from "./ChatPanel";
import styles from "../styles/Layout.module.css";
import { useAppStore } from "@/libs/store";

const Layout = ({ children }) => {
  const chatOpen = useAppStore((state) => state.chatOpen);
  const toggleChat = useAppStore((state) => state.toggleChat);
  // chatOpen comes from localStorage, so render the panel only after mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Ctrl+Alt+I toggles the chat, like in VS Code
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        toggleChat();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleChat]);

  return (
    <div className={styles.shell}>
      <Titlebar />
      <div className={styles.main}>
        <Sidebar />
        <Explorer />
        <div className={styles.editor}>
          <Tabsbar />
          <main className={styles.content}>{children}</main>
        </div>
        {mounted && chatOpen && <ChatPanel />}
      </div>
      <Bottombar />
    </div>
  );
};

export default Layout;
