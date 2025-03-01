import React from 'react';
import styles from './Projects.module.css';

const Projects: React.FC = () => {
  return (
    <section id="projects" className={styles.section}>
      <h2 className={styles.title}>Projects</h2>
      <p className={styles.text}>
        I've been working on enhancing language learning through multi-agent systems and AI.
        My recent project involved developing a backend for a Luxembourgish language learning system,
        which was showcased at the PRIMA conference in Kyoto, Japan.
      </p>
      <div className={styles.project}>
        <h3 className={styles.subtitle}>Multi-Agent Language Learning System</h3>
        <p className={styles.text}>
          This project focused on creating an interactive language learning platform using AI agents.
          Each agent was designed to handle different aspects of language learning, such as reading, listening, and conversation.
          The system was built to provide a comprehensive learning experience for users.
        </p>
      </div>
      <div className={styles.project}>
        <h3 className={styles.subtitle}>AI-Driven Data Analysis</h3>
        <p className={styles.text}>
          In this project, I developed AI models to analyze large datasets and extract meaningful insights.
          The goal was to provide actionable intelligence to businesses and organizations, helping them make data-driven decisions.
        </p>
      </div>
      <div className={styles.project}>
        <h3 className={styles.subtitle}>Natural Language Processing</h3>
        <p className={styles.text}>
          I worked on several NLP projects, including sentiment analysis, text classification, and language translation.
          These projects aimed to improve the understanding and processing of human language by machines.
        </p>
      </div>
    </section>
  );
};

export default Projects;
