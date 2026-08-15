import { useEffect, useState, type ChangeEvent } from 'react'
import { DEFAULT_CONFIG, MAX_IMAGE_BYTES, usePetConfig } from './config.js'
import { DEFAULT_IMAGE } from './default-image.js'

interface Message {
  text: string
  error: boolean
}

export function PetSettings(): React.JSX.Element {
  const [config, update] = usePetConfig()
  const [nameDraft, setNameDraft] = useState(config.name)
  const [message, setMessage] = useState<Message>({
    text: '支持 PNG、JPEG、WebP、GIF，最大 2 MB',
    error: false,
  })

  useEffect(() => setNameDraft(config.name), [config.name])

  const commitName = (): void => {
    const name = nameDraft.trim() || DEFAULT_CONFIG.name
    setNameDraft(name)
    update({ name })
  }

  const onFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage({ text: '请选择图片文件', error: true })
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setMessage({ text: '图片不能超过 2 MB', error: true })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      try {
        update({ image: reader.result })
        setMessage({ text: `已使用 ${file.name}`, error: false })
      } catch {
        setMessage({ text: '浏览器存储空间不足，请换一张更小的图片', error: true })
      }
    }
    reader.onerror = () => setMessage({ text: '图片读取失败', error: true })
    reader.readAsDataURL(file)
  }

  return (
    <section className="dshPetSettings">
      <header className="dshPetSettingsHeader">
        <div>
          <h3>桌面电子宠物</h3>
          <p>显示在工作区上方，并跟随当前任务列表展示进度。</p>
        </div>
        <label className="dshPetSwitch">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(event) => update({ enabled: event.target.checked })}
          />
          <span>{config.enabled ? '已打开' : '已关闭'}</span>
        </label>
      </header>

      <div className="dshPetSettingsGrid">
        <div className="dshPetFields">
          <label className="dshPetField">
            <span>宠物名称</span>
            <input
              type="text"
              maxLength={24}
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              onBlur={commitName}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur()
              }}
            />
          </label>

          <label className="dshPetField">
            <span>显示尺寸</span>
            <div className="dshPetRangeRow">
              <input
                type="range"
                min={96}
                max={200}
                step={4}
                value={config.size}
                onChange={(event) => update({ size: Number(event.target.value) })}
              />
              <output>{config.size}px</output>
            </div>
          </label>

          <label className="dshPetField">
            <span>待机动效</span>
            <select value={config.motion} onChange={(event) => update({ motion: event.target.value as typeof config.motion })}>
              <option value="float">轻轻漂浮</option>
              <option value="bounce">活力跳动</option>
              <option value="none">关闭动效</option>
            </select>
          </label>

          <label className="dshPetCheck">
            <input
              type="checkbox"
              checked={config.showProgress}
              onChange={(event) => update({ showProgress: event.target.checked })}
            />
            <span>显示任务进度条</span>
          </label>

          <button className="dshPetButton" type="button" onClick={() => update({ position: null })}>
            恢复默认位置
          </button>
        </div>

        <div className="dshPetPreview">
          <img
            src={config.image || DEFAULT_IMAGE}
            alt="电子宠物图片预览"
            onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE }}
          />
          <div className="dshPetActions">
            <label className="dshPetUpload">
              <span>上传图片</span>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onFile} />
            </label>
            <button
              className="dshPetButton"
              type="button"
              disabled={!config.image}
              onClick={() => {
                update({ image: '' })
                setMessage({ text: '已恢复默认形象', error: false })
              }}
            >
              恢复默认图片
            </button>
          </div>
          <p className="dshPetHint" data-error={message.error || undefined} role={message.error ? 'alert' : undefined}>
            {message.text}
          </p>
        </div>
      </div>
    </section>
  )
}
