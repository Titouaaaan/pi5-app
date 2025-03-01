import React from 'react';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <section id="about" className={styles.section}>
      <h2 className={styles.title}>About Me</h2>
      <p className={styles.text}>
        I am a passionate AI and Machine Learning enthusiast currently pursuing my Master's in AI, ML, and Data Science at Sorbonne Université.
        I hold a Bachelor's degree in Computer Science from the University of Luxembourg.
      </p>
      <p className={styles.text}>
        My journey in the tech world has been filled with exciting projects and learning opportunities.
        I am particularly interested in the intersection of AI and natural language processing,
        and how these technologies can be used to solve real-world problems.
      </p>
      <p className={styles.text}>
        Outside of my academic pursuits, I enjoy playing music, specifically the guitar and electric bass.
        I also love staying active through sports and exploring new hobbies.
      </p>
      <p className={styles.text}>
        I believe in the power of technology to drive positive change, and I am committed to using my skills to make a difference in the world.
      </p>
    </section>
  );
};

export default About;
