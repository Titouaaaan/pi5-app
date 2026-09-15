import About from "./components/About";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Phd from "./components/Phd";
import Projects from "./components/Projects";
import Publications from "./components/Publications";
import Rule from "./components/Rule";
import Timeline from "./components/Timeline";
import Tools from "./components/Tools";

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-column flex-col gap-10 px-8 pb-16 pt-20">
      <Hero />
      <Rule />
      <About />
      <Rule />
      <Phd />
      <Rule />
      <Projects />
      <Rule />
      <Publications />
      <Rule />
      <Timeline />
      <Rule />
      <Tools />
      <Rule />
      <Footer />
    </main>
  );
}
