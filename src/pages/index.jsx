import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/HomePage.module.css";

export default function HomePage() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.foreground}>
          <div className={styles.content}>
            <h1 className={styles.name}>Elnur Maharramov</h1>
            <h6 className={styles.bio}>Full stack developer</h6>
            <div className={styles.cardContainer}>
              <div className={styles.card}>
                <div className={styles.content}>
                  <h4>Main Skills</h4>
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
              <button className={styles.button + " rounded"}>Resume</button>
            </Link>
            <Link href="/contact">
              <button className={styles.outlined + " rounded"}>Contact</button>
            </Link>
          </div>
          <div className={styles.right}>
            <div className={styles.picture_boader}>
              <Image
                className={styles.picture}
                src="/me.jpeg"
                width={300}
                height={300}
                alt="picture"
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
