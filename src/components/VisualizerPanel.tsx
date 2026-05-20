import { useState } from 'react'
import type { QueueStep } from '../types'
import QueueCanvas from './QueueCanvas'
import CodePanel from './CodePanel'
import StepTimeline from './StepTimeline'
import Controls from './Controls'
import './VisualizerPanel.css'

interface VisualizerPanelProps {
  step: QueueStep
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  steps: QueueStep[]
  onNext: () => void
  onPrev: () => void
  onTogglePlay: () => void
  onReset: () => void
  onSpeedChange: (s: number) => void
  onStepSelect: (i: number) => void
}

type ViewMode = 'visual' | 'code' | 'split'

const VisualizerPanel = ({
  step, currentStep, totalSteps, isPlaying, speed, steps,
  onNext, onPrev, onTogglePlay, onReset, onSpeedChange, onStepSelect
}: VisualizerPanelProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split')

  return (
    <section className="visualizer-panel" aria-label="Queue Visualizer">
      {/* Top Bar */}
      <div className="viz-topbar">
        <div className="viz-topbar-left">
          <div className="viz-title">
            <span className="viz-title-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="8" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span>Queue Visualizer</span>
          </div>
          <div className="step-counter" aria-label={`Step ${currentStep + 1} of ${totalSteps}`}>
            <span className="step-num">{currentStep + 1}</span>
            <span className="step-sep">/</span>
            <span className="step-total">{totalSteps}</span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="view-mode-toggle" role="group" aria-label="View mode">
          {(['visual', 'split', 'code'] as const).map(mode => (
            <button
              key={mode}
              id={`view-mode-${mode}`}
              className={`view-mode-btn ${viewMode === mode ? 'active' : ''}`}
              onClick={() => setViewMode(mode)}
              aria-pressed={viewMode === mode}
              aria-label={`${mode} view`}
            >
              {mode === 'visual' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
              {mode === 'split' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="18" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="18" rx="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
              {mode === 'code' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h3M16 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3M9 12h6M9 8h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
              <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Operation Indicator */}
        <div className={`op-indicator op-${step.operation}`} aria-live="polite" aria-label={`Operation: ${step.description}`}>
          <div className="op-dot" aria-hidden="true" />
          <span>{step.description}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`viz-content view-${viewMode}`}>
        {/* Visual Canvas */}
        {(viewMode === 'visual' || viewMode === 'split') && (
          <div className="canvas-area">
            <QueueCanvas step={step} />
          </div>
        )}

        {/* Code Panel */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div className="code-area">
            <CodePanel step={step} />
          </div>
        )}
      </div>

      {/* Step Timeline */}
      <StepTimeline
        steps={steps}
        currentStep={currentStep}
        onStepSelect={onStepSelect}
      />

      {/* Controls */}
      <Controls
        currentStep={currentStep}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        speed={speed}
        onNext={onNext}
        onPrev={onPrev}
        onTogglePlay={onTogglePlay}
        onReset={onReset}
        onSpeedChange={onSpeedChange}
      />
    </section>
  )
}

export default VisualizerPanel
