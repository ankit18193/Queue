import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

interface NavbarProps {
  activePage: 'queue' | 'linked-list'
}

const Navbar = ({ activePage }: NavbarProps) => {
  const navigate = useNavigate()

  const topics = [
    { id: 'queue', label: 'Queue', path: '/queue', icon: '▤', badge: 'FIFO' },
    { id: 'linked-list', label: 'Linked List', path: '/linked-list', icon: '⬡', badge: 'Pointers' },
  ]

  const current = topics.find(t => t.id === activePage)!

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-brand" aria-label="DSA Learn home">
          <div className="brand-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 10l4-3v10l-4-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">DSA</span>
            <span className="brand-sub">Learn</span>
          </div>
        </Link>

        {/* Center — Topic Navigator */}
        <div className="navbar-center">
          <div className="topic-nav" role="tablist" aria-label="Data structure topics">
            {topics.map(topic => (
              <button
                key={topic.id}
                id={`nav-topic-${topic.id}`}
                role="tab"
                aria-selected={activePage === topic.id}
                className={`topic-nav-btn ${activePage === topic.id ? 'active' : ''}`}
                onClick={() => navigate(topic.path)}
              >
                <span className="topic-nav-icon" aria-hidden="true">{topic.icon}</span>
                <span className="topic-nav-label">{topic.label}</span>
                <span className="topic-nav-badge">{topic.badge}</span>
              </button>
            ))}
          </div>

          {/* Breadcrumb trail */}
          <div className="breadcrumb-trail" role="navigation" aria-label="Breadcrumb">
            <span className="breadcrumb-dim">Data Structures</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="breadcrumb-dim">Linear</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="breadcrumb-active" aria-current="page">{current.label}</span>
          </div>
        </div>

        {/* Right */}
        <div className="navbar-right">
          <div className={`difficulty-badge diff-${activePage}`} aria-label="Difficulty: Beginner">
            <span className="difficulty-dot" aria-hidden="true" />
            Beginner
          </div>
          <div className="nav-divider" aria-hidden="true" />
          <div className="topic-tags" aria-label="Tags">
            <span className={`topic-tag tag-${activePage}`}>{current.badge}</span>
            <span className={`topic-tag tag-${activePage}`}>O(1)</span>
          </div>
          <div className="nav-divider" aria-hidden="true" />
          <button className="nav-btn" id="nav-progress-btn" aria-label="View progress">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Progress
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
