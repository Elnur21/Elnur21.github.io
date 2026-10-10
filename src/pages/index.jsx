import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/HomePage.module.css";
import { useT } from "@/i18n";


export default function HomePage() {
  const t = useT();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.foreground}>
          <div className={styles.content}>
            <h1 className={styles.name}>{t("meta.name")}</h1>
            <h6 className={styles.bio}>{t("home.role")}</h6>
            <div className={styles.cardContainer}>
              <div className={styles.card}>
                <div className={styles.content}>
                  <h4>{t("home.mainSkills")}</h4>
                  <div className={styles.tags}>
                    <span key="Research" className="Research">
                      HTML5/CSS3
                    </span>
                    <span key="Computer-Vision" className="Computer-Vision">
                      JavaScript/TypeScript
                    </span>
                    <span key="MIM" className="MIM">
                      ReactJS/NextJS
                    </span>
                    <span key="LLMs" className="LLMs">
                      NodeJS
                    </span>
                    <span key="GenAI" className="GenAI">
                      ExpressJS/NestJS
                    </span>
                    <span key="PyTorch" className="PyTorch">
                      VueJS/NuxtJS
                    </span>
                    <span key="Tensorflow" className="Tensorflow">
                      NoSQL - MongoDB
                    </span>
                    <span key="Apache-Spark" className="Apache-Spark">
                      Docker
                    </span>
                    <span key="SQL" className="SQL">
                      SQL - PostgreSQL/MySQL/MSSQL
                    </span>
                    <span key="MySQL" className="MySQL">
                      REST/GRAPHQL/SOCKET
                    </span>
                    <span key="Software-Design" className="Software-Design">
                      Python
                    </span>
                    <span key="Bots" className="Bots">
                      Pandas/Numpy/Tensorflow/PyTorch
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/resume">
              <button className={styles.button + " rounded"}>{t("home.resume")}</button>
            </Link>
            <Link href="/contact">
              <button className={styles.outlined + " rounded"}>{t("home.contact")}</button>
            </Link>
          </div>
          <div className={styles.right}>
            <div className={styles.picture_boader}>
              <Image
                className={styles.picture}
                src="/me.jpeg"
                width={300}
                height={300}
                alt={t("home.photo")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: { title: "Home" },
  };
}
