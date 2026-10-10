import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import Tab from "./Tab";
import styles from "../styles/Tabsbar.module.css";
import { useAppStore } from "@/libs/store";

const Tabsbar = () => {
  const tabs = useAppStore((state) => state.tabs);
  const router = useRouter();
  const barRef = useRef(null);
  // Tabs are persisted in localStorage, so wait until mount to avoid an SSR hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Keep the active tab visible when it is off-screen in a long row of tabs
  useEffect(() => {
    const active = barRef.current?.querySelector(
      `[data-path="${router.pathname}"]`
    );
    active?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [router.pathname, tabs.length, mounted]);

  // Let a vertical mouse wheel scroll the tabs sideways, like VS Code.
  // Attached manually because React's onWheel is passive and can't preventDefault.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const onWheel = (e) => {
      if (bar.scrollWidth <= bar.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      bar.scrollLeft += e.deltaY;
    };
    bar.addEventListener("wheel", onWheel, { passive: false });
    return () => bar.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className={styles.tabs} ref={barRef}>
      {mounted &&
        tabs.map((tab) => (
          <Tab
            key={tab?.path}
            icon={tab?.icon}
            filename={tab?.fileName}
            path={tab?.path}
          />
        ))}
    </div>
  );
};

export default Tabsbar;
