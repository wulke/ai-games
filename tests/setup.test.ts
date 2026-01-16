/**
 * Sample test file to verify Vitest configuration
 */

import { describe, it, expect } from 'vitest'

describe('Vitest Setup', () => {
  it('should run basic assertions', () => {
    expect(true).toBe(true)
    expect(1 + 1).toBe(2)
  })

  it('should handle string operations', () => {
    const greeting = 'Hello, Vitest!'
    expect(greeting).toContain('Vitest')
    expect(greeting.length).toBeGreaterThan(0)
  })

  it('should work with arrays', () => {
    const numbers = [1, 2, 3, 4, 5]
    expect(numbers).toHaveLength(5)
    expect(numbers).toContain(3)
  })
})
