import Link from "next/link";
import { useRouter } from "next/router";
import FilesIcon from "./icons/FilesIcon";
import GithubIcon from "./icons/GithubIcon";
import CodeIcon from "./icons/CodeIcon";
import PencilIcon from "./icons/PencilIcon";
import MailIcon from "./icons/MailIcon";
import AccountIcon from "./icons/AccountIcon";
import SettingsIcon from "./icons/SettingsIcon";
import styles from "../styles/Sidebar.module.css";
import ComputerIcon from "./icons/ComputerIcon";
import HtmlIcon from "../../public/HTML5_logo_and_wordmark.svg.png";
import { useAppStore } from "@/libs/store";
import Image from "next/image";

const sidebarTopItems = [
  {
    Icon: FilesIcon,
    path: "/",
    iconPath: "/react_icon.svg",
    fileName: "home.jsx",
  },
  {
    Icon: GithubIcon,
    path: "/github",
    iconPath: "/markdown_icon.svg",
    fileName: "github.md",
  },
  {
    Icon: CodeIcon,
    path: "/projects-py",
    iconPath: "/py_icon.svg",
    fileName: "projects.py",
  },
  {
    Icon: ComputerIcon,
    path: "/projects-js",
    iconPath: "/js_icon.svg",
    fileName: "projects.js",
  },
  {
    Icon: PencilIcon,
    path: "/languages",
    iconPath: "/json_icon.svg",
    fileName: "languages.json",
  },
  {
    Icon: MailIcon,
    path: "/contact",
    iconPath: "/yml_icon.svg",
    fileName: "contact.yml",
  },
];

const sidebarBottomItems = [
  {
    Icon: AccountIcon,
    path: "/resume",
    iconPath: "/html_icon.svg",
    fileName: "resume.html",
  },
  {
    Icon: SettingsIcon,
    path: "/settings",
    iconPath: "/vscode_icon.svg",
    fileName: "settings",
  },
];

const Sidebar = () => {
  const router = useRouter();
  const addTab = useAppStore((state) => state.addTab);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        {sidebarTopItems.map(({ Icon, path, iconPath, fileName }) => (
          <Link
            onClick={() =>
              addTab({
                icon: iconPath,
                fileName,
                path,
              })
            }
            href={path}
            key={path}
          >
            <div
              className={`${styles.iconContainer} ${
                router.pathname === path && styles.active
              }`}
            >
              <Icon
                fill={
                  router.pathname === path
                    ? "rgb(225, 228, 232)"
                    : "rgb(106, 115, 125)"
                }
                className={styles.icon}
              />
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.sidebarBottom}>
        {sidebarBottomItems.map(({ Icon, path, iconPath, fileName }) => (
          <div className={styles.iconContainer}>
            <Link
              onClick={() =>
                addTab({
                  icon: iconPath,
                  fileName,
                  path,
                })
              }
              href={path}
              key={path}
            >
              <Icon
                fill={
                  router.pathname === path
                    ? "rgb(225, 228, 232)"
                    : "rgb(106, 115, 125)"
                }
                className={styles.icon}
              />
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
