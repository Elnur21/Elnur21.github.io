import Image from "next/image";
import styles from "../styles/Titlebar.module.css";
import { toast } from "react-toastify";

const Titlebar = () => {
  const comingSoon = () => toast("Coming soon...");
  return (
    <section className={styles.titlebar}>
      <Image
        src="/vscode_icon.svg"
        alt="VSCode Icon"
        height={15}
        width={15}
        className={styles.icon}
      />
      <div className={styles.items}>
        <p onClick={comingSoon}>File</p>
        <p onClick={comingSoon}>Edit</p>
        <p onClick={comingSoon}>View</p>
        <p onClick={comingSoon}>Go</p>
        <p onClick={comingSoon}>Run</p>
        <p onClick={comingSoon}>Terminal</p>
        <p onClick={comingSoon}>Help</p>
      </div>
      <p className={styles.title}>Elnur Maharramov - Portfolio</p>
      <div className={styles.windowButtons}>
        <span onClick={comingSoon} className={styles.minimize}></span>
        <span onClick={comingSoon} className={styles.maximize}></span>
        <span onClick={comingSoon} className={styles.close}></span>
      </div>
    </section>
  );
};

export default Titlebar;
