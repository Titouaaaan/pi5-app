import Image from 'next/image';

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-300 py-12 px-6 font-bebas">
      {/* Profile Section */}
      <div className="text-center mb-12">
        {/* Profile Picture */}
        <Image
          src="/profilepic.jpeg" 
          alt="Titouan Guerin"
          className="w-32 h-32 rounded-full mx-auto mb-4"
          width={128}
          height={128}
        />
        <h1 className="text-4xl font-extrabold text-gray-900">ABOUT ME</h1>
        <p className="mt-2 text-1xl text-gray-600">🤓 Fun fact, this website is currently being hosted on my raspberry pi 5!</p>
      </div>

      {/* About Me Content */}
      <div className="max-w-4xl w-full space-y-6 px-4">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800">Who Am I? 👨‍🎓</h2>
          <p className="text-lg text-gray-700">
          I am a passionate AI and Machine Learning enthusiast currently pursuing my Master&apos;s in Artificial Intelligence, Machine Learning, and Data Science at Sorbonne Université. 
          I hold a Bachelor&apos;s degree in Computer Science from the University of Luxembourg, where I also had the privilege of being a student representative.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800">Recent Achievements 🎉</h2>
          <p className="text-lg text-gray-700">
          I recently co-authored a paper titled &quot;Beyond Chatbots: Enhancing Luxembourgish Language Learning Through Multi-agent Systems and Large Language Models&quot;, which was presented at PRIMA 2024 in Kyoto, Japan and published by Springer. 
          The paper explores how AI and multi-agent systems can be utilized to revolutionize language learning, particularly for low-resource languages like Luxembourgish. 
          You can read it{" "}
          <a href="https://link.springer.com/chapter/10.1007/978-3-031-77367-9_29" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
           here
          </a>
          !
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800">Hobbies & Interests 🎮</h2>
          <p className="text-lg text-gray-700">
            When I&apos;m not working, I enjoy playing video games, playing music (guitar and electric bass) or doing some physical exercise (climbing, gym, basketball).
          </p>
        </section>
        
        {/* Call to Action */}
        <section className="mt-8 flex justify-center">
          <a
            href="/Titouan_Guerin_Resume_3.0.pdf" // replace with your CV path
            download
            className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition transform hover:scale-105 animate-bubble"
          >
            Download my CV ! 
          </a>
        </section>
      </div>
    </main>
  );
}
