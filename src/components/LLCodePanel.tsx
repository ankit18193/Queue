import type { LLStep } from '../types'
import './CodePanel.css'

interface LLCodePanelProps {
  step: LLStep
}

const FULL_IMPLEMENTATION = `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  // Insert at head -> O(1)
  insertHead(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    newNode.next = this.head;
    this.head = newNode;
  }

  // Insert at tail -> O(1)
  insertTail(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    this.tail.next = newNode;
    this.tail = newNode;
  }

  // Insert at index -> O(n)
  insertAt(index, value) {
    if (index === 0) return this.insertHead(value);
    const newNode = new Node(value);
    let curr = this.head;
    for (let i = 0; i < index - 1; i++) {
      if (curr) curr = curr.next;
    }
    newNode.next = curr.next;
    curr.next = newNode;
  }

  // Search value -> O(n)
  search(value) {
    let curr = this.head;
    while (curr) {
      if (curr.value === value) return true;
      curr = curr.next;
    }
    return false;
  }

  // Delete head -> O(1)
  deleteHead() {
    if (!this.head) return null;
    const removed = this.head.value;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    return removed;
  }

  // Delete tail -> O(n)
  deleteTail() {
    if (!this.head) return null;
    if (this.head === this.tail) {
      const val = this.head.value;
      this.head = null;
      this.tail = null;
      return val;
    }
    let curr = this.head;
    while (curr.next !== this.tail) {
      curr = curr.next;
    }
    const val = this.tail.value;
    curr.next = null;
    this.tail = curr;
    return val;
  }
}`.split('\n')

const LLCodePanel = ({ step }: LLCodePanelProps) => {
  const getHighlightedLines = (): number[] => {
    switch (step.operation) {
      case 'insertHead': return [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
      case 'insertTail': return [27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
      case 'insertAt': return [39, 40, 41, 42, 43, 44, 45, 46, 47, 48]
      case 'search': return [51, 52, 53, 54, 55, 56, 57, 58]
      case 'deleteHead': return [61, 62, 63, 64, 65, 66, 67, 68]
      case 'deleteTail': return [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87]
      default: return [8, 9, 10, 11, 12]
    }
  }

  const highlighted = new Set(getHighlightedLines())

  const getTokenClass = (token: string): string => {
    const keywords = ['class', 'constructor', 'this', 'if', 'return', 'const', 'new', 'null', 'let', 'for', 'while']
    const methods = ['insertHead', 'insertTail', 'insertAt', 'search', 'deleteHead', 'deleteTail', 'next', 'value']
    if (keywords.includes(token.replace(/[^a-zA-Z]/g, ''))) return 'token-keyword'
    if (methods.some(m => token.includes(m))) return 'token-method'
    if (/^\/\//.test(token.trim())) return 'token-comment'
    if (/^\d+$/.test(token)) return 'token-number'
    if (token === 'Node' || token === 'SinglyLinkedList') return 'token-class'
    return ''
  }

  const renderLine = (line: string, lineNum: number) => {
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
              .split(/(\b(?:class|constructor|this|if|return|const|new|null|let|for|while)\b|\/\/.*$|\d+)/)
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
      <div className="code-header">
        <div className="code-header-left">
          <div className="file-tab active">
            <span className="file-icon" style={{ color: '#22d3ee', background: 'rgba(6,182,212,0.1)', borderColor: 'rgba(6,182,212,0.2)' }}>JS</span>
            <span>linked_list.js</span>
          </div>
        </div>
        <div className="code-header-right">
          <span className="lang-badge">JavaScript</span>
        </div>
      </div>

      {/* Current step code snippet */}
      <div className="step-code-block">
        <div className="step-code-header" style={{ background: 'rgba(6, 182, 212, 0.04)' }}>
          <span className="step-code-label" style={{ color: '#06b6d4' }}>▶ CURRENT STEP</span>
          <span className={`step-op-tag op-${step.operation}`} style={{ color: '#22d3ee', background: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)' }}>
            {step.description}
          </span>
        </div>
        <pre className="step-code" aria-label={`Step code: ${step.description}`}>
          <code>{step.code}</code>
        </pre>
      </div>

      {/* Full implementation list */}
      <div className="code-body" role="table" aria-label="Linked List implementation">
        <div className="code-body-header">
          <span className="code-body-label">Full Implementation</span>
          <span className="highlight-hint">
            <span className="hint-dot" style={{ background: '#06b6d4' }} aria-hidden="true" />
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

export default LLCodePanel
