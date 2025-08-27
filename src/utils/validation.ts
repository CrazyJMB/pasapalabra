import type { ValidationResult } from '@/types'

export function validateGameName(name: string): ValidationResult {
  const errors: string[] = []
  
  if (!name || name.trim().length === 0) {
    errors.push('Game name is required')
  }
  
  if (name.length > 50) {
    errors.push('Game name cannot exceed 50 characters')
  }
  
  if (name.trim().length < 3) {
    errors.push('Game name must have at least 3 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateTimeLimit(time: number): ValidationResult {
  const errors: string[] = []
  
  if (time <= 0) {
    errors.push('Time limit must be greater than 0')
  }
  
  if (time > 3600) {
    errors.push('Time limit cannot exceed 1 hour (3600 seconds)')
  }
  
  if (time < 60) {
    errors.push('Time limit must be at least 1 minute (60 seconds)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
} 