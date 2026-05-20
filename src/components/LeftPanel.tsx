import type { QueueStep } from '../types'
import './LeftPanel.css'

interface LeftPanelProps {
  step: QueueStep
  activeSection: 'overview' | 'complexity' | 'applications'
  setActiveSection: (s: 'overview' | 'complexity' | 'applications') => void
}

const complexityData = [
  { op: 'Enqueue', time: 'O(1)', space: 'O(1)', color: 'green', icon: '→' },
  { op: 'Dequeue', time: 'O(1)', space: 'O(1)', color: 'red', icon: '←' },
  { op: 'Peek', time: 'O(1)', space: 'O(1)', color: 'yellow', icon: '👁' },
  { op: 'Search', time: 'O(n)', space: 'O(1)', color: 'orange', icon: '🔍' },
  { op: 'isEmpty', time: 'O(1)', space: 'O(1)', color: 'teal', icon: '?' },
]

const applications = [
  { icon: '🖨️', title: 'Print Spooler', desc: 'Documents queued for printing' },
  { icon: '🌐', title: 'BFS Algorithm', desc: 'Graph traversal layer by layer' },
  { icon: '⚙️', title: 'CPU Scheduling', desc: 'Process queue management' },
  { icon: '📦', title: 'Request Queue', desc: 'Server handles requests in order' },
  { icon: '🎮', title: 'Event System', desc: 'Game events processed sequentially' },
]

const LeftPanel = ({ step, activeSection, setActiveSection }: LeftPanelProps) => {
  const getOperationClass = () => {
    switch (step.operation) {
      case 'enqueue': return 'op-enqueue'
      case 'dequeue': return 'op-dequeue'
      case 'peek': return 'op-peek'
      default: return 'op-idle'
    }
  }

  const getOperationLabel = () => {
    switch (step.operation) {
      case 'enqueue': return '+ ENQUEUE'
      case 'dequeue': return '− DEQUEUE'
      case 'peek': return '👁 PEEK'
      default: return '◉ INIT'
    }
  }

  return (
    <aside className="left-panel" role="complementary" aria-label="Problem Information">
      {/* Header */}
      <div className="panel-header">
        <div className="problem-meta">
          <span className="problem-number">#01</span>
          <span className="problem-category">Data Structures</span>
        </div>
        <h1 className="problem-title">Queue</h1>
        <p className="problem-subtitle">
          First In, First Out — FIFO Linear Data Structure
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="panel-tabs" role="tablist" aria-label="Problem details sections">
        {(['overview', 'complexity', 'applications'] as const).map(tab => (
          <button
            key={tab}
            id={`tab-${tab}`}
            role="tab"
            aria-selected={activeSection === tab}
            aria-controls={`panel-${tab}`}
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
            id="panel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            className="tab-content overview-content"
          >
            <div className="definition-card">
              <div className="definition-icon" aria-hidden="true">🧠</div>
              <div className="definition-text">
                <strong>Queue</strong> is a linear data structure that stores elements in <span className="highlight-text">FIFO</span> order.
                The first element added is the first one to be removed — exactly like a real-world queue.
              </div>
            </div>

            <div className="properties-grid">
              <div className="property-item">
                <span className="property-icon" aria-hidden="true">🚪</span>
                <span className="property-label">FRONT</span>
                <span className="property-value">Removal end</span>
              </div>
              <div className="property-item">
                <span className="property-icon" aria-hidden="true">🔚</span>
                <span className="property-label">REAR</span>
                <span className="property-value">Insertion end</span>
              </div>
              <div className="property-item">
                <span className="property-icon" aria-hidden="true">⚡</span>
                <span className="property-label">Access</span>
                <span className="property-value">O(1) front/rear</span>
              </div>
              <div className="property-item">
                <span className="property-icon" aria-hidden="true">💾</span>
                <span className="property-label">Space</span>
                <span className="property-value">O(n)</span>
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
                <span className="pointer-label">FRONT</span>
                <span className="pointer-value front">
                  {step.front !== null ? step.front : 'null'}
                </span>
              </div>
              <div className="pointer-arrow" aria-hidden="true">⟶</div>
              <div className="queue-preview">
                {step.queueState.length === 0 ? (
                  <span className="empty-queue-text">[ empty ]</span>
                ) : (
                  step.queueState.map(item => (
                    <span key={item.id} className="preview-item">{item.value}</span>
                  ))
                )}
              </div>
              <div className="pointer-arrow" aria-hidden="true">⟶</div>
              <div className="pointer-item">
                <span className="pointer-label">REAR</span>
                <span className="pointer-value rear">
                  {step.rear !== null ? step.rear : 'null'}
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
            id="panel-complexity"
            role="tabpanel"
            aria-labelledby="tab-complexity"
            className="tab-content"
          >
            <p className="complexity-intro">
              Queue operations are extremely efficient. All primary operations run in constant time.
            </p>
            <div className="complexity-table" role="table" aria-label="Time and space complexity">
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
              <span>Queue's O(1) operations make it ideal for real-time systems where speed is critical.</span>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeSection === 'applications' && (
          <div
            id="panel-applications"
            role="tabpanel"
            aria-labelledby="tab-applications"
            className="tab-content"
          >
            <p className="apps-intro">Queues are everywhere in computing systems:</p>
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

export default LeftPanel
