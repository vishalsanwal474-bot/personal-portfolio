import { ContentProvider } from "./context/ContentContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Services from "./components/Services";
import Profiles from "./components/Profiles";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import AdminEntry from "./components/AdminEntry";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  return (
    <ContentProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Services />
        <Profiles />
        <Resume />
        <Contact />
      </main>
      <Footer />
      <AdminEntry />
      <Chatbot />
      <AdminPanel />
    </ContentProvider>
  );
}
