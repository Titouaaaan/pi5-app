import React from 'react';
import styles from './Welcome.module.css';
import { motion } from 'framer-motion';

const Welcome: React.FC = () => {
  return (
    <section id="welcome" className={styles.section}>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={styles.title}
      >
        Welcome to My Portfolio
      </motion.h1>
      <p className={styles.text}>
        Hi, I&apos;m Titouan Guérin, a passionate AI and Machine Learning enthusiast.
        I&apos;m currently pursuing my Master&apos;s in AI, ML, and Data Science at Sorbonne Université.
        Welcome to my digital space where I share my journey, projects, and experiences.
      </p>
      <p className={styles.text}>
        This website is a reflection of my passion for technology and innovation.
        Feel free to explore the different sections to learn more about me and my work.
      </p>
      <p className={styles.text}>
        I believe in the power of technology to drive positive change, and I am committed to using my skills to make a difference in the world.
      </p>
    </section>
  );
};

export default Welcome;
