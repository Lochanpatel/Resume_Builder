import React, { useEffect, useMemo, useState } from 'react'
import { validateEmail, validatePhone, validateURL } from './utils'

const emptyExperience = () => ({
  role: '',
  company: '',
  startDate: '',
  endDate: '',
  description: ''
})

const emptyEducation = () => ({
  school: '',
  degree: '',
  years: ''
})

const initialResume = {
  name: 'Jane Doe',
  title: 'Frontend Engineer',
  email: 'jane.doe@example.com',
  phone: '(555) 123-4567',
  website: 'github.com/janedoe',
  summary:
    'Product-focused frontend engineer with 5+ years building accessible, maintainable web apps.',
  experience: [
    {
      role: 'Senior Frontend Engineer',
      company: 'Acme Corp',
      startDate: '2021',
      endDate: 'Present',
      description: 'Led a rewrite of core UI in React and improved load time by 35%.'
    },
    {
      role: 'Frontend Engineer',
      company: 'Example Co',
      startDate: '2018',
      endDate: '2021',
      description: 'Built responsive interfaces with a strong focus on accessibility.'
    }
  ],
  education: [
    {
      school: 'University of Technology',
      degree: 'B.S. Computer Science',
      years: '2014 – 2018'
    }
  ],
  skillsText: 'React, JavaScript, HTML, CSS, Accessibility'
}

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone) => {
  const phoneRegex = /^[\d\-\s\+\(\)]+$|^$/
  return phoneRegex.test(phone)
}

const validateURL = (url) => {
  if (!url) return true
  try {
    new URL(`https://${url}`)
    return true
  } catch {
    return false
  }
}

