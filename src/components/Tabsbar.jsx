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

      {/* <Tab icon="/html_icon.svg" filename="resume.html" path="/resume" />
      <Tab icon="/yml_icon.svg" filename="contact.yml" path="/contact" />
      <Tab icon="/js_icon.svg" filename="projects.js" path="/projects-js" />
      <Tab icon="/py_icon.svg" filename="projects.py" path="/projects-py" />
      <Tab icon="/json_icon.svg" filename="languages.json" path="/languages" />
      <Tab icon="/markdown_icon.svg" filename="github.md" path="/github" /> */}
    </div>
  );
};

export default Tabsbar;
