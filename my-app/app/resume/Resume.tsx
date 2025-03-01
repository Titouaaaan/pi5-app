import React from 'react';
import styles from './Resume.module.css';

const Resume: React.FC = () => {
  return (
    <section id="resume" className={styles.section}>
      <h2 className={styles.title}>Resume</h2>
      <p className={styles.text}>
        You can download my resume <a href="/Titouan_Guerin_Resume_3.0.pdf" className={styles.link}>here</a>.
      </p>
      <div className={styles.subsection}>
        <h3 className={styles.subtitle}>Education</h3>
        <p className={styles.text}>
          Master&apos;s in AI, ML, and Data Science - Sorbonne Université (2023 - Present)
        </p>
        <p className={styles.text}>
          Bachelor&apos;s in Computer Science - University of Luxembourg (2020 - 2023)
        </p>
      </div>
      <div className={styles.subsection}>
        <h3 className={styles.subtitle}>Experience</h3>
        <p className={styles.text}>
          Research Assistant - University of Luxembourg (Jul 2024)
        </p>
        <p className={styles.text}>
          Private Math Teacher - Acadomia (Jan 2025 - Current)
        </p>
        <p className={styles.text}>
          Information Security Intern - Grant Thornton Luxembourg (Feb 2023 - Jun 2023)
        </p>
      </div>
      <div className={styles.subsection}>
        <h3 className={styles.subtitle}>Skills</h3>
        <p className={styles.text}>
          Python, Machine Learning, Data Analysis, React, Node.js, AI
        </p>
      </div>
    </section>
  );
};

export default Resume;
