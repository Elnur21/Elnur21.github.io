import { useState } from "react";
import styles from "../styles/Explorer.module.css";
import ExplorerItem from "./ExplorerItem";

const explorerItems = [
  {
    title: "General",
    items: [
      {
        name: "home.jsx",
        path: "/",
        icon: "react_icon.svg",
      },
      {
        name: "resume.html",
        path: "/resume",
        icon: "html_icon.svg",
      },
      {
        name: "contact.yml",
        path: "/contact",
        icon: "yml_icon.svg",
      },
      {
        name: "projects.js",
        path: "/projects-js",
        icon: "js_icon.svg",
      },
      {
        name: "projects.py",
        path: "/projects-py",
        icon: "py_icon.svg",
      },
    ],
  },
  {
    title: "Github",
    items: [
      {
        name: "languages.json",
        path: "/languages",
        icon: "json_icon.svg",
      },
      {
        name: "github.md",
        path: "/github",
        icon: "markdown_icon.svg",
      },
    ],
  },
];

const Explorer = () => {
  const [activeMenus, setActiveMenu] = useState("General");

  return (
    <div className={styles.explorer}>
      <p className={styles.title}>Explorer</p>
      {explorerItems.map((item) => (
        <ExplorerItem
          explorerItems={item.items}
          menuOpen={activeMenus.includes(item.title)}
          activeMenus={activeMenus}
          setActiveMenu={setActiveMenu}
          title={item.title}
        />
      ))}
    </div>
  );
};

export default Explorer;
