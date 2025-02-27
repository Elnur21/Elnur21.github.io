import styles from "@/styles/ProjectsPage.module.css";
import ProjectCard from "@/components/ProjectCard";
import { getMLProjects, getPyBotsProjects } from "./api/projects";

const ProjectsPage = ({ ml_projects, bots_projects }) => {
  return (
    <>
      <h3>Python Projects</h3>
      <br />
      <center>
        <h4>Machine Learning</h4>
      </center>
      <hr />
      <div className={styles.container}>
        {ml_projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <br />
      <center>
        <h4>Bots</h4>
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

export async function getStaticProps() {
  const ml_projects = getMLProjects();
  const bots_projects = getPyBotsProjects();

  return {
    props: { title: "Projects", ml_projects, bots_projects },
  };
}

export default ProjectsPage;
