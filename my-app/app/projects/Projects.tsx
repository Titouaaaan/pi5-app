import React, { useState, useEffect } from 'react';
import styles from './Projects.module.css';
import Image from 'next/image';
import { GitHub } from '@mui/icons-material';

const projects = [
  {
    title: 'RL-Souls',
    imageUrl: '/projects/ds3.jpeg',
    description: `
    The goal of this project is to use Reinforcement Learning algorithms to teach an agent how to play Souls games (FromSoftware) like Dark Souls III.
    Different algorithms will be tested and fine-tuned to figure out which methods work best.
    I am working on this project during my gap year between my M1 and M2 at Sorbonne Université.
  `,
    link: 'https://github.com/Titouaaaan/RL-Souls',
    modalImageUrl: '/projects/ds3.jpeg',
  },
  {
    title: 'NN from scratch',
    imageUrl: '/projects/nn.jpeg',
    description: `I implemented a neural network from scratch using only NumPy, following a modular approach inspired by early PyTorch. 
                  Each layer is treated as a module with forward and backward methods, making it flexible and reusable.

                  I started with basic components like linear layers and an MSE loss function, allowing for simple regression tasks. 
                  Then, I added activation functions like Tanh and Sigmoid to introduce non-linearity and tested a small network for binary classification. 

                  To simplify the structure, I created a Sequentiel class to manage forward and backward passes automatically and an optimizer to update parameters efficiently.

                  Next, I expanded to multi-class classification by implementing Softmax and Cross-Entropy loss. 

                  I also experimented with autoencoders for dimensionality reduction and feature learning. 
                  Finally, I implemented 1D convolutional layers, pooling, ReLU activation, and a Flatten module to work with CNN-like architectures.
                  Moving forward, I plan to refine the network, experiment with different architectures, and possibly extend to 2D convolutions for more complex tasks.`,
    link: 'https://github.com/Titouaaaan/DIY-Neural-Network',
    modalImageUrl: '/projects/nn.jpeg',
  },
  {
    title: 'LLM Multi-agent System',
    imageUrl: '/projects/ellmma.jpeg',
    description: `
    This project explores the use of AI and large language models (LLMs) in education, specifically for language learning. 
    Instead of relying on a single chatbot, it proposes a Multi-Agent System (MAS) where different AI agents specialize in various aspects of learning, such as reading, 
    conversation, listening, and grammar. 
    The system leverages Business Process Model and Notation (BPMN) and agent-based modeling to create adaptive and personalized learning experiences.
    The focus is on teaching Luxembourgish, a low-resource language, using structured pedagogical resources like language learning books. 
    The approach integrates GPT-4o, Retrieval-Augmented Generation (RAG), and voice recognition to provide a more dynamic, interactive, and accurate learning environment. 
    By simulating human tutoring, this system ensures a more effective and holistic language learning experience.
    `,
    link: 'https://github.com/Titouaaaan/ELL-MMA',
    modalImageUrl: '/projects/ellmma.jpeg',
  },
  {
    title: 'Self-hosted Fullstack app',
    imageUrl: '/projects/appimg.jpg',
    description: `
    I built this full-stack app using Next.js for the front end and FastAPI for the backend. 
    It's a fun side project that I'm hosting on a Raspberry Pi 5, which is pretty cool because it shows how much you can do with such a small device. 
    I'm using a Cloudflare tunnel to make it accessible online, which works great for keeping things secure and reliable. 
    Right now, it's just a fun project, but I'm thinking about adding an AI chip to the Pi in the future to run machine learning models directly on it. 
    It would be exciting to see how far I can push this little setup!
    The Github repo will be made available publicly eventually (once i clean things up).`,
    link: 'https://github.com/Titouaaaan/pi5-app',
    modalImageUrl: '/projects/appimg.jpg',
  },
];

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const openModal = (project: typeof projects[0]) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = 'unset'; // Allow scrolling when modal is closed
    }
  }, [selectedProject]);

  return (
    <section id="projects" className={styles.section}>
      <h2 className={styles.title}>Project Portfolio</h2>
      <p className={styles.description}>
        Down here you can find some projects I worked on! Some are university projects, some are research projects and some are just personal projects I worked on. 
        I will keep adding more projects over time. <strong>Click on any image to learn more about the project!</strong>
      </p>
      {/* GitHub Button */}
      <a href="https://github.com/Titouaaaan" target="_blank" rel="noopener noreferrer" className={styles.githubButton}>
        <GitHub className={styles.githubIcon} />
        <span className={styles.githubText}>View My GitHub</span>
      </a>
      <div className={styles.grid}>
        {projects.map((project, index) => (
          <div key={index} className={styles.project} onClick={() => openModal(project)}>
            <Image
              src={project.imageUrl}
              alt={project.title}
              className={styles.projectImage}
              width={300}
              height={200}
            />
            <h3 className={styles.projectTitle}>{project.title}</h3>
          </div>
        ))}
      </div>
      {selectedProject && (
        <div className={styles.modal} onClick={handleOutsideClick}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>&times;</span>
            <Image
              src={selectedProject.modalImageUrl}
              alt={selectedProject.title}
              className={styles.modalImage}
              width={400}
              height={300}
            />
            <p className={styles.descriptionText}>
              {selectedProject.description}
            </p>
            <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className={styles.prettyLink}>
              View Project
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
