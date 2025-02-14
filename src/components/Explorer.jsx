import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ChevronRight from "../components/icons/ChevronRight";
import styles from "../styles/Explorer.module.css";
import { useAppStore } from "@/libs/store";
import { useRouter } from "next/router";

const explorerItems = [
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
];

const Explorer = () => {
  const [portfolioOpen, setPortfolioOpen] = useState(true);
  const router = useRouter();
  const addTab = useAppStore((state) => state.addTab);

  return (
    <div className={styles.explorer}>
      <p className={styles.title}>Explorer</p>
      <div>
        <input
          type="checkbox"
          className={styles.checkbox}
          id="portfolio-checkbox"
          checked={portfolioOpen}
          onChange={() => setPortfolioOpen(!portfolioOpen)}
        />
        <label htmlFor="portfolio-checkbox" className={styles.heading}>
          <ChevronRight
            className={styles.chevron}
            style={portfolioOpen ? { transform: "rotate(90deg)" } : {}}
          />
          Portfolio
        </label>
        <div
          className={styles.files}
          style={portfolioOpen ? { display: "block" } : { display: "none" }}
        >
          {explorerItems.map((item) => (
            <Link
              onClick={() =>
                addTab({
                  fileName: item.name,
                  icon: `/${item?.icon}`,
                  path: item.path,
                })
              }
              href={item.path}
              key={item.name}
            >
              <div
                className={`${styles.file}  ${
                  router.pathname === item.path && styles.active
                }`}
              >
                <Image
                  src={`/${item.icon}`}
                  alt={item.name}
                  height={18}
                  width={18}
                />{" "}
                <p>{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
