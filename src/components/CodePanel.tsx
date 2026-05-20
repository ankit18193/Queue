import type { QueueStep } from '../types'
import './CodePanel.css'

interface CodePanelProps {
  step: QueueStep
}

const FULL_IMPLEMENTATION = `class Queue {
  constructor() {
    this.items = [];
    this.front = null;
    this.rear  = null;
  }

  // Add element to rear → O(1)
  enqueue(value) {
    this.items.push(value);
    this.rear = this.items.length - 1;
    if (this.front === null) {
      this.front = 0;
    }
  }

  // Remove element from front → O(1)
  dequeue() {
    if (this.isEmpty()) return null;
    const removed = this.items.shift();
    if (this.items.length === 0) {
      this.front = null;
      this.rear  = null;
    }
    return removed;
  }

  // View front element → O(1)
  peek() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  // Check if queue is empty → O(1)
  isEmpty() {
    return this.items.length === 0;
  }

  // Get queue size → O(1)
  size() {
    return this.items.length;
  }
}`.split('\n')

const CodePanel = ({ step }: CodePanelProps) => {
  const getHighlightedLines = (): number[] => {
    switch (step.operation) {
      case 'enqueue': return [8, 9, 10, 11, 12, 13, 14]
      case 'dequeue': return [17, 18, 19, 20, 21, 22, 23, 24]
      case 'peek': return [27, 28, 29, 30]
      default: return [1, 2, 3, 4, 5, 6]
    }
  }

  const highlighted = new Set(getHighlightedLines())

  const getTokenClass = (token: string): string => {
    const keywords = ['class', 'constructor', 'this', 'if', 'return', 'const', 'new', 'null']
    const methods = ['push', 'shift', 'length', 'enqueue', 'dequeue', 'peek', 'isEmpty', 'size']
    if (keywords.includes(token.replace(/[^a-zA-Z]/g, ''))) return 'token-keyword'
    if (methods.some(m => token.includes(m))) return 'token-method'
    if (/^\/\//.test(token.trim())) return 'token-comment'
    if (/^\d+$/.test(token)) return 'token-number'
    if (token === 'Queue') return 'token-class'
    return ''
  }

  const renderLine = (line: string, lineNum: number) => {
    // Simple tokenize by splitting on spaces/special chars
    const isHighlighted = highlighted.has(lineNum)
    const isComment = line.trim().startsWith('//')

    return (
      <div
        key={lineNum}
        className={`code-line ${isHighlighted ? 'code-line-highlighted' : ''} ${isComment ? 'code-line-comment' : ''}`}
        role="row"
      >
        <span className="line-number" aria-hidden="true">{lineNum}</span>
        <span className="line-content">
          {isComment ? (
            <span className="token-comment">{line}</span>
          ) : (
            line
              .split(/(\b(?:class|constructor|this|if|return|const|new|null)\b|\/\/.*$|\d+)/)
              .map((part, i) => {
                const cls = getTokenClass(part)
                return cls ? <span key={i} className={cls}>{part}</span> : <span key={i}>{part}</span>
              })
          )}
        </span>
      </div>
    )
  }

  return (
    <div className="code-panel" role="region" aria-label="Code implementation">
      {/* Code panel header */}
      <div className="code-header">
        <div className="code-header-left">
          <div className="file-tab active">
            <span className="file-icon" aria-hidden="true">JS</span>
            <span>queue.js</span>
          </div>
        </div>
        <div className="code-header-right">
          <span className="lang-badge">JavaScript</span>
        </div>
      </div>

      {/* Current step code */}
      <div className="step-code-block">
        <div className="step-code-header">
          <span className="step-code-label" aria-label="Current step">▶ CURRENT STEP</span>
          <span className={`step-op-tag op-${step.operation}`}>
            {step.description}
          </span>
        </div>
        <pre className="step-code" aria-label={`Step code: ${step.description}`}>
          <code>{step.code}</code>
        </pre>
      </div>

      {/* Full implementation */}
      <div className="code-body" role="table" aria-label="Full queue implementation">
        <div className="code-body-header">
          <span className="code-body-label">Full Implementation</span>
          <span className="highlight-hint" aria-label="Highlighted lines indicate current operation">
            <span className="hint-dot" aria-hidden="true" />
            Highlighted = active operation
          </span>
        </div>
        <div className="code-lines" role="rowgroup">
          {FULL_IMPLEMENTATION.map((line, i) => renderLine(line, i + 1))}
        </div>
      </div>
    </div>
  )
}

export default CodePanel
