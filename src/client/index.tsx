import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { DesktopPet } from './DesktopPet.js'
import { PetSettings } from './PetSettings.js'
import { styles } from './styles.js'

export const inject = ['slots']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    const existing = document.querySelector('style[data-plugin="dsh-plugin-desktop-pet"]')
    existing?.remove()
    const tag = document.createElement('style')
    tag.dataset.plugin = 'dsh-plugin-desktop-pet'
    tag.textContent = styles
    document.head.appendChild(tag)
    return () => tag.remove()
  }, 'desktop-pet: styles')

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'desktop-pet',
    order: 90,
  }, DesktopPet))

  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'desktop-pet',
    order: 60,
    label: '电子宠物',
  }, PetSettings))
}
