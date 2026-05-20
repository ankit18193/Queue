import type { LLStep } from '../types'
import './StepTimeline.css'

interface LLStepTimelineProps {
  steps: LLStep[]
  currentStep: number
  onStepSelect: (i: number) => void
}

const opColors: Record<string, string> = {
  idle: 'timeline-idle',
  insertHead: 'timeline-enqueue',
  insertTail: 'timeline-enqueue',
  insertAt: 'timeline-enqueue',
  deleteHead: 'timeline-dequeue',
  deleteTail: 'timeline-dequeue',
  search: 'timeline-peek',
}

const opIcons: Record<string, string> = {
  idle: '○',
  insertHead: '+',
  insertTail: '+',
  insertAt: '+',
  deleteHead: '−',
  deleteTail: '−',
  search: '🔍',
}

const LLStepTimeline = ({ steps, currentStep, onStepSelect }: LLStepTimelineProps) => {
  return (
    <div className="step-timeline ll-step-timeline" role="navigation" aria-label="Step navigation timeline">
      <div className="timeline-label" aria-hidden="true">Steps</div>
      <div className="timeline-track" role="list">
        {steps.map((step, idx) => {
          const isPast = idx < currentStep
          const isCurrent = idx === currentStep
          const isFuture = idx > currentStep

          return (
            <button
              key={step.id}
              id={`ll-step-btn-${idx}`}
              role="listitem"
              className={`timeline-step ${opColors[step.operation]} ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`}
              onClick={() => onStepSelect(idx)}
              aria-label={`Step ${idx + 1}: ${step.description}${isCurrent ? ' (current)' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              title={step.description}
            >
              <div className="step-icon" aria-hidden="true">
                {isPast ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span>{opIcons[step.operation]}</span>
                )}
              </div>
              <div className="step-desc">{step.description}</div>
              {idx < steps.length - 1 && (
                <div className={`timeline-connector ${isPast ? 'connector-done' : ''}`} aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default LLStepTimeline
