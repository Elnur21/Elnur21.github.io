import Tab from "./Tab";
import styles from "../styles/Tabsbar.module.css";
import { useAppStore } from "@/libs/store";

const Tabsbar = () => {
  const { tabs } = useAppStore();
  return (
    <div className={styles.tabs}>
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          icon={tab?.icon}
          filename={tab?.fileName}
          path={tab?.path}
        />
      ))}
    </div>
  );
};

export default Tabsbar;
