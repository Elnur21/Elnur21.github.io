import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import styles from "../styles/LanguageSwitcher.module.css";
import { LANGUAGES, useT } from "@/i18n";

const GlobeIcon = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M1.5 8h13M8 1.5c2 2 2.8 4.2 2.8 6.5S10 12.5 8 14.5M8 1.5C6 3.5 5.2 5.7 5.2 8s.8 4.5 2.8 6.5" />
  </svg>
);

const LanguageSwitcher = () => {
  const router = useRouter();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === router.locale) || LANGUAGES[0];

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (code) => {
    setOpen(false);
    if (code === router.locale) return;
    // Next.js reads this cookie to open the site in the chosen language next time
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`;
    const { pathname, query, asPath } = router;
    router.push({ pathname, query }, asPath, { locale: code, scroll: false });
  };

  return (
    <div className={styles.switcher} ref={ref}>
      <button
        className={styles.button}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={t("common.language")}
      >
        <GlobeIcon />
        {current.short}
        <span className={styles.caret}>▾</span>
      </button>
      {open && (
        <ul className={styles.menu} role="listbox" aria-label={t("common.language")}>
          {LANGUAGES.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === current.code}
              className={`${styles.option} ${lang.code === current.code ? styles.active : ""}`}
              onClick={() => choose(lang.code)}
            >
              <span className={styles.code}>{lang.short}</span>
              {lang.name}
              {lang.code === current.code && <span className={styles.check}>✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
