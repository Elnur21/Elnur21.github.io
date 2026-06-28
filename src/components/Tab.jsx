import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

import styles from "../styles/Tab.module.css";
import { useAppStore } from "@/libs/store";

const Tab = ({ icon, filename, path }) => {
  const [remove, setRemove] = useState(false);
  const router = useRouter();
  const removeTab = useAppStore((state) => state.removeTab);
  const { tabs } = useAppStore();

  return (
    <div onClick={() => (!remove ? router.push(path) : null)}>
      <div
        className={`${styles.tab} ${
          router?.pathname === path && styles.active
        }`}
      >
        <Image src={icon} alt={filename} height={18} width={18} />
        <p>{filename}</p>
        <span
          className={styles.close}
          onClick={(e) => {
            e.stopPropagation();
            setRemove(true);
            removeTab(path);
            if (path == router?.pathname && tabs?.length > 2) {
              router.back();
            } else {
              router.push(
                tabs?.find((tab) => tab?.path !== router?.pathname)?.path || "/"
              );
            }
          }}
        >
          x
        </span>
      </div>
    </div>
  );
};

export default Tab;
