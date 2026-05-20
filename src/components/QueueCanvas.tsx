import { useEffect, useRef, useState } from 'react'
import type { QueueStep, QueueItem } from '../types'
import './QueueCanvas.css'

interface QueueCanvasProps {
  step: QueueStep
}

const QueueNode = ({ item, index, total }: {
  item: QueueItem
  index: number
  total: number
}) => {
  const [mounted, setMounted] = useState(false)
  const isFirst = index === 0
  const isLast = index === total - 1

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  const getNodeClass = () => {
    let cls = 'queue-node'
    if (item.isNew) cls += ' node-new'
    if (item.isLeaving) cls += ' node-leaving'
    if (item.isHighlighted) cls += ' node-highlighted'
    if (!mounted) cls += ' node-entering'
    return cls
  }

  const getNodeStyle = () => {
    return { animationDelay: `${index * 50}ms` }
  }

  return (
    <div className="node-wrapper" style={getNodeStyle()}>
      {/* Front Label */}
      {isFirst && (
        <div className="pointer-label-badge front-badge" aria-label="Front of queue">
          <div className="pointer-arrow-up" aria-hidden="true" />
          FRONT
        </div>
      )}

      {/* Rear Label */}
      {isLast && total > 1 && (
        <div className="pointer-label-badge rear-badge" aria-label="Rear of queue">
          <div className="pointer-arrow-up" aria-hidden="true" />
          REAR
        </div>
      )}

      {isFirst && isLast && total === 1 && (
        <div className="pointer-label-badge both-badge" aria-label="Front and rear of queue">
          <div className="pointer-arrow-up" aria-hidden="true" />
          FRONT / REAR
        </div>
      )}

      {/* The Node */}
      <div className={getNodeClass()} role="listitem" aria-label={`Queue element ${item.value}`}>
        <div className="node-value">{item.value}</div>
        <div className="node-index">
          <span>i={index}</span>
        </div>
        {item.isNew && (
          <div className="node-badge enqueue-badge" aria-label="Newly enqueued">NEW</div>
        )}
        {item.isLeaving && (
          <div className="node-badge dequeue-badge" aria-label="Being dequeued">OUT</div>
        )}
        {item.isHighlighted && (
          <div className="node-badge peek-badge" aria-label="Being peeked">PEEK</div>
        )}
        {/* Shimmer overlay */}
        <div className="node-shimmer" aria-hidden="true" />
      </div>

      {/* Arrow to next */}
      {!isLast && (
        <div className="node-connector" aria-hidden="true">
          <div className="connector-line" />
          <div className="connector-arrow" />
        </div>
      )}
    </div>
  )
}

