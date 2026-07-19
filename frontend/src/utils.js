/**
 * Validation utilities for resume data
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\-\s\+\(\)]+$|^$/
  return phoneRegex.test(phone)
}

export const validateURL = (url) => {
  if (!url) return true
  try {
    new URL(`https://${url}`)
    return true
  } catch {
    return false
  }
}

export const validateResume = (resume) => {
  const errors = {}

  if (!resume.name || !resume.name.trim()) {
    errors.name = 'Full name is required'
  }

  if (resume.email && !validateEmail(resume.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!validatePhone(resume.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }

  if (!validateURL(resume.website)) {
    errors.website = 'Please enter a valid website URL'
  }

  return errors
}

/**
 * Storage utilities for save/load functionality
 */

export const saveResume = (resume) => {
  try {
    window.localStorage.setItem('resume-builder-data', JSON.stringify(resume))
    return true
  } catch (error) {
    console.error('Failed to save resume', error)
    return false
  }
}

export const loadResume = () => {
  try {
    const saved = window.localStorage.getItem('resume-builder-data')
    if (saved) {
      return JSON.parse(saved)
    }
    return null
  } catch (error) {
    console.error('Failed to load resume', error)
    return null
  }
}

export const clearResume = () => {
  try {
    window.localStorage.removeItem('resume-builder-data')
    return true
  } catch (error) {
    console.error('Failed to clear resume', error)
    return false
  }
}
