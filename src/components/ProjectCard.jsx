import Image from "next/image";
import styles from "../styles/ProjectCard.module.css";
import GithubIcon from "./icons/GithubIcon";
import LinkIcon from "./icons/LinkIcon";
import FilesIcon from "./icons/FilesIcon";
import CodeIcon from "./icons/CodeIcon";
import { useT } from "@/i18n";

const ProjectCard = ({ project }) => {
  const t = useT();
  const lowResImageUrl = project.image.replace(/(\.[a-z]+)$/, "m$1");

  const links = [
    { href: project.source_code, label: t("projects.code"), Icon: GithubIcon },
    { href: project.demo, label: t("projects.demo"), Icon: LinkIcon },
    { href: project.scholar, label: t("projects.paper"), Icon: FilesIcon },
    { href: project.pypi, label: "PyPi", Icon: CodeIcon },
  ].filter((link) => link.href);

  return (
    <article className={styles.card}>
      {/* A blurred copy of the image fills the frame behind images of any shape */}
      <div
        className={styles.media}
        style={{ "--image": `url("${project.image}")` }}
      >
        <Image
          src={project.image}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={lowResImageUrl}
          alt={project.name}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{project.name}</h3>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={tag}>
              {tag}
            </span>
          ))}
        </div>
        {links.length > 0 && (
          <div className={styles.cta}>
            {links.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <Icon width={15} height={15} className={styles.linkIcon} />
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