export default function App() {
  const [resume, setResume] = useState(initialResume)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('resume-builder-data')
      if (saved) {
        setResume(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Unable to load saved resume', error)
    } finally {
      setHasLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!hasLoaded) {
      return
    }

    window.localStorage.setItem('resume-builder-data', JSON.stringify(resume))
  }, [hasLoaded, resume])

  const skills = useMemo(
    () => resume.skillsText.split(',').map((skill) => skill.trim()).filter(Boolean),
    [resume.skillsText]
  )

  const handleFieldChange = (field, value) => {
    let newErrors = { ...errors }
    
    // Validate specific fields
    if (field === 'email' && value && !validateEmail(value)) {
      newErrors.email = 'Please enter a valid email address'
    } else if (field === 'email') {
      delete newErrors.email
    }
    
    if (field === 'phone' && !validatePhone(value)) {
      newErrors.phone = 'Please enter a valid phone number'
    } else if (field === 'phone') {
      delete newErrors.phone
    }
    
    if (field === 'website' && !validateURL(value)) {
      newErrors.website = 'Please enter a valid website URL'
    } else if (field === 'website') {
      delete newErrors.website
    }
    
    if (field === 'name' && !value.trim()) {
      newErrors.name = 'Full name is required'
    } else if (field === 'name') {
      delete newErrors.name
    }
    
    setErrors(newErrors)
    setResume((current) => ({ ...current, [field]: value }))
  }

  const handleExperienceChange = (index, field, value) => {
    setResume((current) => {
      const nextExperience = [...current.experience]
      nextExperience[index] = { ...nextExperience[index], [field]: value }
      return { ...current, experience: nextExperience }
    })
  }

  const addExperience = () => {
    setResume((current) => ({ ...current, experience: [...current.experience, emptyExperience()] }))
  }

  const removeExperience = (index) => {
    setResume((current) => ({
      ...current,
      experience: current.experience.filter((_, itemIndex) => itemIndex !== index)
    }))
  }

  const handleEducationChange = (index, field, value) => {
    setResume((current) => {
      const nextEducation = [...current.education]
      nextEducation[index] = { ...nextEducation[index], [field]: value }
      return { ...current, education: nextEducation }
    })
  }

  const addEducation = () => {
    setResume((current) => ({ ...current, education: [...current.education, emptyEducation()] }))
  }

  const removeEducation = (index) => {
    setResume((current) => ({
      ...current,
      education: current.education.filter((_, itemIndex) => itemIndex !== index)
    }))
  }

  const resetResume = () => {
    setResume(initialResume)
  }

  const downloadPdf = async () => {
    const element = document.querySelector('.resume-root')
    if (!element) return

    const html2pdf = (await import('html2pdf.js')).default

    html2pdf()
      .set({
        margin: 10,
        filename: `${resume.name || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save()
  }

  const printResume = () => {
    window.print()
  }

  return (
    <div className="app-shell">
      <div className="editor-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Resume Builder</p>
            <h1>Create your resume</h1>
          </div>
          <p className="panel-copy">Edit the form and your preview updates instantly.</p>
        </div>

        <section className="card">
          <h2>Profile</h2>
          <div className="field-grid">
            <label className={errors.name ? 'has-error' : ''}>
              Full name
              <input value={resume.name} onChange={(event) => handleFieldChange('name', event.target.value)} />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </label>
            <label>
              Professional title
              <input value={resume.title} onChange={(event) => handleFieldChange('title', event.target.value)} />
            </label>
            <label className={errors.email ? 'has-error' : ''}>
              Email
              <input value={resume.email} onChange={(event) => handleFieldChange('email', event.target.value)} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </label>
            <label className={errors.phone ? 'has-error' : ''}>
              Phone
              <input value={resume.phone} onChange={(event) => handleFieldChange('phone', event.target.value)} />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </label>
            <label className={errors.website ? 'has-error' : ''}>
              Website
              <input value={resume.website} onChange={(event) => handleFieldChange('website', event.target.value)} />
              {errors.website && <span className="error-message">{errors.website}</span>}
            </label>
          </div>
        </section>

        <section className="card">
          <h2>Summary</h2>
          <textarea
            rows="4"
            value={resume.summary}
            onChange={(event) => handleFieldChange('summary', event.target.value)}
          />
        </section>

        <section className="card">
          <div className="section-heading">
            <h2>Experience</h2>
            <button type="button" onClick={addExperience}>+ Add</button>
          </div>

          {resume.experience.map((job, index) => (
            <div className="subcard" key={`${job.company}-${index}`}>
              <div className="subcard-actions">
                <strong>Role {index + 1}</strong>
                {resume.experience.length > 1 && (
                  <button type="button" className="ghost" onClick={() => removeExperience(index)}>
                    Remove
                  </button>
                )}
              </div>
              <div className="field-grid">
                <label>
                  Role
                  <input value={job.role} onChange={(event) => handleExperienceChange(index, 'role', event.target.value)} />
                </label>
                <label>
                  Company
                  <input value={job.company} onChange={(event) => handleExperienceChange(index, 'company', event.target.value)} />
                </label>
                <label>
                  Start
                  <input value={job.startDate} onChange={(event) => handleExperienceChange(index, 'startDate', event.target.value)} />
                </label>
                <label>
                  End
                  <input value={job.endDate} onChange={(event) => handleExperienceChange(index, 'endDate', event.target.value)} />
                </label>
                <label className="full-width">
                  Highlights
                  <textarea rows="3" value={job.description} onChange={(event) => handleExperienceChange(index, 'description', event.target.value)} />
                </label>
              </div>
            </div>
          ))}
        </section>

        <section className="card">
          <div className="section-heading">
            <h2>Education</h2>
            <button type="button" onClick={addEducation}>+ Add</button>
          </div>

          {resume.education.map((entry, index) => (
            <div className="subcard" key={`${entry.school}-${index}`}>
              <div className="subcard-actions">
                <strong>School {index + 1}</strong>
                {resume.education.length > 1 && (
                  <button type="button" className="ghost" onClick={() => removeEducation(index)}>
                    Remove
                  </button>
                )}
              </div>
              <div className="field-grid">
                <label>
                  School
                  <input value={entry.school} onChange={(event) => handleEducationChange(index, 'school', event.target.value)} />
                </label>
                <label>
                  Degree
                  <input value={entry.degree} onChange={(event) => handleEducationChange(index, 'degree', event.target.value)} />
                </label>
                <label>
                  Years
                  <input value={entry.years} onChange={(event) => handleEducationChange(index, 'years', event.target.value)} />
                </label>
              </div>
            </div>
          ))}
        </section>

        <section className="card">
          <h2>Skills</h2>
          <textarea
            rows="2"
            value={resume.skillsText}
            onChange={(event) => handleFieldChange('skillsText', event.target.value)}
            placeholder="React, JavaScript, Design Systems"
          />
        </section>

        <div className="actions">
          <button type="button" className="secondary" onClick={downloadPdf}>
            Download PDF
          </button>
          <button type="button" className="secondary" onClick={printResume}>
            Print resume
          </button>
          <button type="button" className="secondary" onClick={resetResume}>
            Reset example
          </button>
        </div>
      </div>

      <div className="preview-panel">
        <div className="resume-root">
          <header className="resume-header">
            <div>
              <h1 className="name">{resume.name || 'Your Name'}</h1>
              <p className="title">{resume.title || 'Your Title'}</p>
            </div>
            <div className="contact">
              <div>{resume.email || 'your@email.com'}</div>
              <div>{resume.phone || '(555) 000-0000'}</div>
              <div>{resume.website || 'website.com'}</div>
            </div>
          </header>

          <section className="section summary">
            <h2>Summary</h2>
            <p>{resume.summary || 'Add a short summary about your background.'}</p>
          </section>

          <section className="section">
            <h2>Experience</h2>
            {resume.experience.map((job, index) => (
              <article className="job" key={`${job.role}-${index}`}>
                <h3>
                  {job.role || 'Role'} — {job.company || 'Company'}
                </h3>
                <div className="muted">
                  {job.startDate || 'Start'} – {job.endDate || 'End'}
                </div>
                <p>{job.description || 'Add a short highlight about this role.'}</p>
              </article>
            ))}
          </section>

          <section className="section">
            <h2>Education</h2>
            {resume.education.map((entry, index) => (
              <div className="education-entry" key={`${entry.school}-${index}`}>
                <div>{entry.degree || 'Degree'} — {entry.school || 'School'}</div>
                <div className="muted">{entry.years || 'Years'}</div>
              </div>
            ))}
          </section>

          <section className="section">
            <h2>Skills</h2>
            <div className="skills">
              {skills.length > 0 ? skills.map((skill) => <span key={skill}>{skill}</span>) : 'Add a few skills.'}
            </div>
          </section>

          <footer className="resume-footer muted">Generated with Resume Builder</footer>
        </div>
      </div>
    </div>
  )
}
