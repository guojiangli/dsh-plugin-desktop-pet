import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG, MAX_IMAGE_BYTES, readConfig, sanitizeConfig, STORAGE_KEY, writeConfig } from '../src/client/config.js'

class MemoryStorage {
  private readonly values = new Map<string, string>()
  getItem(key: string): string | null { return this.values.get(key) ?? null }
  setItem(key: string, value: string): void { this.values.set(key, value) }
}

describe('desktop pet config', () => {
  it('applies defaults to malformed input', () => {
    expect(sanitizeConfig(null)).toEqual(DEFAULT_CONFIG)
    expect(sanitizeConfig({ size: 10, motion: 'spin', image: 'https://example.com/pet.png' })).toMatchObject({
      size: 96,
      motion: 'float',
      image: '',
    })
  })

  it('clamps and normalizes user values', () => {
    expect(sanitizeConfig({
      enabled: false,
      name: '  My Pet  ',
      size: 999,
      motion: 'bounce',
      showProgress: false,
      image: 'data:image/png;base64,abc',
      position: { x: 20, y: 30 },
    })).toEqual({
      enabled: false,
      name: 'My Pet',
      size: 200,
      motion: 'bounce',
      showProgress: false,
      image: 'data:image/png;base64,abc',
      position: { x: 20, y: 30 },
    })
  })

  it('round-trips through storage', () => {
    const storage = new MemoryStorage()
    writeConfig({ ...DEFAULT_CONFIG, name: 'Tester' }, storage)
    expect(storage.getItem(STORAGE_KEY)).toContain('Tester')
    expect(readConfig(storage).name).toBe('Tester')
  })

  it('keeps the documented image limit stable', () => {
    expect(MAX_IMAGE_BYTES).toBe(2 * 1024 * 1024)
  })
})