const QueueCanvas = ({ step }: QueueCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setAnimKey(k => k + 1)
  }, [step.id])

  const isEmpty = step.queueState.length === 0

  const getOperationMessage = () => {
    switch (step.operation) {
      case 'enqueue': return {
        text: '→ Inserting at REAR',
        color: 'var(--accent-green)',
        bg: 'rgba(52, 211, 153, 0.08)',
        border: 'rgba(52, 211, 153, 0.2)',
        icon: '+'
      }
      case 'dequeue': return {
        text: '← Removing from FRONT',
        color: 'var(--accent-red)',
        bg: 'rgba(248, 113, 113, 0.08)',
        border: 'rgba(248, 113, 113, 0.2)',
        icon: '−'
      }
      case 'peek': return {
        text: '👁 Inspecting FRONT (no removal)',
        color: 'var(--accent-yellow)',
        bg: 'rgba(251, 191, 36, 0.08)',
        border: 'rgba(251, 191, 36, 0.2)',
        icon: '?'
      }
      default: return {
        text: '◉ Queue Initialized',
        color: 'var(--text-muted)',
        bg: 'rgba(255,255,255,0.03)',
        border: 'rgba(255,255,255,0.06)',
        icon: '○'
      }
    }
  }

  const msg = getOperationMessage()

  return (
    <div className="queue-canvas" ref={canvasRef} role="region" aria-label="Queue visualization">
      {/* Canvas header with operation info */}
      <div className="canvas-header">
        <div
          className="op-message"
          style={{ color: msg.color, background: msg.bg, border: `1px solid ${msg.border}` }}
          aria-live="polite"
          role="status"
        >
          <span className="op-msg-icon" aria-hidden="true">{msg.icon}</span>
          <span>{msg.text}</span>
        </div>
        <div className="canvas-meta">
          <span className="meta-chip">Size: {step.queueState.length}</span>
          {step.returnValue !== null && step.returnValue !== undefined && (
            <span className="meta-chip return-chip" aria-live="polite">
              → Returns: <strong>{step.returnValue}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main queue display area */}
      <div className="queue-display-area" key={animKey}>
        {/* FIFO label */}
        <div className="fifo-guide" aria-label="Queue direction guide">
          <div className="fifo-end">
            <div className="fifo-label enqueue-end">ENQUEUE (REAR)</div>
            <div className="fifo-arrow-right" aria-hidden="true">→</div>
          </div>
          <div className="fifo-center">
            <span className="fifo-badge">FIFO</span>
          </div>
          <div className="fifo-end">
            <div className="fifo-arrow-left" aria-hidden="true">←</div>
            <div className="fifo-label dequeue-end">DEQUEUE (FRONT)</div>
          </div>
        </div>

        {/* Queue Track */}
        <div className="queue-track" aria-label="Queue elements" role="list">
          {/* Queue Container */}
          <div className="queue-container">
            {isEmpty ? (
              <div className="empty-state" aria-label="Queue is empty">
                <div className="empty-icon" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2"/>
                  </svg>
                </div>
                <p className="empty-title">Queue is empty</p>
                <p className="empty-sub">Start by enqueuing elements →</p>
              </div>
            ) : (
              <div className="nodes-row" role="list" aria-label="Queue elements from front to rear">
                {step.queueState.map((item, idx) => (
                  <QueueNode
                    key={item.id + step.id}
                    item={item}
                    index={idx}
                    total={step.queueState.length}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Queue boundary markers */}
          {!isEmpty && (
            <>
              <div className="boundary-marker front-marker" aria-hidden="true">
                <div className="boundary-line" />
                <span className="boundary-text">FRONT</span>
              </div>
              <div className="boundary-marker rear-marker" aria-hidden="true">
                <div className="boundary-line" />
                <span className="boundary-text">REAR</span>
              </div>
            </>
          )}
        </div>

        {/* Operation animation overlay for enqueue */}
        {step.operation === 'enqueue' && !isEmpty && (
          <div className="enqueue-animation" aria-hidden="true">
            <div className="enqueue-arrow-container">
              <div className="enqueue-arrow-line" />
              <div className="enqueue-arrow-head" />
              <span className="enqueue-label">enqueue({step.queueState[step.queueState.length - 1]?.value})</span>
            </div>
          </div>
        )}

        {/* Operation animation overlay for dequeue */}
        {step.operation === 'dequeue' && (
          <div className="dequeue-animation" aria-hidden="true">
            <div className="dequeue-arrow-container">
              <div className="dequeue-arrow-line" />
              <div className="dequeue-arrow-head" />
              <span className="dequeue-label">← dequeued: {step.returnValue}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="canvas-statusbar" role="status" aria-live="polite">
        <div className="status-item">
          <span className="status-label">FRONT</span>
          <span className="status-value front-val" aria-label={`Front index: ${step.front !== null ? step.front : 'null'}`}>
            {step.front !== null ? step.front : '—'}
          </span>
        </div>
        <div className="status-separator" aria-hidden="true" />
        <div className="status-item">
          <span className="status-label">REAR</span>
          <span className="status-value rear-val" aria-label={`Rear index: ${step.rear !== null ? step.rear : 'null'}`}>
            {step.rear !== null ? step.rear : '—'}
          </span>
        </div>
        <div className="status-separator" aria-hidden="true" />
        <div className="status-item">
          <span className="status-label">SIZE</span>
          <span className="status-value size-val" aria-label={`Queue size: ${step.queueState.length}`}>
            {step.queueState.length}
          </span>
        </div>
        <div className="status-separator" aria-hidden="true" />
        <div className="status-item">
          <span className="status-label">EMPTY</span>
          <span className={`status-value bool-val ${isEmpty ? 'bool-true' : 'bool-false'}`}
            aria-label={`Queue is ${isEmpty ? 'empty' : 'not empty'}`}>
            {isEmpty ? 'true' : 'false'}
          </span>
        </div>
        <div className="status-separator" aria-hidden="true" />
        <div className="status-item">
          <span className="status-label">OP</span>
          <span className={`status-value op-val op-${step.operation}`} aria-label={`Operation: ${step.operation}`}>
            {step.operation.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default QueueCanvas
