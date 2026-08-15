import { useCallback, useEffect, useState } from 'react'

export const STORAGE_KEY = 'dsh.desktop-pet.config.v1'
export const CHANGE_EVENT = 'dsh-desktop-pet/change'
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export type PetMotion = 'none' | 'float' | 'bounce'

export interface PetPosition {
  x: number
  y: number
}

export interface PetConfig {
  enabled: boolean
  name: string
  size: number
  motion: PetMotion
  showProgress: boolean
  image: string
  position: PetPosition | null
}

export const DEFAULT_CONFIG: Readonly<PetConfig> = Object.freeze({
  enabled: true,
  name: '小助手',
  size: 128,
  motion: 'float',
  showProgress: true,
  image: '',
  position: null,
})

export function sanitizeConfig(value: unknown): PetConfig {
  const source = value !== null && typeof value === 'object' ? value as Partial<PetConfig> : {}
  const position = source.position
  const validPosition = position !== null
    && typeof position === 'object'
    && Number.isFinite(position.x)
    && Number.isFinite(position.y)
      ? { x: position.x, y: position.y }
      : null
  const name = typeof source.name === 'string' ? source.name.trim().slice(0, 24) : ''
  const size = Number(source.size)

  return {
    enabled: typeof source.enabled === 'boolean' ? source.enabled : DEFAULT_CONFIG.enabled,
    name: name || DEFAULT_CONFIG.name,
    size: Math.min(200, Math.max(96, Number.isFinite(size) ? size : DEFAULT_CONFIG.size)),
    motion: source.motion === 'none' || source.motion === 'float' || source.motion === 'bounce'
      ? source.motion
      : DEFAULT_CONFIG.motion,
    showProgress: typeof source.showProgress === 'boolean' ? source.showProgress : DEFAULT_CONFIG.showProgress,
    image: typeof source.image === 'string' && source.image.startsWith('data:image/') ? source.image : '',
    position: validPosition,
  }
}

export function readConfig(storage: Pick<Storage, 'getItem'> = localStorage): PetConfig {
  try {
    return sanitizeConfig(JSON.parse(storage.getItem(STORAGE_KEY) || '{}'))
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export function writeConfig(value: unknown, storage: Pick<Storage, 'setItem'> = localStorage): PetConfig {
  const config = sanitizeConfig(value)
  storage.setItem(STORAGE_KEY, JSON.stringify(config))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<PetConfig>(CHANGE_EVENT, { detail: config }))
  }
  return config
}

export function usePetConfig(): readonly [PetConfig, (patch: Partial<PetConfig>) => PetConfig] {
  const [config, setConfig] = useState(readConfig)

  useEffect(() => {
    const onChange = (event: Event): void => {
      setConfig(sanitizeConfig((event as CustomEvent<PetConfig>).detail))
    }
    const onStorage = (event: StorageEvent): void => {
      if (event.key === STORAGE_KEY) setConfig(readConfig())
    }
    window.addEventListener(CHANGE_EVENT, onChange)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const update = useCallback((patch: Partial<PetConfig>): PetConfig => {
    const next = writeConfig({ ...readConfig(), ...patch })
    setConfig(next)
    return next
  }, [])

  return [config, update] as const
}
