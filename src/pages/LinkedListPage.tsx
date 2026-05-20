import { useState, useEffect, useCallback, useRef } from 'react'
import Navbar from '../components/Navbar'
import LLLeftPanel from '../components/LLLeftPanel'
import LLVisualizerPanel from '../components/LLVisualizerPanel'
import type { LLStep } from '../types'
import '../pages/PageShared.css'

const DEMO_STEPS: LLStep[] = [
  {
    id: 'step-0',
    operation: 'idle',
    description: 'Initial State',
    code: `// Initialize empty Singly Linked List\nlet head = null;\nlet tail = null;`,
    nodes: [],
    headIndex: null,
    tailIndex: null,
    activeIndex: null,
    returnValue: null,
    explanation: 'Linked List is empty. Head = null, Tail = null.',
    detailedExplanation: 'We start with an empty Singly Linked List. A linked list is a linear collection of data elements called nodes, where each node points to the next. Since there are no nodes, the head and tail pointers are null.',
    size: 0
  },
  {
    id: 'step-1',
    operation: 'insertHead',
    description: 'insertHead(20)',
    code: `list.insertHead(20);\n// New node 20 becomes the head\n// list: 20 -> null`,
    nodes: [{ id: 'n1', value: 20, isNew: true }],
    headIndex: 0,
    tailIndex: 0,
    activeIndex: 0,
    returnValue: null,
    explanation: 'Inserted 20 at Head. Head = 0, Tail = 0.',
    detailedExplanation: 'We insert a new node with value 20 at the head. Since the list was empty, this node becomes both the Head and the Tail. Its next pointer points to null. Time Complexity: O(1).',
    size: 1
  },
  {
    id: 'step-2',
    operation: 'insertTail',
    description: 'insertTail(45)',
    code: `list.insertTail(45);\n// New node 45 added at the end\n// list: 20 -> 45 -> null`,
    nodes: [
      { id: 'n1', value: 20 },
      { id: 'n2', value: 45, isNew: true }
    ],
    headIndex: 0,
    tailIndex: 1,
    activeIndex: 1,
    returnValue: null,
    explanation: 'Inserted 45 at Tail. Tail advances to index 1.',
    detailedExplanation: 'We call insertTail(45). The next pointer of node 20 is updated to point to the new node 45. The Tail pointer is then advanced to point to node 45. Time Complexity: O(1) (with tail pointer).',
    size: 2
  },
  {
    id: 'step-3',
    operation: 'insertHead',
    description: 'insertHead(15)',
    code: `list.insertHead(15);\n// 15 -> head\n// list: 15 -> 20 -> 45 -> null`,
    nodes: [
      { id: 'n3', value: 15, isNew: true },
      { id: 'n1', value: 20 },
      { id: 'n2', value: 45 }
    ],
    headIndex: 0,
    tailIndex: 2,
    activeIndex: 0,
    returnValue: null,
    explanation: 'Inserted 15 at Head. Head updates to point to 15.',
    detailedExplanation: 'We call insertHead(15). We first point the next pointer of the new node 15 to the current head (node 20). Then, we update Head to point to the new node 15. Time Complexity: O(1).',
    size: 3
  },
  {
    id: 'step-4',
    operation: 'insertAt',
    description: 'insertAt(2, 33)',
    code: `list.insertAt(2, 33);\n// Insert 33 at index 2\n// list: 15 -> 20 -> 33 -> 45 -> null`,
    nodes: [
      { id: 'n3', value: 15, isHighlighted: true },
      { id: 'n1', value: 20, isHighlighted: true },
      { id: 'n4', value: 33, isNew: true },
      { id: 'n2', value: 45 }
    ],
    headIndex: 0,
    tailIndex: 3,
    activeIndex: 2,
    returnValue: null,
    explanation: 'Inserted 33 at index 2 (traversed 15 and 20).',
    detailedExplanation: 'We insert 33 at index 2. We start from Head and traverse the list to index 1 (node 20). The next pointer of 33 is set to point to node 45, and node 20\'s next is updated to point to node 33. Time Complexity: O(n).',
    size: 4
  },
  {
    id: 'step-5',
    operation: 'search',
    description: 'search(20)',
    code: `list.search(20);\n// Traverse nodes to find value 20\n// returns true (index 1)`,
    nodes: [
      { id: 'n3', value: 15, isSearching: true },
      { id: 'n1', value: 20, isFound: true },
      { id: 'n4', value: 33 },
      { id: 'n2', value: 45 }
    ],
    headIndex: 0,
    tailIndex: 3,
    activeIndex: 1,
    returnValue: 'true (index 1)',
    explanation: 'Searched for 20. Found at index 1.',
    detailedExplanation: 'We search for value 20. We start at Head (15), compare it (no match), and move to the next node (20). It matches! The search terminates successfully and returns true. Time Complexity: O(n).',
    size: 4
  },
  {
    id: 'step-6',
    operation: 'deleteHead',
    description: 'deleteHead()',
    code: `list.deleteHead();\n// Removes first node\n// returns 15\n// list: 20 -> 33 -> 45 -> null`,
    nodes: [
      { id: 'n3', value: 15, isLeaving: true },
      { id: 'n1', value: 20 },
      { id: 'n4', value: 33 },
      { id: 'n2', value: 45 }
    ],
    headIndex: 0,
    tailIndex: 3,
    activeIndex: 0,
    returnValue: 15,
    explanation: 'Deleted head node (15). Head advances to 20.',
    detailedExplanation: 'We call deleteHead(). We save the head value (15) to return. We then update Head to point to the next node in the list (20), freeing the memory of the original head node. Time Complexity: O(1).',
    size: 3
  },
  {
    id: 'step-7',
    operation: 'deleteTail',
    description: 'deleteTail()',
    code: `list.deleteTail();\n// Removes last node\n// returns 45\n// list: 20 -> 33 -> null`,
    nodes: [
      { id: 'n1', value: 20 },
      { id: 'n4', value: 33 },
      { id: 'n2', value: 45, isLeaving: true }
    ],
    headIndex: 0,
    tailIndex: 1,
    activeIndex: 1,
    returnValue: 45,
    explanation: 'Deleted tail node (45). Tail updates to point to 33.',
    detailedExplanation: 'We call deleteTail(). Since we need to update the Tail pointer, we traverse to the second-to-last node (33). We set its next pointer to null and update the Tail pointer to point to 33. Time Complexity: O(n).',
    size: 2
  }
]

function LinkedListPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1800)
  const [activeSection, setActiveSection] = useState<'overview' | 'complexity' | 'applications'>('overview')
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const step = DEMO_STEPS[currentStep]
  const totalSteps = DEMO_STEPS.length

  const goNext = useCallback(() => setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1)), [totalSteps])
  const goPrev = useCallback(() => setCurrentStep(prev => Math.max(prev - 1, 0)), [])
  const goToStep = useCallback((idx: number) => setCurrentStep(idx), [])
  const togglePlay = useCallback(() => setIsPlaying(prev => !prev), [])
  const reset = useCallback(() => { setIsPlaying(false); setCurrentStep(0) }, [])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= totalSteps - 1) { setIsPlaying(false); return prev }
          return prev + 1
        })
      }, speed)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, speed, totalSteps])

  return (
    <div className="app-root ll-theme">
      <div className="ambient-bg">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
        <div className="grid-overlay" />
      </div>
      <Navbar activePage="linked-list" />
      <main className="main-layout">
        <LLLeftPanel step={step} activeSection={activeSection} setActiveSection={setActiveSection} />
        <LLVisualizerPanel
          step={step} currentStep={currentStep} totalSteps={totalSteps}
          isPlaying={isPlaying} speed={speed} steps={DEMO_STEPS}
          onNext={goNext} onPrev={goPrev} onTogglePlay={togglePlay}
          onReset={reset} onSpeedChange={setSpeed} onStepSelect={goToStep}
        />
      </main>
    </div>
  )
}

export default LinkedListPage
