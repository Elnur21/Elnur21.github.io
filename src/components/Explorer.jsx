import { useState } from "react";
import styles from "../styles/Explorer.module.css";
import ExplorerItem from "./ExplorerItem";
import { explorerItems } from "@/libs/constants";
import { useT } from "@/i18n";

const Explorer = () => {
  const t = useT();
  const [activeMenus, setActiveMenu] = useState("General");

  return (
    <div className={styles.explorer}>
      <p className={styles.title}>{t("explorer.title")}</p>
      {explorerItems.map((item, index) => (
        <ExplorerItem
          key={index}
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
