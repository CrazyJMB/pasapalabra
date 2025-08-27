import { describe, it, expect } from 'vitest'
import {
  validateGameName,
  validateTimeLimit
} from '@/utils/validation'

describe('Validation Utils', () => {
  describe('validateGameName', () => {
    it('should validate correct game names', () => {
      const result = validateGameName('Morning Game')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject empty names', () => {
      const result = validateGameName('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Game name is required')
    })

    it('should reject names with only spaces', () => {
      const result = validateGameName('   ')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Game name must have at least 3 characters')
    })

    it('should reject names shorter than 3 characters', () => {
      const result = validateGameName('AB')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Game name must have at least 3 characters')
    })

    it('should reject names longer than 50 characters', () => {
      const longName = 'A'.repeat(51)
      const result = validateGameName(longName)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Game name cannot exceed 50 characters')
    })

    it('should accept names with exactly 3 characters', () => {
      const result = validateGameName('ABC')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept names with exactly 50 characters', () => {
      const longName = 'A'.repeat(50)
      const result = validateGameName(longName)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('validateTimeLimit', () => {
    it('should validate correct time limits', () => {
      const result = validateTimeLimit(300)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject zero time', () => {
      const result = validateTimeLimit(0)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Time limit must be greater than 0')
    })

    it('should reject negative time', () => {
      const result = validateTimeLimit(-10)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Time limit must be greater than 0')
    })

    it('should reject time less than 60 seconds', () => {
      const result = validateTimeLimit(30)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Time limit must be at least 1 minute (60 seconds)')
    })

    it('should reject time greater than 3600 seconds', () => {
      const result = validateTimeLimit(4000)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Time limit cannot exceed 1 hour (3600 seconds)')
    })

    it('should accept exactly 60 seconds', () => {
      const result = validateTimeLimit(60)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept exactly 3600 seconds', () => {
      const result = validateTimeLimit(3600)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept time between 60 and 3600 seconds', () => {
      const result = validateTimeLimit(1800)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })
}) 