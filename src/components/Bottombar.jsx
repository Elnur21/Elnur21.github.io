import Link from "next/link";
import ErrorIcon from "./icons/ErrorIcon";
import WarningIcon from "./icons/WarningIcon";
import BellIcon from "./icons/BellIcon";
import GithubIcon from "./icons/GithubIcon";
import LinkedinIcon from "./icons/LinkedinIcon";
import SourceControlIcon from "./icons/SourceControlIcon";
import styles from "../styles/Bottombar.module.css";
import packageJson from "../../package.json";

const Bottombar = () => {
  return (
    <footer className={styles.bottomBar}>
      <div className={styles.container}>
        <Link
          href="https://github.com/Elnur21/Elnur21.github.io"
          target="_blank"
          rel="noreferrer noopener"
          className={styles.section}
        >
          <SourceControlIcon className={styles.icon} />
          <p>main</p>
        </Link>
        <div className={styles.section}>
          <ErrorIcon className={styles.icon} />
          <p className={styles.errorText}>0</p>&nbsp;&nbsp;
          <WarningIcon className={styles.icon} />
          <p>0</p>
        </div>
      </div>
      <div className={styles.container}>V{packageJson.version}</div>
      <div className={styles.container}>
        <Link
          href="https://www.linkedin.com/in/elnur-meherremov/"
          target="_blank"
          rel="noopener"
        >
          <div className={styles.section}>
            <LinkedinIcon className={styles.icon} />
            <p>Linkedin</p>
          </div>
        </Link>
        <Link href="https://github.com/Elnur21" target="_blank" rel="noopener">
          <div className={styles.section}>
            <GithubIcon className={styles.icon} />
            <p>Github</p>
          </div>
        </Link>
        <div className={styles.section}>
          <BellIcon />
        </div>
      </div>
    </footer>
  );
};

export default Bottombar;
