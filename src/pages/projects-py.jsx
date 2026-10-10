import styles from "@/styles/ProjectsPage.module.css";
import ProjectCard from "@/components/ProjectCard";
import { useT } from "@/i18n";

import { getMLProjects, getPyBotsProjects } from "./api/projects";

const ProjectsPage = ({ ml_projects, bots_projects }) => {
  const t = useT();
  return (
    <>
      <h3>{t("projects.pyTitle")}</h3>
      <br />
      <center>
        <h4>{t("projects.ml")}</h4>
      </center>
      <hr />
      <div className={styles.container}>
        {ml_projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <br />
      <center>
        <h4>{t("projects.bots")}</h4>
      </center>
      <hr />
      <div className={styles.container}>
        {bots_projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
};

export async function getStaticProps({ locale }) {
  const ml_projects = getMLProjects(locale);
  const bots_projects = getPyBotsProjects(locale);

  return {
    props: { title: "Projects", ml_projects, bots_projects },
  };
}

export default ProjectsPage;
