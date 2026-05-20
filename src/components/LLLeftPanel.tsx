import type { LLStep } from '../types'
import './LLLeftPanel.css'

interface LLLeftPanelProps {
  step: LLStep
  activeSection: 'overview' | 'complexity' | 'applications'
  setActiveSection: (s: 'overview' | 'complexity' | 'applications') => void
}

const complexityData = [
  { op: 'Insert Head', time: 'O(1)', space: 'O(1)', color: 'green', icon: '→' },
  { op: 'Insert Tail', time: 'O(1)', space: 'O(1)', color: 'green', icon: '→' },
  { op: 'Insert At index', time: 'O(n)', space: 'O(1)', color: 'orange', icon: '➔' },
  { op: 'Delete Head', time: 'O(1)', space: 'O(1)', color: 'green', icon: '←' },
  { op: 'Delete Tail', time: 'O(n)', space: 'O(1)', color: 'orange', icon: '←' },
  { op: 'Search value', time: 'O(n)', space: 'O(1)', color: 'orange', icon: '🔍' },
]

const applications = [
  { icon: '🔄', title: 'Undo / Redo', desc: 'Navigating history nodes in apps' },
  { icon: '🌐', title: 'Browser Cache', desc: 'Forward/backward page history lists' },
  { icon: '🎼', title: 'Music Playlist', desc: 'Playing tracks sequentially or looping' },
  { icon: '💾', title: 'Memory Allocation', desc: 'Managing free blocks using linked lists' },
  { icon: '🔢', title: 'Polynomial Math', desc: 'Representing mathematical expressions' },
]

