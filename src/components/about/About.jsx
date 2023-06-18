import React from "react";
import "./about.css";
import { FaUniversity } from "react-icons/fa";
import { VscFolderLibrary } from "react-icons/vsc";

const About = () => {
  return (
    <section id="about">
      <h5>Get To Know</h5>
      <h2>About Me</h2>

      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src="" alt="Elnur Maharramov" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">
            <article className="about__card">
              <FaUniversity className="about__icon" />
              <h5>Education</h5>
              <small>5+ Years</small>
            </article>
            <article className="about__card">
              <VscFolderLibrary className="about__icon" />
              <h5>Projects</h5>
              <small>5+ Completed</small>
            </article>
          </div>

          <p>
            Currently, Azerbaijan French University & Straousburg University
            Master's degree student in Data Science & AI who previously studied
            at Azerbaijan State Oil and Industry University in profession named Information Technology
            and Control. Aspiring to be Fullstack developer. I am eager to learn
            and can adapt to different environments.
          </p>

          <a href="#contact" className="btn btn-primary">
            Let's Talk
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
