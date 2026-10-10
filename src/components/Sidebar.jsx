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
import HeartIcon from "./icons/HeartIcon";
import WatchIcon from "./icons/WatchIcon";
// import HtmlIcon from "../../public/HTML5_logo_and_wordmark.svg.png";
import { useAppStore } from "@/libs/store";
import { useT } from "@/i18n";
// import Image from "next/image";

const sidebarTopItems = [
  {
    Icon: FilesIcon,
    path: "/",
    label: "Home",
    iconPath: "/react_icon.svg",
    fileName: "home.jsx",
  },
  {
    Icon: GithubIcon,
    path: "/github",
    label: "GitHub",
    iconPath: "/markdown_icon.svg",
    fileName: "github.md",
  },
  {
    Icon: CodeIcon,
    path: "/projects-py",
    label: "Projects",
    iconPath: "/py_icon.svg",
    fileName: "projects.py",
  },
  {
    Icon: ComputerIcon,
    path: "/projects-js",
    label: "Projects",
    iconPath: "/js_icon.svg",
    fileName: "projects.js",
  },
  {
    Icon: PencilIcon,
    path: "/languages",
    label: "Languages",
    iconPath: "/json_icon.svg",
    fileName: "languages.json",
  },
  {
    Icon: MailIcon,
    path: "/contact",
    label: "Contact",
    iconPath: "/yml_icon.svg",
    fileName: "contact.yml",
  },
  {
    Icon: HeartIcon,
    path: "/hobbies",
    label: "Hobbies",
    iconPath: "/react_icon.svg",
    fileName: "hobbies.jsx",
  },
  {
    Icon: WatchIcon,
    path: "/experience",
    label: "Experience",
    iconPath: "/json_icon.svg",
    fileName: "experience.json",
  },
];

const sidebarBottomItems = [
  {
    Icon: AccountIcon,
    path: "/resume",
    label: "Resume",
    iconPath: "/html_icon.svg",
    fileName: "resume.html",
  },
  {
    Icon: SettingsIcon,
    path: "/settings",
    label: "Settings",
    iconPath: "/vscode_icon.svg",
    fileName: "settings",
  },
];

const Sidebar = () => {
  const router = useRouter();
  const addTab = useAppStore((state) => state.addTab);
  const t = useT();
  const linkLabel = (label, fileName) => `${t(`titles.${label}`)} (${fileName})`;

  return (
    <nav className={styles.sidebar} aria-label={t("explorer.title")}>
      <div className={styles.sidebarTop}>
        {sidebarTopItems.map(({ Icon, path, label, iconPath, fileName }) => (
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
            aria-label={linkLabel(label, fileName)}
            title={linkLabel(label, fileName)}
            aria-current={router?.pathname === path ? "page" : undefined}
          >
            <div
              className={`${styles.iconContainer} ${
                router?.pathname === path && styles.active
              }`}
            >
              <Icon
                fill={
                  router?.pathname === path
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
        {sidebarBottomItems.map(({ Icon, path, label, iconPath, fileName }) => (
          <div
            key={path}
            className={`${styles.iconContainer} ${
              router?.pathname === path && styles.active
            }`}
          >
            <Link
              onClick={() =>
                addTab({
                  icon: iconPath,
                  fileName,
                  path,
                })
              }
              href={path}
              aria-label={linkLabel(label, fileName)}
              title={linkLabel(label, fileName)}
              aria-current={router?.pathname === path ? "page" : undefined}
            >
              <Icon
                fill={
                  router?.pathname === path
                    ? "rgb(225, 228, 232)"
                    : "rgb(106, 115, 125)"
                }
                className={styles.icon}
              />
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
