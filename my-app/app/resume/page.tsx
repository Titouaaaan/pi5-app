"use client";
import Image from "next/image";
import SkillBar from 'react-skillbars';

const skills = [ // Need to change this to be more realistic
  { type: 'Python', level: 90, color: {bar: '#3498db', title: { text: '#fff', background: '#2980b9' }} },
  { type: 'ML', level: 85, color: {bar: '#4288d0', title: { text: '#fff', background: '#124e8c' }} },
  { type: 'Mathematics', level: 80, color: {bar: '#6F8DB8', title: {whiteSpace: 'normal', text: '#fff', background: '#46465e' }} },
  { type: 'React', level: 75, color: {bar: '#2c3e50', title: { text: '#fff', background: '#2c3e50' }} },
  { type: 'Node.js', level: 70, color: {bar: '#6FB874', title: { text: '#fff', background: '#46465e' }} },
];

export default function Test() {
  return (
    <main className="flex min-h-screen bg-gray-300 font-bebas text-black">
        <section className="w-1/4 bg-gray-400 p-10 sticky top-0 h-screen">
          <div className="text-center">
            <Image
              src="/profilepic.jpeg"
              alt="Titouan Guerin"
              width={150}
              height={150}
              className="rounded-full mb-6 mx-auto"
            />
            <p className="italic mb-4">&quot;Master Student at Sorbonne Université🥐&quot;</p>
            <h3 className="font-semibold mb-4">Skills</h3>
            <SkillBar skills={skills} height={20} animationDelay={0} animationDuration={1500} />
            <div className="mt-8">
              <a
                href="/Titouan_Guerin_Resume_3.0.pdf"
                download
                className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition transform hover:scale-105"
              >
                Download my CV!
              </a>
            </div>
          </div>
        </section>

      {/* Main Content Section */}
      <section className="w-3/4 bg-gray-300 p-10 overflow-y-auto">
        {/* Experience Section */}
        <section className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-4xl font-semibold text-gray-800 mb-4">Experience</h2>

          <div className="mb-6">
            <div className="flex items-center space-x-4"> 
              <h3 className="text-lg font-bold text-gray-700">Research Assistant</h3>
                <Image
                  src="/logos/university_of_luxembourg_logo.jpeg"
                  alt="University of Luxembourg logo"
                  className="w-8 h-8"
                  width={150}
                  height={150}
                />
            </div>
              <p className="text-sm text-gray-500">University of Luxembourg | Jul 2024</p>
              <p className="mt-2 text-gray-600">
                  As a Research Assistant, I developed the backend of a multi-agent system to enhance Luxembourgish language learning using LangGraph.
                  The system integrated AI agents for reading, listening, conversation, grammar, and question answering.
                  This project led to a research paper and demo at the PRIMA conference in Kyoto, Japan, showcasing AI-driven language learning innovations.
              </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4">
                <h3 className="text-lg font-bold text-gray-700">Information Security Intern</h3>
                <Image
                  src="/logos/grant_thornton_luxembourg_logo.jpeg"
                  alt="University of Luxembourg logo"
                  className="w-8 h-8"
                  width={150}
                  height={150}
                />
            </div>
              <p className="text-sm text-gray-500">Grant Thornton Luxembourg | Feb 2023 - Jun 2023</p>
              <p className="mt-2 text-gray-600">
                During my last Bachelor Semester Project, I worked as an intern in the Security Team of GT LU. 
                My job tackled various projects, such as, but not limited to, NIST/ISO27001 compliance, IAM project, Development of security awareness trainings for staff and development of crisis management trainings for higher ups.
              </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4">
                <h3 className="text-lg font-bold text-gray-700">Data Analysis Internship</h3>
                <Image
                  src="/logos/grant_thornton_luxembourg_logo.jpeg"
                  alt="University of Luxembourg logo"
                  className="w-8 h-8"
                  width={150}
                  height={150}
                />
            </div>
              <p className="text-sm text-gray-500">Grant Thornton Luxembourg | Aug 2023 - Sep 2023</p>
              <p className="mt-2 text-gray-600">
                I was hired full time in the Security Team at GT LU. 
                I worked on various tasks such as developing an Add-On in the Outlook environment for email filtering, Data Analysis on the internal severs and ISO27001 compliance documents.
              </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-bold text-gray-700">Augmented Reality Internship</h3>
              <Image
                src="/logos/goodyear_logo.jpeg"
                alt="University of Luxembourg logo"
                className="w-8 h-8"
                width={150}
                height={150}
              />
            </div>
            <p className="text-sm text-gray-500">The Goodyear Tire & Rubber Company | Sep 2020 - Jan 2021</p>
            <p className="mt-2 text-gray-600">
              Project on Augmented Reality (AR) for maintenance procedures in a fully automated industrial environment.
              Outcome: Hololens 2 AR guide targeted at new employees and maintenance tasks.
              Demo of the project was done during the visit of the Luxembourg Minister of Finance & Economy.
            </p>
          </div>
      </section>

      {/* Education Section */}
      <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-4xl font-semibold text-gray-800 mb-4">Education</h2>
          {/* Degree 1 */}
          <div className="mb-6">
              <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-bold text-gray-700">Master&apos;s in AI, ML, and Data Science</h3>
                  <Image
                  src="/logos/sorbonne_universite_logo.jpeg"
                    alt="University of Luxembourg logo"
                    className="w-8 h-8"
                    width={150}
                    height={150}
                  />
              </div>
              <p className="text-sm text-gray-500">Sorbonne Université | 2023 - Present</p>
              <p className="mt-2 text-gray-600">
                The DAC (Data, Analytics, and Knowledge) program is designed to provide skills in artificial intelligence, with a primary focus on data utilization, knowledge creation, and the development of intelligent services. 
                The program covers core topics such as database fundamentals, information retrieval, data mining, machine learning, and computational intelligence.
                Essential skills learned are: managing and analyzing large datasets, effectively using AI tools, and implementing machine learning techniques for data-driven decision-making. 
                Graduating from this Master&apos;s leads to jobs related to data analysis, AI development, and knowledge-driven decision support, both in academia and in the private sector.
              </p>
          </div>

          <div className="mb-6">
              <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-bold text-gray-700">Bachelor&apos;s in Computer Science</h3>
                  <Image
                    src="/logos/university_of_luxembourg_logo.jpeg"
                    alt="University of Luxembourg logo"
                    className="w-8 h-8"
                    width={150}
                    height={150}
                  />
              </div>
              <p className="text-sm text-gray-500">University of Luxembourg | 2020 - 2023</p>
              <p className="mt-2 text-gray-600">
                I earned my Bachelor&apos;s degree in Computer Science from the University of Luxembourg, where I built a strong foundation in software development, algorithms, and data structures. 
                Throughout my studies, I honed my problem-solving abilities and analytical thinking, which have been essential in both my academic research and practical projects. 
                This experience has not only deepened my technical knowledge but also taught me how to collaborate effectively and approach challenges with a solution-oriented mindset.                    
              </p>
          </div>
        </section> 
      </section>
    </main>
  );
}