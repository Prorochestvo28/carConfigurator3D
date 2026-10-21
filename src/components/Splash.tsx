type SplashProps = {
  fading?: boolean
}

export function Splash({ fading = false }: SplashProps) {
  return (
    <div className={`splash ${fading ? 'is-out' : ''}`} aria-busy="true" aria-label="Loading">
      <p className="splash-mark">
        <span className="splash-mark-text">X90</span>
        <span className="splash-sheen" aria-hidden>
          X90
        </span>
      </p>
    </div>
  )
}
