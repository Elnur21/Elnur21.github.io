import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Tab.module.css";
import { useAppStore } from "@/libs/store";

const Tab = ({ icon, filename, path }) => {
  const router = useRouter();
  const removeTab = useAppStore((state) => state.removeTab);
  const { tabs } = useAppStore();

  return (
    <Link href={path}>
      <div
        className={`${styles.tab} ${router.pathname === path && styles.active}`}
      >
        <Image src={icon} alt={filename} height={18} width={18} />
        <p>
          {filename}{" "}
          <span
            onClick={() => {
              // router.back();
              removeTab(path);
              if (path == router.pathname && tabs?.length > 1) {
                router.back();
              } else {
                router.push(
                  tabs?.find((tab) => tab?.path !== router.pathname)?.path ||
                    "/"
                );
              }
            }}
          >
            x
          </span>
        </p>
      </div>
    </Link>
  );
};

export default Tab;
