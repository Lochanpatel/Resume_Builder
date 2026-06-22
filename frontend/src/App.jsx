import React from 'react'

export default function App() {
  return (
    <div className="resume-root">
      <header className="resume-header">
        <div>
          <h1 className="name">Jane Doe</h1>
          <p className="title">Frontend Engineer</p>
        </div>
        <div className="contact">
          <div>jane.doe@example.com</div>
          <div>(555) 123-4567</div>
          <div>github.com/janedoe</div>
        </div>
      </header>

      <section className="section summary">
        <h2>Summary</h2>
        <p>
          Product-focused frontend engineer with 5+ years building accessible,
          maintainable web apps. Strong React, TypeScript, and design system
          experience.
        </p>
      </section>

      <section className="section">
        <h2>Experience</h2>
        <article className="job">
          <h3>Senior Frontend Engineer — Acme Corp</h3>
          <div className="muted">2021 – Present</div>
          <ul>
            <li>Led rewrite of core UI in React, improving load time by 35%.</li>
            <li>Built reusable component library used across 8 teams.</li>
          </ul>
        </article>

        <article className="job">
          <h3>Frontend Engineer — Example Co</h3>
          <div className="muted">2018 – 2021</div>
          <ul>
            <li>Developed responsive interfaces and improved accessibility.
            </li>
          </ul>
        </article>
      </section>

      <section className="section">
        <h2>Education</h2>
        <div>B.S. Computer Science — University</div>
        <div className="muted">2014 – 2018</div>
      </section>

      <section className="section">
        <h2>Skills</h2>
        <div className="skills">React · JavaScript · HTML · CSS · Accessibility</div>
      </section>

      <footer className="resume-footer muted">Generated with Resume Builder</footer>
    </div>
  )
}
