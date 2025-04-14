import React from 'react';
import styles from './About.module.css';
import Image from 'next/image';

const About: React.FC = () => {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.left}>
        <Image
          src="/ProfilePictures/profilepic.jpeg"
          alt="Titouan Guerin"
          className={styles.profilePic}
          width={200}
          height={200}
        />
        <a href="/TG_CV_2025.pdf" download>
          <button className={styles.downloadButton}>Download CV</button>
        </a>
      </div>
      <div className={styles.right}>
        <h2 className={styles.title}>AI/ML Student at Sorbonne, in Paris</h2>
        <p className={styles.text}>
          I graduated from the University of Luxembourg with a Bachelor&apos;s degree in Computer Science in 2023, and I am currently close to finishing my Master&apos;s at Sorbonne Universite.
        </p>
        <p className={styles.text}>
        I am passionate about the mathematics behind AI and Machine Learning, and I have recently been particularly interested in reinforcement learning. 
        My experience spans research, software development, (and a bit of tutoring), and I would love to further explore these fields through a PhD. 
        </p>
      </div>
    </section>
  );
};

export default About;
