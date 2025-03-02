import React from 'react';
import Image from 'next/image';
import styles from './Resume.module.css';

const Resume: React.FC = () => {
  return (
    <section id="resume" className={styles.section}>
      <h2 className={styles.title}>I have experience with these technologies</h2>
      <p className={styles.description}>
        Here are (some) technologies I am very familiar with, that I learned either at university or on my own time. 
        All the tools I put here are used in my different open sources projects on github (so you can see what I did with them).
        I&apos;ll keep adding more as I publish my work/projects.
      </p>
      <div className={styles.skillsContainer}>

        <div className={styles.skillItem}>
          <Image
            src="/skills/python_logo.png"
            alt="Python Logo"
            width={150}
            height={150}
            className={styles.skillIcon}
          />
          <h3 className={styles.skillTitle}></h3>
        </div>

        <div className={styles.skillItem}>
          <Image
            src="/skills/pytorch_logo.png"
            alt="Pytorch Logo"
            width={170}
            height={170}
            className={styles.skillIcon}
          />
          <h3 className={styles.skillTitle}></h3>
        </div>

        <div className={styles.skillItem}>
          <Image
            src="/skills/numpy_logo.png"
            alt="Numpy Logo"
            width={170}
            height={170}
            className={styles.skillIcon}
          />
          <h3 className={styles.skillTitle}></h3>
        </div>

        <div className={styles.skillItem}>
          <Image
            src="/skills/gymnasium_logo.png"
            alt="Gym Logo"
            width={200}
            height={200}
            className={styles.skillIcon}
          />
          <h3 className={styles.skillTitle}></h3>
        </div>

        <div className={styles.skillItem}>
          <Image
            src="/skills/next-js-logo-freelogovectors.net_.png"
            alt="Next.js Logo"
            width={100}
            height={100}
            className={styles.skillIcon}
          />
          <h3 className={styles.skillTitle}></h3>
        </div>

        <div className={styles.skillItem}>
          <Image
            src="/skills/typescript_logo.png"
            alt="TypeScript Logo"
            width={150}
            height={150}
            className={styles.skillIcon}
          />
          <h3 className={styles.skillTitle}></h3>
        </div>

        <div className={styles.skillItem}>
          <Image
            src="/skills/React-icon.svg.png"
            alt="React Logo"
            width={70}
            height={70}
            className={styles.skillIcon}
          />
          <h3 className={styles.skillTitle}></h3>
        </div>

        <div className={styles.skillItem}>
          <Image
            src="/skills/fastapi_logo.svg"
            alt="FastAPI Logo"
            width={70}
            height={70}
            className={styles.skillIcon}
          />
          <h3 className={styles.skillTitle}></h3>
        </div>

        <div className={styles.skillItem}>
          <Image
            src="/skills/github_logo.png"
            alt="Github Logo"
            width={70}
            height={70}
            className={styles.skillIcon}
          />
          <h3 className={styles.skillTitle}></h3>
        </div>

        <div className={styles.skillItem}>
          <Image
            src="/skills/langchain_logo.png"
            alt="Langchain Logo"
            width={100}
            height={100}
            className={styles.skillIcon}
          />
          <h3 className={styles.skillTitle}></h3>
        </div>

        {/* Add more skill items as needed */}
      </div>
    </section>
  );
};

export default Resume;
