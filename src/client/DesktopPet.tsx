import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { SessionListState } from '@deepseek-ai/dsh-client-runtime/client'
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'
import { usePetConfig, type PetPosition } from './config.js'
import { DEFAULT_IMAGE } from './default-image.js'

interface TodoItem {
  content: string
  status: 'pending' | 'in_progress' | 'completed'
}

export interface DesktopPetProps {
  useSessions: SnapshotSelectorHook<SessionListState>
}

interface DragState {
  pointerId: number
  startX: number
  startY: number
  origin: PetPosition
}

function todosOf(projectionValues: unknown): TodoItem[] {
  if (projectionValues === null || typeof projectionValues !== 'object') return []
  const todos = (projectionValues as Record<string, unknown>).todos
  if (!Array.isArray(todos)) return []
  return todos.filter((item): item is TodoItem => {
    if (item === null || typeof item !== 'object') return false
    const value = item as Partial<TodoItem>
    return typeof value.content === 'string'
      && (value.status === 'pending' || value.status === 'in_progress' || value.status === 'completed')
  })
}

function clampPosition(position: PetPosition, size: number): PetPosition {
  const width = Math.max(0, window.innerWidth - size - 8)
  const height = Math.max(0, window.innerHeight - size - 74)
  return {
    x: Math.min(width, Math.max(8, position.x)),
    y: Math.min(height, Math.max(42, position.y)),
  }
}

function defaultPosition(size: number): PetPosition {
  return clampPosition({ x: window.innerWidth - size - 28, y: window.innerHeight - size - 96 }, size)
}

export function DesktopPet({ useSessions }: DesktopPetProps): React.JSX.Element | null {
  const [config, update] = usePetConfig()
  const summary = useSessions((state) => state.current === undefined ? null : state.byId[state.current] ?? null)
  const todos = todosOf(summary?.projectionValues)
  const done = todos.filter((item) => item.status === 'completed').length
  const active = todos.find((item) => item.status === 'in_progress')
  const progress = todos.length > 0 ? Math.round(done / todos.length * 100) : 0
  const status = active?.content
    ?? (summary?.running ? '正在工作' : todos.length > 0 && done === todos.length ? '任务完成' : '待命中')
  const [position, setPosition] = useState(() => config.position
    ? clampPosition(config.position, config.size)
    : defaultPosition(config.size))
  const [dragging, setDragging] = useState(false)
  const drag = useRef<DragState | null>(null)

  useEffect(() => {
    setPosition(config.position ? clampPosition(config.position, config.size) : defaultPosition(config.size))
  }, [config.position?.x, config.position?.y, config.size])

  useEffect(() => {
    const onResize = (): void => setPosition((current) => clampPosition(current, config.size))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [config.size])

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>): void => {
    if (event.button !== 0 || (event.target as Element).closest('button')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: position,
    }
    setDragging(true)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>): void => {
    const current = drag.current
    if (current === null || current.pointerId !== event.pointerId) return
    setPosition(clampPosition({
      x: current.origin.x + event.clientX - current.startX,
      y: current.origin.y + event.clientY - current.startY,
    }, config.size))
  }

  const finishDrag = (event: ReactPointerEvent<HTMLElement>): void => {
    const current = drag.current
    if (current === null || current.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    const finalPosition = clampPosition({
      x: current.origin.x + event.clientX - current.startX,
      y: current.origin.y + event.clientY - current.startY,
    }, config.size)
    drag.current = null
    setPosition(finalPosition)
    setDragging(false)
    update({ position: finalPosition })
  }

  if (!config.enabled) return null

  return (
    <section
      className="dshPetRoot"
      style={{ left: position.x, top: position.y, width: config.size }}
      data-motion={config.motion}
      data-dragging={dragging || undefined}
      aria-label={`${config.name}，${status}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      <div className="dshPetBubble" title={status}>{config.name} · {status}</div>
      <div className="dshPetStage">
        <img
          className="dshPetImage"
          src={config.image || DEFAULT_IMAGE}
          alt={config.name}
          draggable={false}
          onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE }}
        />
        <button
          className="dshPetClose"
          type="button"
          title="关闭电子宠物"
          aria-label="关闭电子宠物"
          onClick={() => update({ enabled: false })}
        >×</button>
      </div>
      {config.showProgress && todos.length > 0 ? (
        <div className="dshPetProgress" aria-label={`任务进度 ${done}/${todos.length}`}>
          <div className="dshPetTrack"><div className="dshPetFill" style={{ width: `${progress}%` }} /></div>
          <span className="dshPetCount">{done}/{todos.length}</span>
        </div>
      ) : null}
    </section>
  )
}
