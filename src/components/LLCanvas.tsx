import { useEffect, useRef, useState } from 'react'
import type { LLStep, LLNode as LLNodeType } from '../types'
import './LLCanvas.css'

interface LLCanvasProps {
  step: LLStep
}

const LLNodeComponent = ({ item, index, total, isHead, isTail }: {
  item: LLNodeType
  index: number
  total: number
  isHead: boolean
  isTail: boolean
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  const getNodeClass = () => {
    let cls = 'll-node'
    if (item.isNew) cls += ' node-new'
    if (item.isLeaving) cls += ' node-leaving'
    if (item.isHighlighted) cls += ' node-highlighted'
    if (item.isSearching) cls += ' node-searching'
    if (item.isFound) cls += ' node-found'
    if (!mounted) cls += ' node-entering'
    return cls
  }

  const getNodeStyle = () => {
    return { animationDelay: `${index * 50}ms` }
  }

  return (
    <div className="ll-node-wrapper" style={getNodeStyle()}>
      {/* Head Indicator */}
      {isHead && (
        <div className="ptr-badge head-badge" aria-label="Head of list">
          <div className="ptr-arrow-down" aria-hidden="true" />
          HEAD
        </div>
      )}

      {/* Tail Indicator */}
      {isTail && (
        <div className="ptr-badge tail-badge" aria-label="Tail of list">
          <div className="ptr-arrow-down" aria-hidden="true" />
          TAIL
        </div>
      )}

      {/* The Node structure: Value + Next pointer cell */}
      <div className={getNodeClass()} role="listitem" aria-label={`Node value ${item.value}`}>
        {/* Value cell */}
        <div className="node-val-cell">
          <span className="node-val-text">{item.value}</span>
          <span className="node-idx-text">i={index}</span>
        </div>

        {/* Pointer (next) cell */}
        <div className="node-ptr-cell" aria-label="Next pointer">
          <span className="node-ptr-dot" aria-hidden="true" />
          <span className="node-ptr-text">{index === total - 1 ? 'null' : 'next'}</span>
        </div>

        {/* State badges */}
        {item.isNew && <div className="ll-badge badge-new">NEW</div>}
        {item.isLeaving && <div className="ll-badge badge-leaving">OUT</div>}
        {item.isSearching && <div className="ll-badge badge-search">SCAN</div>}
        {item.isFound && <div className="ll-badge badge-found">MATCH</div>}

        <div className="ll-node-shimmer" aria-hidden="true" />
      </div>

      {/* Arrow pointing to next node */}
      {index < total - 1 && (
        <div className="ll-connector" aria-hidden="true">
          <svg className="connector-svg" width="45" height="20" viewBox="0 0 45 20">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 10 5 L 0 8 z" fill="var(--arrow-color, #06b6d4)" />
              </marker>
            </defs>
            <path d="M 0 10 L 38 10" stroke="var(--arrow-color, #06b6d4)" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray={item.isSearching ? "5, 5" : "none"} className={item.isSearching ? "path-searching" : ""} />
          </svg>
        </div>
      )}
    </div>
  )
}

const LLCanvas = ({ step }: LLCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setAnimKey(k => k + 1)
  }, [step.id])

  const isEmpty = step.nodes.length === 0

  const getOpMsg = () => {
    switch (step.operation) {
      case 'insertHead': return { text: '➔ Inserting node at HEAD', color: '#22d3ee', bg: 'rgba(6, 182, 212, 0.08)', border: 'rgba(6, 182, 212, 0.2)', icon: '+' }
      case 'insertTail': return { text: '➔ Inserting node at TAIL', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.08)', border: 'rgba(167, 139, 250, 0.2)', icon: '+' }
      case 'insertAt': return { text: '➔ Inserting node at index', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.08)', border: 'rgba(251, 146, 60, 0.2)', icon: '➔' }
      case 'deleteHead': return { text: '✕ Removing node from HEAD', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.08)', border: 'rgba(244, 114, 182, 0.2)', icon: '−' }
      case 'deleteTail': return { text: '✕ Removing node from TAIL', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.08)', border: 'rgba(244, 114, 182, 0.2)', icon: '−' }
      case 'search': return { text: '🔍 Searching list sequentially', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.08)', border: 'rgba(251, 146, 60, 0.2)', icon: '?' }
      default: return { text: '◉ Singly Linked List Initialized', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', icon: '○' }
    }
  }

  const msg = getOpMsg()

  return (
    <div className="ll-canvas" ref={canvasRef} role="region" aria-label="Linked List visualization">
      {/* Header Info */}
      <div className="canvas-header">
        <div className="op-message" style={{ color: msg.color, background: msg.bg, border: `1px solid ${msg.border}` }} aria-live="polite" role="status">
          <span className="op-msg-icon" aria-hidden="true">{msg.icon}</span>
          <span>{msg.text}</span>
        </div>
        <div className="canvas-meta">
          <span className="meta-chip">Size: {step.size}</span>
          {step.returnValue !== null && step.returnValue !== undefined && (
            <span className="meta-chip return-chip" style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.2)' }} aria-live="polite">
              → Returns: <strong>{step.returnValue}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Linked List Canvas Display */}
      <div className="ll-display-area" key={animKey}>
        {/* Pointer direction guide */}
        <div className="fifo-guide">
          <div className="fifo-end">
            <div className="fifo-label enqueue-end" style={{ color: '#22d3ee', background: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)' }}>HEAD</div>
          </div>
          <div className="fifo-center">
            <span className="fifo-badge" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.08)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>POINTERS</span>
          </div>
          <div className="fifo-end">
            <div className="fifo-label dequeue-end" style={{ color: '#a78bfa', background: 'rgba(167,139,250,0.08)', borderColor: 'rgba(167,139,250,0.2)' }}>NULL END</div>
          </div>
        </div>

        {/* Nodes list */}
        <div className="ll-track" role="list">
          <div className="ll-container">
            {isEmpty ? (
              <div className="empty-state">
                <div className="empty-icon" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
                  </svg>
                </div>
                <p className="empty-title">Linked List is empty</p>
                <p className="empty-sub">Use head/tail insertions to start →</p>
              </div>
            ) : (
              <div className="ll-nodes-row" role="list" aria-label="Linked List nodes">
                {step.nodes.map((node, idx) => (
                  <LLNodeComponent
                    key={node.id + step.id}
                    item={node}
                    index={idx}
                    total={step.nodes.length}
                    isHead={idx === step.headIndex}
                    isTail={idx === step.tailIndex}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status bar */}
      <div className="canvas-statusbar">
        <div className="status-item">
          <span className="status-label" style={{ color: '#22d3ee' }}>HEAD</span>
          <span className="status-value font-val" style={{ color: '#22d3ee' }}>
            {step.headIndex !== null ? `index ${step.headIndex}` : 'null'}
          </span>
        </div>
        <div className="status-separator" aria-hidden="true" />
        <div className="status-item">
          <span className="status-label" style={{ color: '#a78bfa' }}>TAIL</span>
          <span className="status-value rear-val" style={{ color: '#a78bfa' }}>
            {step.tailIndex !== null ? `index ${step.tailIndex}` : 'null'}
          </span>
        </div>
        <div className="status-separator" aria-hidden="true" />
        <div className="status-item">
          <span className="status-label">SIZE</span>
          <span className="status-value size-val" style={{ color: '#f472b6' }}>
            {step.size}
          </span>
        </div>
        <div className="status-separator" aria-hidden="true" />
        <div className="status-item">
          <span className="status-label">ACTIVE INDEX</span>
          <span className="status-value size-val" style={{ color: '#fb923c' }}>
            {step.activeIndex !== null ? step.activeIndex : '—'}
          </span>
        </div>
        <div className="status-separator" aria-hidden="true" />
        <div className="status-item">
          <span className="status-label">OP</span>
          <span className="status-value op-val op-enqueue" style={{ color: msg.color }}>
            {step.operation.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default LLCanvas
