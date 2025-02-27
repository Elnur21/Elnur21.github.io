import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { useAppStore } from "@/libs/store";
import ChevronRight from "../components/icons/ChevronRight";
import styles from "../styles/Explorer.module.css";

const ExplorerItem = ({
  setActiveMenu,
  activeMenus,
  menuOpen,
  explorerItems,
  title,
}) => {
  const router = useRouter();
  const addTab = useAppStore((state) => state.addTab);
  return (
    <div>
      <input
        type="checkbox"
        className={styles.checkbox}
        id={`${title}-checkbox`}
        checked={menuOpen}
        onChange={() =>
          setActiveMenu(
            menuOpen ? activeMenus.replace(title, "") : activeMenus + title
          )
        }
      />
      <label htmlFor={`${title}-checkbox`} className={styles.heading}>
        <ChevronRight
          className={styles.chevron}
          style={menuOpen ? { transform: "rotate(90deg)" } : {}}
        />
        {title}
      </label>
      <div
        className={styles.files}
        style={menuOpen ? { display: "block" } : { display: "none" }}
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
                router?.pathname === item.path && styles.active
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
  );
};

export default ExplorerItem;
