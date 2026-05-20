import { useState } from 'react'
import type { LLStep } from '../types'
import LLCanvas from './LLCanvas'
import LLCodePanel from './LLCodePanel'
import LLStepTimeline from './LLStepTimeline'
import Controls from './Controls'
import './VisualizerPanel.css'

interface LLVisualizerPanelProps {
  step: LLStep
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  steps: LLStep[]
  onNext: () => void
  onPrev: () => void
  onTogglePlay: () => void
  onReset: () => void
  onSpeedChange: (s: number) => void
  onStepSelect: (i: number) => void
}

type ViewMode = 'visual' | 'code' | 'split'

const LLVisualizerPanel = ({
  step, currentStep, totalSteps, isPlaying, speed, steps,
  onNext, onPrev, onTogglePlay, onReset, onSpeedChange, onStepSelect
}: LLVisualizerPanelProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split')

  return (
    <section className="visualizer-panel ll-viz-panel" aria-label="Linked List Visualizer">
      {/* Top Bar */}
      <div className="viz-topbar">
        <div className="viz-topbar-left">
          <div className="viz-title">
            <span className="viz-title-icon" style={{ color: '#22d3ee' }} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Linked List Visualizer</span>
          </div>
          <div className="step-counter" aria-label={`Step ${currentStep + 1} of ${totalSteps}`}>
            <span className="step-num" style={{ color: '#8b5cf6' }}>{currentStep + 1}</span>
            <span className="step-sep">/</span>
            <span className="step-total">{totalSteps}</span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="view-mode-toggle" role="group" aria-label="View mode">
          {(['visual', 'split', 'code'] as const).map(mode => (
            <button
              key={mode}
              id={`ll-view-mode-${mode}`}
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
            <LLCanvas step={step} />
          </div>
        )}

        {/* Code Panel */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div className="code-area">
            <LLCodePanel step={step} />
          </div>
        )}
      </div>

      {/* Step Timeline */}
      <LLStepTimeline
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

export default LLVisualizerPanel
