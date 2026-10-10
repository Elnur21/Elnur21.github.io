import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
  const explorerOpen = useAppStore((state) => state.explorerOpen);
  const setExplorerOpen = useAppStore((state) => state.setExplorerOpen);
  const router = useRouter();
  // chatOpen comes from localStorage, so render the panel only after mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // The explorer drawer (phones) closes once a page is picked
  useEffect(() => setExplorerOpen(false), [router.asPath, setExplorerOpen]);

  useEffect(() => {
    if (!explorerOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setExplorerOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [explorerOpen, setExplorerOpen]);

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
        <Explorer open={explorerOpen} />
        {explorerOpen && (
          <div
            className={styles.backdrop}
            onClick={() => setExplorerOpen(false)}
            aria-hidden="true"
          />
        )}
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
