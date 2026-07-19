import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  validateEmail,
  validatePhone,
  validateURL,
  validateResume,
  saveResume,
  loadResume,
  clearResume
} from './utils'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('first+last@test.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('invalid@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@.com')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('(555) 123-4567')).toBe(true)
      expect(validatePhone('555-123-4567')).toBe(true)
      expect(validatePhone('+1 555 123 4567')).toBe(true)
      expect(validatePhone('')).toBe(true) // Empty is allowed
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('abc-def-ghij')).toBe(false)
      expect(validatePhone('555 abc 4567')).toBe(false)
    })
  })

  describe('validateURL', () => {
    it('should validate correct URLs', () => {
      expect(validateURL('example.com')).toBe(true)
      expect(validateURL('github.com/user')).toBe(true)
      expect(validateURL('portfolio.dev')).toBe(true)
      expect(validateURL('')).toBe(true) // Empty is allowed
    })

    it('should reject invalid URLs', () => {
      expect(validateURL('not a url at all')).toBe(false)
      expect(validateURL('http://')).toBe(false)
    })
  })

  describe('validateResume', () => {
    it('should return no errors for valid resume', () => {
      const validResume = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        website: 'example.com'
      }
      expect(validateResume(validResume)).toEqual({})
    })

    it('should require name field', () => {
      const resume = { name: '', email: 'test@example.com', phone: '', website: '' }
      const errors = validateResume(resume)
      expect(errors.name).toBeDefined()
    })

    it('should validate email field', () => {
      const resume = { name: 'John', email: 'invalid', phone: '', website: '' }
      const errors = validateResume(resume)
      expect(errors.email).toBeDefined()
    })

    it('should validate phone field', () => {
      const resume = { name: 'John', email: '', phone: 'abc-def', website: '' }
      const errors = validateResume(resume)
      expect(errors.phone).toBeDefined()
    })
  })
})

describe('Storage Utils', () => {
  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      data: {},
      getItem(key) {
        return this.data[key] || null
      },
      setItem(key, value) {
        this.data[key] = value
      },
      removeItem(key) {
        delete this.data[key]
      },
      clear() {
        this.data = {}
      }
    }
  })

  afterEach(() => {
    clearResume()
  })

  describe('saveResume', () => {
    it('should save resume to localStorage', () => {
      const resume = { name: 'Jane Doe', email: 'jane@example.com' }
      const result = saveResume(resume)
      expect(result).toBe(true)
      expect(global.localStorage.getItem('resume-builder-data')).toBe(JSON.stringify(resume))
    })

    it('should handle save errors gracefully', () => {
      global.localStorage.setItem = () => {
        throw new Error('Storage full')
      }
      const resume = { name: 'Jane' }
      const result = saveResume(resume)
      expect(result).toBe(false)
    })
  })

  describe('loadResume', () => {
    it('should load resume from localStorage', () => {
      const resume = { name: 'Jane Doe', email: 'jane@example.com' }
      saveResume(resume)
      const loaded = loadResume()
      expect(loaded).toEqual(resume)
    })

    it('should return null if no resume saved', () => {
      const loaded = loadResume()
      expect(loaded).toBeNull()
    })

    it('should handle load errors gracefully', () => {
      global.localStorage.setItem('resume-builder-data', 'invalid json')
      const loaded = loadResume()
      expect(loaded).toBeNull()
    })
  })

  describe('clearResume', () => {
    it('should clear saved resume', () => {
      const resume = { name: 'Jane Doe' }
      saveResume(resume)
      expect(loadResume()).toEqual(resume)
      clearResume()
      expect(loadResume()).toBeNull()
    })

    it('should return true on success', () => {
      saveResume({ name: 'Jane' })
      const result = clearResume()
      expect(result).toBe(true)
    })
  })
})
