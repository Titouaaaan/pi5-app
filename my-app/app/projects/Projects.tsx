import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Projects.module.css';

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const projects = [
    {
      title: 'Neural Model Library',
      imageUrl: '/missing_image.jpg',
      description: 'A library for creating neural models in TensorFlow.',
      link: 'https://github.com/yourusername/neural-model-library',
    },
    {
      title: 'NN Trainer Library',
      imageUrl: '/missing_image.jpg',
      description: 'A library for supervised training of neural models.',
      link: 'https://github.com/yourusername/nn-trainer-library',
    },
    {
      title: 'NN Experiments',
      imageUrl: '/missing_image.jpg',
      description: 'A collection of neural network experiments in TensorFlow.',
      link: 'https://github.com/yourusername/nn-experiments',
    },
    // Add more projects as needed
  ];

  const handleProjectClick = (title: string) => {
    setSelectedProject(title);
  };

  const closeBanner = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projects" className={styles.section}>
      <h2 className={styles.title}>Projects</h2>
      <div className={styles.projectsGrid}>
        {projects.map((project, index) => (
          <div key={index} className={styles.project} onClick={() => handleProjectClick(project.title)}>
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={200} // Set a fixed width
              height={150} // Set a fixed height
              className={styles.projectImage}
            />
            <h3 className={styles.projectTitle}>{project.title}</h3>
          </div>
        ))}
      </div>
      {selectedProject && (
        <div className={styles.banner}>
          <h3>{selectedProject}</h3>
          <p>{projects.find(p => p.title === selectedProject)?.description}</p>
          <a href={projects.find(p => p.title === selectedProject)?.link} target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
          <button onClick={closeBanner}>Close</button>
        </div>
      )}
    </section>
  );
};

export default Projects;
