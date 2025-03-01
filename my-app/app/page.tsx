"use client";
import dynamic from 'next/dynamic';

// Dynamically import each component
const Welcome = dynamic(() => import('./welcome/Welcome'), { ssr: false });
const About = dynamic(() => import('./about/About'), { ssr: false });
const Projects = dynamic(() => import('./projects/Projects'), { ssr: false });
const Resume = dynamic(() => import('./resume/Resume'), { ssr: false });

const HomePage: React.FC = () => {
  return (
    <main>
      <Welcome />
      <About />
      <Projects />
      <Resume />
    </main>
  );
};

export default HomePage;
