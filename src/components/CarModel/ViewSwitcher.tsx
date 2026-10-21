import { CAMERA_VIEWS } from './cameraViews'

type ViewSwitcherProps = {
  index: number
  freeLook: boolean
  onChange: (index: number) => void
  onToggleFree: () => void
}

export function ViewSwitcher({ index, freeLook, onChange, onToggleFree }: ViewSwitcherProps) {
  const count = CAMERA_VIEWS.length
  const prev = () => onChange((index - 1 + count) % count)
  const next = () => onChange((index + 1) % count)

  return (
    <div className="view-switcher" role="group" aria-label="Camera views">
      <button type="button" className="view-arrow" onClick={prev} aria-label="Previous view">
        ‹
      </button>
      <div className="view-dots">
        {CAMERA_VIEWS.map((view, i) => (
          <button
            key={view.id}
            type="button"
            className={`view-dot ${!freeLook && i === index ? 'is-active' : ''}`}
            aria-label={view.label}
            aria-current={!freeLook && i === index}
            onClick={() => onChange(i)}
          />
        ))}
      </div>
      <button type="button" className="view-arrow" onClick={next} aria-label="Next view">
        ›
      </button>
      <button
        type="button"
        className={`view-orbit ${freeLook ? 'is-active' : ''}`}
        aria-pressed={freeLook}
        onClick={onToggleFree}
      >
        Orbit
      </button>
    </div>
  )
}
