import React, { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import styles from './Timeline.module.css';
import Image from 'next/image';

const Timeline: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const images = [
    '/Mochi/Mochi/1.jpg', '/Mochi/Mochi/2.jpg', '/Mochi/Mochi/3.jpg',
    '/Mochi/Mochi/4.jpg','/Mochi/Mochi/5.jpg','/Mochi/Mochi/6.jpg',
    '/Mochi/Mochi/7.jpg','/Mochi/Mochi/8.jpg','/Mochi/Mochi/9.jpg',
    '/Mochi/Mochi/10.jpg','/Mochi/Mochi/11.jpg','/Mochi/Mochi/12.jpg',
    '/Mochi/Mochi/13.jpg','/Mochi/Mochi/14.jpg','/Mochi/Mochi/15.jpg',
    '/Mochi/Mochi/16.jpg','/Mochi/Mochi/17.jpg','/Mochi/Mochi/18.jpg',
    '/Mochi/Mochi/19.jpg','/Mochi/Mochi/20.jpg','/Mochi/Mochi/21.jpg',
    '/Mochi/Mochi/22.jpg','/Mochi/Mochi/23.jpg','/Mochi/Mochi/24.jpg',
    '/Mochi/Mochi/25.jpg','/Mochi/Mochi/26.jpg','/Mochi/Mochi/27.jpg',
    '/Mochi/Mochi/28.jpg','/Mochi/Mochi/29.jpg','/Mochi/Mochi/30.jpg',
    '/Mochi/Mochi/31.jpg','/Mochi/Mochi/32.jpg','/Mochi/Mochi/33.jpg',
    '/Mochi/Mochi/34.jpg','/Mochi/Mochi/35.jpg','/Mochi/Mochi/36.jpg',
    '/Mochi/Mochi/37.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true); // Trigger fade-out effect
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFadeOut(false); // Reset fade-out effect
      }, 500); // Match this duration with the CSS transition duration
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  return (
    <section id="timeline" className={styles.section}>
      <h2 className={styles.maintitle}>Education and Work Experience</h2>
      <p className={styles.maindescription}>
      I&apos;ve explored a bunch of different fields through my studies and internships—AR, security, data analysis, research—but over time,
      I got really into AI and ML. Now, with my Master&apos;s,
      that interest has only grown, which you can probably tell from my projects!
      </p>
    <div className={styles.timelineContainer}>
      <VerticalTimeline lineColor="#ddd">

      <VerticalTimelineElement
          className={styles.timelineElement}
          contentStyle={{ background: '#ffffff', color: '#000000' }}
          contentArrowStyle={{ borderRight: '10px solid  rgb(0, 0, 0)' }}
          date="July 2024 - August 2024"
          icon={<Image src="/logos/university_of_luxembourg_logo.jpeg" alt="Company Logo" className={styles.icon} width={50} height={50} />}
        >
          <h3 className={styles.title}>Research Assistant</h3>
          <h4 className={styles.subtitle}>University of Luxembourg</h4>
          <p>
          As a Research Assistant, I developed the backend of a multi-agent system (MAS) application designed to enhance Luxembourgish language learning.
          Using LangGraph, I built a dynamic and adaptive learning environment where specialized AI agents focus on different aspects of language acquisition,
          including reading, listening, conversation, grammar, and question answering.
          This work led to <a href="https://link.springer.com/chapter/10.1007/978-3-031-77367-9_29" target="_blank" rel="noopener noreferrer" style={{ color: '#1a0dab', textDecoration: 'underline' }}>a published research paper</a>
          , which I co-wrote, and a demo presented at the PRIMA conference in Kyoto, Japan.
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className={styles.timelineElement}
          contentStyle={{ background: '#ffffff', color: '#000000' }}
          contentArrowStyle={{ borderRight: '10px solid  rgb(0, 0, 0)' }}
          date="May 2024 - Present"
          icon={<Image src="/Mochi/Mochi/3.jpg" alt="Company Logo" className={styles.icon} width={50} height={50} />}
        >
          <h3 className={styles.title}>Adoption of Mochi</h3>
          <h4 className={styles.subtitle}>cat</h4>
          <p>
          This is my cat Mochi. She&apos;s the best. 10/10. Here are some more pictures of her. You&apos;re welcome.
          </p>
          <div className={`${styles.profilePic} ${fadeOut ? styles.fadeOut : ''}`}>
              <Image
                src={images[currentImageIndex]}
                alt="Mochi"
                width={100}
                height={100}
              />
            </div>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className={styles.timelineElement}
          contentStyle={{ background: '#ffffff', color: '#000000' }}
          contentArrowStyle={{ borderRight: '10px solid  rgb(0, 0, 0)' }}
          date="Sep 2023 - Present"
          icon={<Image src="/logos/sorbonne_universite_logo.jpeg" alt="Company Logo" className={styles.icon} width={50} height={50} />}
        >
          <h3 className={styles.title}>ML/AI Master&apos;s Degree</h3>
          <h4 className={styles.subtitle}>Sorbonne Universite</h4>
          <p>
          I&apos;m currently doing my Master&apos;s in DAC at Sorbonne University, a math-heavy program that dives deep into the theory behind AI and ML.
          It&apos;s not just about applying models—we focus on probability and statistics to really understand how things work.
          In my classes, we explore ML, deep learning, NLP, and information retrieval (to only cite a few), combining theory with hands-on projects to aquire real knowledge.
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className={styles.timelineElement}
          contentStyle={{ background: '#ffffff', color: '#000000' }}
          contentArrowStyle={{ borderRight: '10px solid  rgb(0, 0, 0)' }}
          date="Feb 2023 - Jun 2023"
          icon={<Image src="/logos/grant_thornton_luxembourg_logo.jpeg" alt="Company Logo" className={styles.icon} width={50} height={50} />}
        >
          <h3 className={styles.title}>Information Security Intern</h3>
          <h4 className={styles.subtitle}>Grant Thornton Luxembourg</h4>
          <p>
          During my last Bachelor Semester Project, I worked as an intern in the Security Team of GT LU.
          My job tackled various projects, such as, but not limited to, NIST/ISO27001 compliance, IAM project,
          Development of security awareness trainings for staff and development of crisis management trainings for higher ups.
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className={styles.timelineElement}
          contentStyle={{ background: '#ffffff', color: '#000000' }}
          contentArrowStyle={{ borderRight: '10px solid  rgb(0, 0, 0)' }}
          date="Feb 2022 - Jan 2023"
          icon={<Image src="/logos/university_of_luxembourg_logo.jpeg" alt="Company Logo" className={styles.icon} width={50} height={50} />}
        >
          <h3 className={styles.title}>Bachelor Semester Project Tutor</h3>
          <h4 className={styles.subtitle}>University of Luxembourg</h4>
          <p>
          Helping students work on their semester project, by helping them with research, tasks, coding, scientific writing
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className={styles.timelineElement}
          contentStyle={{ background: '#ffffff', color: '#000000' }}
          contentArrowStyle={{ borderRight: '10px solid  rgb(0, 0, 0)' }}
          date="Aug 2022 - Sep 2022"
          icon={<Image src="/logos/grant_thornton_luxembourg_logo.jpeg" alt="Company Logo" className={styles.icon} width={50} height={50} />}
        >
          <h3 className={styles.title}>Data Analysis Internship</h3>
          <h4 className={styles.subtitle}>Grant Thornton Luxembourg</h4>
          <p>
          I was hired full time during the summer of 2022 in the Security Team at GT LU.
          I worked on various tasks, but mostly on Data Analysis on the internal severs and developing an Add-On in the Outlook environment for email filtering and security to deploy internally.
          I also did some work on ISO27001 compliance documents on the side.
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className={styles.timelineElement}
          contentStyle={{ background: '#ffffff', color: '#000000' }}
          contentArrowStyle={{ borderRight: '10px solid  rgb(0, 0, 0)' }}
          date="Sep 2020 - Jan 2021"
          icon={<Image src="/logos/goodyear_logo.jpeg" alt="Company Logo" className={styles.icon} width={50} height={50} />}
        >
          <h3 className={styles.title}>Augmented Reality Internship</h3>
          <h4 className={styles.subtitle}>The Goodyear Tire & Rubber Company</h4>
          <p>
          Project on Augmented Reality (AR) for maintenance procedures in a fully automated industrial environment.
            Outcome: Hololens 2 AR guide targeted at new employees and maintenance tasks.

            Demo of the project was done during the visit of the Luxembourg Minister of Finance & Economy.
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className={styles.timelineElement}
          contentStyle={{ background: '#ffffff', color: '#000000' }}
          contentArrowStyle={{ borderRight: '10px solid rgb(0, 0, 0)'}}
          date="Sep 2020 - Aug 2023"
          icon={<Image src="/logos/university_of_luxembourg_logo.jpeg" alt="University Logo" className={styles.icon} width={50} height={50} />}
        >
          <h3 className={styles.title}>Bachelor of Computer Science</h3>
          <h4 className={styles.subtitle}>University of Luxembourg</h4>
          <p>
            Completed a Bachelor&apos;s degree in Computer Science, where is studied programming,
            linear algebra, discrete mathematics, theoretical CS, computer infrastructures etc...
          </p>
        </VerticalTimelineElement>

      </VerticalTimeline>
    </div>
    </section>
  );
};

export default Timeline;