const LLLeftPanel = ({ step, activeSection, setActiveSection }: LLLeftPanelProps) => {
  const getOperationClass = () => {
    switch (step.operation) {
      case 'insertHead':
      case 'insertTail':
      case 'insertAt':
        return 'op-insert'
      case 'deleteHead':
      case 'deleteTail':
      case 'deleteAt':
        return 'op-delete'
      case 'search':
        return 'op-search'
      default:
        return 'op-idle'
    }
  }

  const getOperationLabel = () => {
    switch (step.operation) {
      case 'insertHead': return '+ INSERT HEAD'
      case 'insertTail': return '+ INSERT TAIL'
      case 'insertAt': return '+ INSERT AT'
      case 'deleteHead': return '− DELETE HEAD'
      case 'deleteTail': return '− DELETE TAIL'
      case 'search': return '🔍 SEARCH'
      default: return '◉ INIT'
    }
  }

  return (
    <aside className="left-panel ll-left-panel" role="complementary" aria-label="Linked List Information">
      {/* Header */}
      <div className="panel-header">
        <div className="problem-meta">
          <span className="problem-number">#02</span>
          <span className="problem-category">Data Structures</span>
        </div>
        <h1 className="problem-title">Linked List</h1>
        <p className="problem-subtitle">
          Singly Linked List — Pointer-Based Dynamic Structure
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="panel-tabs" role="tablist" aria-label="Problem details sections">
        {(['overview', 'complexity', 'applications'] as const).map(tab => (
          <button
            key={tab}
            id={`ll-tab-${tab}`}
            role="tab"
            aria-selected={activeSection === tab}
            aria-controls={`ll-panel-${tab}`}
            className={`tab-btn ${activeSection === tab ? 'active' : ''}`}
            onClick={() => setActiveSection(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="panel-content">

        {/* Overview Tab */}
        {activeSection === 'overview' && (
          <div
            id="ll-panel-overview"
            role="tabpanel"
            aria-labelledby="ll-tab-overview"
            className="tab-content overview-content"
          >
            <div className="definition-card ll-def-card">
              <div className="definition-icon" aria-hidden="true">🔗</div>
              <div className="definition-text">
                A <strong>Singly Linked List</strong> contains nodes where each node has a <strong>Value</strong> and a <strong>Next pointer</strong>.
                It allows <span className="highlight-text">dynamic size allocation</span> and fast insertion/deletion.
              </div>
            </div>

            <div className="properties-grid">
              <div className="property-item">
                <span className="property-icon" aria-hidden="true">👑</span>
                <span className="property-label">HEAD</span>
                <span className="property-value">List start node</span>
              </div>
              <div className="property-item">
                <span className="property-icon" aria-hidden="true">🏁</span>
                <span className="property-label">TAIL</span>
                <span className="property-value">List end node</span>
              </div>
              <div className="property-item">
                <span className="property-icon" aria-hidden="true">⚡</span>
                <span className="property-label">Next ptr</span>
                <span className="property-value">Link to neighbor</span>
              </div>
              <div className="property-item">
                <span className="property-icon" aria-hidden="true">💾</span>
                <span className="property-label">Null end</span>
                <span className="property-value">Indicates end</span>
              </div>
            </div>

            {/* Current Step Info */}
            <div className="step-info-block">
              <div className="step-info-header">
                <span className="step-info-label">Current Operation</span>
                <span className={`operation-badge ${getOperationClass()}`}>
                  {getOperationLabel()}
                </span>
              </div>
              <p className="step-explanation">{step.detailedExplanation}</p>
            </div>

            {/* Pointer Status */}
            <div className="pointer-display">
              <div className="pointer-item">
                <span className="pointer-label">HEAD</span>
                <span className="pointer-value ll-head-val">
                  {step.headIndex !== null ? `index ${step.headIndex}` : 'null'}
                </span>
              </div>
              <div className="pointer-arrow" aria-hidden="true">⟶</div>
              <div className="pointer-item">
                <span className="pointer-label">TAIL</span>
                <span className="pointer-value ll-tail-val">
                  {step.tailIndex !== null ? `index ${step.tailIndex}` : 'null'}
                </span>
              </div>
            </div>

            {/* Return value */}
            {step.returnValue !== null && step.returnValue !== undefined && (
              <div className="return-value-block" aria-live="polite">
                <span className="return-label">Returns</span>
                <span className="return-value">{step.returnValue}</span>
              </div>
            )}
          </div>
        )}

        {/* Complexity Tab */}
        {activeSection === 'complexity' && (
          <div
            id="ll-panel-complexity"
            role="tabpanel"
            aria-labelledby="ll-tab-complexity"
            className="tab-content"
          >
            <p className="complexity-intro">
              Unlike arrays, Linked Lists offer extremely fast insertions and deletions at the head without resizing.
            </p>
            <div className="complexity-table" role="table" aria-label="Linked List complexities">
              <div className="complexity-header" role="row">
                <span role="columnheader">Operation</span>
                <span role="columnheader">Time</span>
                <span role="columnheader">Space</span>
              </div>
              {complexityData.map(row => (
                <div key={row.op} className="complexity-row" role="row">
                  <div className="op-cell" role="cell">
                    <span className="op-icon" aria-hidden="true">{row.icon}</span>
                    <span>{row.op}</span>
                  </div>
                  <div className={`time-cell color-${row.color}`} role="cell">
                    <code>{row.time}</code>
                  </div>
                  <div className="space-cell" role="cell">
                    <code>{row.space}</code>
                  </div>
                </div>
              ))}
            </div>
            <div className="complexity-note">
              <span className="note-icon" aria-hidden="true">💡</span>
              <span>Deleting the tail takes O(n) because we need to traverse the list to find the second-to-last node.</span>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeSection === 'applications' && (
          <div
            id="ll-panel-applications"
            role="tabpanel"
            aria-labelledby="ll-tab-applications"
            className="tab-content"
          >
            <p className="apps-intro">Linked lists are the foundation of dynamic memory structures:</p>
            <div className="apps-list">
              {applications.map(app => (
                <div key={app.title} className="app-item">
                  <span className="app-icon" aria-hidden="true">{app.icon}</span>
                  <div className="app-info">
                    <span className="app-title">{app.title}</span>
                    <span className="app-desc">{app.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default LLLeftPanel
