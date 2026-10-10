import { useEffect, useState } from "react";

import Tab from "./Tab";
import styles from "../styles/Tabsbar.module.css";
import { useAppStore } from "@/libs/store";

const Tabsbar = () => {
  const tabs = useAppStore((state) => state.tabs);
  // Tabs are persisted in localStorage, so wait until mount to avoid an SSR hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className={styles.tabs}>
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
