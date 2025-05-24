import { describe, expect, it } from 'vitest'

const canConfigure = (from: string, to: string) => {
  if (typeof from !== 'string') throw new Error('first parameter is not a string')
  if (typeof to !== 'string') throw new Error('second parameter is not a string')

  const isSameLength = from.length === to.length
  if (!isSameLength) return false

  const hasSameUniqueLetters = new Set(from).size === new Set(to).size
  if (!hasSameUniqueLetters) return false

  const transformations: Record<string, string> = {}

  for (let i = 0; i < from.length; i++) {
    const fromLetter = from[i]
    const toLetter = to[i]

    const storedLetter = transformations[fromLetter]
    if (storedLetter && storedLetter !== toLetter) return false

    transformations[fromLetter] = toLetter
  }
  return true
}

describe('canConfigure', () => {
  it('should be a function', () => {
    expect(canConfigure).toBeTypeOf('function')
  })

  it('throw error if first parameter is not a string', () => {
    expect(() => canConfigure(2, 'r')).toThrow()
  })

  it('throw error if second parameter is not a string', () => {
    expect(() => canConfigure('r', 2)).toThrow()
  })

  it('should return a boolean', () => {
    expect(canConfigure('rrr', 'rtr')).toBeTypeOf('boolean')
  })

  it('should return false if strings provided have different length', () => {
    expect(canConfigure('rr', 'rtt')).toBe(false)
  })

  it('should return false if strings provided have different length even with same unique letters', () => {
    expect(canConfigure('aab', 'ab')).toBe(false)
  })

  it('should return false if strings provided have different number of unique letters', () => {
    expect(canConfigure('rtg', 'rtt')).toBe(false)
  })

  it('should return false if strings have different order of transformation', () => {
    expect(canConfigure('XBOX', 'XXBO')).toBe(false)
  })
})
