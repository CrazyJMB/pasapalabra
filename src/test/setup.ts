import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}

// Mock window methods
Object.defineProperty(window, 'addEventListener', {
  value: vi.fn()
})

Object.defineProperty(window, 'removeEventListener', {
  value: vi.fn()
})

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: vi.fn(() => 'mocked-url')
})

Object.defineProperty(URL, 'revokeObjectURL', {
  value: vi.fn()
})

// Mock document methods
Object.defineProperty(document, 'createElement', {
  value: vi.fn(() => ({
    click: vi.fn(),
    href: '',
    download: ''
  }))
})

Object.defineProperty(document.body, 'appendChild', {
  value: vi.fn()
})

Object.defineProperty(document.body, 'removeChild', {
  value: vi.fn()
}) 