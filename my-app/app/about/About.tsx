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
          I am currently finishing my Master&apos;s (MIND, previously called DAC) at Sorbonne Université, where I specialized in Deep Learning, Computer Vision, and Reinforcement Learning. Before that, I completed my Bachelor&apos;s degree in Computer Science at the University of Luxembourg in 2023.
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
