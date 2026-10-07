
import Intro from "./components/Intro";

import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import me from "./assets/me.jpg";

const SOCIALS = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/sarthak-salunke05/", Icon: FaLinkedin },
  { name: "GitHub", url: "https://github.com/sarthaksalunke05", Icon: FaGithub },
  { name: "Instagram", url: "https://www.instagram.com/_avdhut_salunke_/", Icon: FaInstagram },
];

import { useEffect, useState } from "react";
import SwingingHero from "./components/SwingingHero";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [introDone, setIntroDone] = useState(
    () => sessionStorage.getItem("introSeen") === "1"
  );
  const finishIntro = () => {
    sessionStorage.setItem("introSeen", "1");
    setIntroDone(true);
  };
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Sending…");
    try {
      const r = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Something went wrong.");
      setForm({ name: "", email: "", message: "" });
      setStatus("Message sent. I'll get back to you soon.");
    } catch (err) {
      setStatus(err.message);
    }
  };

  const heroSize = window.innerWidth < 700 ? 90 : 160;

  return (
    <>{!introDone && <Intro onDone={finishIntro} />}
      <nav className="nav">
        <div className="logo"><span>●</span> sarthak</div>
        <div>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero">
        <div className="tag">QA AUTOMATION / DATA ANALYST</div>
        <h1>I <em>break</em> things so users never have to.</h1>
        <p className="sub">
          Fresher QA automation tester and data analyst from Pune. I catch bugs
          before they catch users.
        </p>
        <div>
          <a className="btn red" href="#projects">View projects</a>
          <a className="btn" href="#contact">Contact me</a>
        </div>
      </section>

      <section id="about">
        <h2>About <span>me</span></h2>
        <div className="bento">
          <div className="tile">
            <h3>Testing</h3>
            <p>Java, Selenium, TestNG, automation frameworks, test cases.</p>
          </div>
          <div className="tile">
            <h3>Data</h3>
            <p>SQL, Python, Excel and Power BI dashboards.</p>
          </div>
          <div className="tile red">
            <h3>Open to work</h3>
            <p>Looking for QA automation and data analyst roles.</p>
          </div>
        </div>
      </section>

      <section id="projects">
        <h2>My <span>projects</span></h2>
        <div className="bento">
          {projects.length === 0 && <p className="status">Loading projects…</p>}
          {projects.map((p) => (
            <div className="tile" key={p._id}>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="tags">
                {p.tech.map((t) => <span key={t}>{t}</span>)}
              </div>
              <a href={p.link} target="_blank" rel="noreferrer">View on GitHub →</a>
            </div>
          ))}
        </div>
      </section>

      <section id="contact">
        <h2>Get in <span>touch</span></h2>
        <div className="contact-grid">
          <form onSubmit={submit}>
            <input name="name" placeholder="Your name" value={form.name} onChange={onChange} />
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} />
            <textarea name="message" rows="5" placeholder="Say hello" value={form.message} onChange={onChange} />
            <button className="btn red" type="submit">Send message</button>
            {status && <p className="status">{status}</p>}
          </form>

          <div className="profile">
            <img src={me} alt="Sarthak Salunke" className="avatar" />
            <h3>Sarthak Salunke</h3>
            <p>QA Automation Tester and Data Analyst</p>
            <p>Pune, India</p>
            <div className="socials">
              {SOCIALS.map(({ name, url, Icon }) => (
                <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name}>
                  <Icon /> <span>{name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer>© {new Date().getFullYear()} Sarthak Salunke</footer>

      <SwingingHero size={heroSize} />
    </>
  );
}