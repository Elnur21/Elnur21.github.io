import Image from "next/image";
import { useRouter } from "next/router";

import styles from "../styles/Tab.module.css";
import { useAppStore } from "@/libs/store";

const Tab = ({ icon, filename, path }) => {
  const router = useRouter();
  const tabs = useAppStore((state) => state.tabs);
  const removeTab = useAppStore((state) => state.removeTab);
  const isActive = router?.pathname === path;

  const closeTab = (e) => {
    e.stopPropagation();
    const index = tabs.findIndex((tab) => tab?.path === path);
    removeTab(path);

    // Closing an inactive tab shouldn't change the current page
    if (!isActive) return;

    // Like VS Code: focus the tab to the right, otherwise the one to the left
    const remaining = tabs.filter((tab) => tab?.path !== path);
    const next = remaining[index] || remaining[index - 1];
    router.push(next?.path || "/");
  };

  return (
    <div
      className={`${styles.tab} ${isActive ? styles.active : ""}`}
      onClick={() => !isActive && router.push(path)}
      onMouseDown={(e) => {
        // Middle-click closes the tab
        if (e.button !== 1) return;
        e.preventDefault();
        closeTab(e);
      }}
      title={filename}
    >
      <Image src={icon} alt={filename} height={18} width={18} />
      <p>{filename}</p>
      <span className={styles.close} onClick={closeTab} aria-label="Close tab">
        x
      </span>
    </div>
  );
};

export default Tab;
