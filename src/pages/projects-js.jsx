import styles from "@/styles/ProjectsPage.module.css";
import ProjectCard from "@/components/ProjectCard";
import { useT } from "@/i18n";

import { getJSProjects } from "./api/projects";

const ProjectsPage = ({ js_projects }) => {
  const t = useT();
  return (
    <>
      <h3>{t("projects.jsTitle")}</h3>
      <br />
      <center>
        <h4>{t("projects.fullstack")}</h4>
      </center>
      <hr />
      <div className={styles.container}>
        {js_projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {/* <br /> */}
      {/* <center>
        <h4>Bots</h4>
      </center>
      <hr />
      <div className={styles.container}>
        {bots_projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div> */}
    </>
  );
};

export async function getStaticProps({ locale }) {
  const js_projects = getJSProjects(locale);

  return {
    props: { title: "Projects", js_projects },
  };
}

export default ProjectsPage;
