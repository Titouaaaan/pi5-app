import React from 'react';
import styles from './Welcome.module.css';
import Image from 'next/image';

const Welcome: React.FC = () => {
  return (
    <section id="welcome" className={styles.section}>
      <div className={styles.overlay}>
        <Image
          src="/ProfilePictures/casualpic.png"
          alt="Titouan Guerin"
          className={styles.profilePic}
          width={400} 
          height={400} 
        />
        <h1 className={styles.name}>Titouan Guerin</h1>
        <h2 className={styles.title}>M2 student in ML, AI & Data Science @ Sorbonne Universite</h2>
      </div>
    </section>
  );
};

export default Welcome;
