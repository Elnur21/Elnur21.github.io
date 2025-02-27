import styles from "@/styles/ProjectsPage.module.css";
import ProjectCard from "@/components/ProjectCard";
import { getJSProjects } from "./api/projects";

const ProjectsPage = ({ js_projects }) => {
  return (
    <>
      <h3>JavaScript Projects</h3>
      <br />
      <center>
        <h4>FullStack projects</h4>
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

export async function getStaticProps() {
  const js_projects = getJSProjects();

  return {
    props: { title: "Projects", js_projects },
  };
}

export default ProjectsPage;
