import styles from "../styles/ContactCode.module.css";

const contactItems = [
  {
    social: "Email",
    link: "elnur2370@gmail.com",
    href: "mailto:elnur2370@gmail.com",
  },
  {
    social: "LinkedIn",
    link: "Elnur Maharramov",
    href: "https://www.linkedin.com/in/elnur-meherremov/",
  },
  {
    social: "GitHub",
    link: "github.com/Elnur21",
    href: "https://github.com/Elnur21",
  },
  {
    social: "Website",
    link: "Portfolio",
    href: "https://elnur21-github-io.vercel.app/",
  },
];

const ContactCode = () => {
  return (
    <div className={styles.code}>
      <p className={styles.line}>
        tag: <a>production</a>
      </p>
      <p className={styles.line}>
        <span>elnur</span>&#58;
      </p>
      <p className={styles.line}>
        &nbsp;&nbsp;&nbsp;&#8212; <span>socials</span>&#58;
      </p>
      {contactItems.slice(0, 8).map((item, index) => (
        <p className={styles.line} key={index}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.social}:{" "}
          <a href={item.href} target="_blank" rel="noopener">
            {item.link}
          </a>
        </p>
      ))}
      {contactItems.slice(8, contactItems.length).map((item, index) => (
        <p className={styles.line} key={index}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.social}:{" "}
          <a href={item.href} target="_blank" rel="noopener">
            {item.link}
          </a>
        </p>
      ))}
    </div>
  );
};

export default ContactCode;
