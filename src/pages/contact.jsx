import { useState } from "react";
import styles from "@/styles/ContactPage.module.css";
import ContactCode from "@/components/ContactCode";
import { useT } from "@/i18n";


const ContactPage = () => {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (res.ok) {
      alert(t("contact.success"));
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } else {
      alert(t("contact.error"));
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.heading}>{t("contact.findMe")}</h3>
        <ContactCode />
      </div>
      <div>
        <h3 className={styles.heading}>{t("contact.orFill")}</h3>
        <form className={styles.form} onSubmit={submitForm}>
          <div className={styles.flex}>
            <div style={{ width: "100%" }}>
              <label htmlFor="name">{t("contact.name")}</label>
              <input
                className="rounded"
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div style={{ width: "100%" }}>
              <label htmlFor="email">{t("contact.email")}</label>
              <input
                className="rounded"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject">{t("contact.subject")}</label>
            <input
              className="rounded"
              type="text"
              name="subject"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="message">{t("contact.message")}</label>
            <textarea
              className="rounded"
              name="message"
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button className="rounded" style={{ width: "100%" }} type="submit">
            {t("contact.submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: "Contact" },
  };
}

export default ContactPage;
