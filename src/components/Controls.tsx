import './Controls.css'

interface ControlsProps {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  onNext: () => void
  onPrev: () => void
  onTogglePlay: () => void
  onReset: () => void
  onSpeedChange: (s: number) => void
}

const speeds = [
  { label: '0.5×', value: 3600 },
  { label: '1×', value: 1800 },
  { label: '1.5×', value: 1200 },
  { label: '2×', value: 900 },
]

const Controls = ({
  currentStep, totalSteps, isPlaying, speed,
  onNext, onPrev, onTogglePlay, onReset, onSpeedChange
}: ControlsProps) => {
  const progress = ((currentStep) / (totalSteps - 1)) * 100

  return (
    <div className="controls-bar" role="toolbar" aria-label="Playback controls">
      {/* Progress bar */}
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="controls-inner">
        {/* Left: Speed */}
        <div className="controls-left" role="group" aria-label="Playback speed">
          <span className="control-group-label" aria-hidden="true">Speed</span>
          <div className="speed-btns">
            {speeds.map(s => (
              <button
                key={s.value}
                id={`speed-btn-${s.label.replace('×', 'x')}`}
                className={`speed-btn ${speed === s.value ? 'active' : ''}`}
                onClick={() => onSpeedChange(s.value)}
                aria-pressed={speed === s.value}
                aria-label={`Set speed to ${s.label}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Main Controls */}
        <div className="controls-center" role="group" aria-label="Navigation controls">
          <button
            id="ctrl-reset"
            className="ctrl-btn ctrl-secondary"
            onClick={onReset}
            disabled={currentStep === 0 && !isPlaying}
            aria-label="Reset to beginning"
            title="Reset"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 12a9 9 0 109-9H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 7v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            id="ctrl-prev"
            className="ctrl-btn ctrl-secondary"
            onClick={onPrev}
            disabled={currentStep === 0}
            aria-label="Previous step"
            title="Previous Step"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            id="ctrl-play"
            className={`ctrl-btn ctrl-primary ${isPlaying ? 'playing' : ''}`}
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
              </svg>
            )}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            id="ctrl-next"
            className="ctrl-btn ctrl-secondary"
            onClick={onNext}
            disabled={currentStep === totalSteps - 1}
            aria-label="Next step"
            title="Next Step"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Right: Step indicator */}
        <div className="controls-right" aria-label="Step progress">
          <span className="step-info-text" aria-live="polite">
            Step <strong>{currentStep + 1}</strong> / {totalSteps}
          </span>
          <div className="step-dots" role="list" aria-label="Step indicators">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                id={`step-dot-${i}`}
                role="listitem"
                className={`step-dot ${i === currentStep ? 'dot-current' : i < currentStep ? 'dot-done' : 'dot-future'}`}
                onClick={() => {/* handled by StepTimeline */}}
                aria-label={`Step ${i + 1}`}
                aria-current={i === currentStep ? 'step' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controls
