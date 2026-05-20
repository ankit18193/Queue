import { useState, useEffect, useCallback, useRef } from 'react'
import Navbar from '../components/Navbar'
import LeftPanel from '../components/LeftPanel'
import VisualizerPanel from '../components/VisualizerPanel'
import type { QueueStep } from '../types'
import '../pages/PageShared.css'

const DEMO_STEPS: QueueStep[] = [
  {
    id: 'step-0',
    operation: 'idle',
    description: 'Initial State',
    code: `// An empty queue is initialized\nqueue = []`,
    queueState: [],
    front: null,
    rear: null,
    returnValue: null,
    explanation: 'Queue is empty. Front = null, Rear = null.',
    detailedExplanation: 'We start with an empty queue. In a queue, the FRONT pointer tracks the first element to be removed, and the REAR pointer tracks the last inserted element. Both are null since no elements exist yet.'
  },
  {
    id: 'step-1',
    operation: 'enqueue',
    description: 'enqueue(10)',
    code: `queue.enqueue(10)\n// Adds 10 to the rear\n// queue = [10]`,
    queueState: [{ id: 'n1', value: 10, isNew: true }],
    front: 0,
    rear: 0,
    returnValue: null,
    explanation: 'Enqueued 10. Front = 0, Rear = 0.',
    detailedExplanation: 'We call enqueue(10). The value 10 is added to the REAR of the queue. Since this is the first element, both FRONT and REAR point to index 0. Time Complexity: O(1).'
  },
  {
    id: 'step-2',
    operation: 'enqueue',
    description: 'enqueue(25)',
    code: `queue.enqueue(25)\n// Adds 25 to the rear\n// queue = [10, 25]`,
    queueState: [
      { id: 'n1', value: 10 },
      { id: 'n2', value: 25, isNew: true }
    ],
    front: 0,
    rear: 1,
    returnValue: null,
    explanation: 'Enqueued 25. Front = 0, Rear = 1.',
    detailedExplanation: 'We call enqueue(25). The value 25 is appended to the REAR. FRONT stays at 0 (still pointing to 10). REAR advances to index 1, pointing to the newly added 25.'
  },
  {
    id: 'step-3',
    operation: 'enqueue',
    description: 'enqueue(42)',
    code: `queue.enqueue(42)\n// Adds 42 to the rear\n// queue = [10, 25, 42]`,
    queueState: [
      { id: 'n1', value: 10 },
      { id: 'n2', value: 25 },
      { id: 'n3', value: 42, isNew: true }
    ],
    front: 0,
    rear: 2,
    returnValue: null,
    explanation: 'Enqueued 42. Front = 0, Rear = 2.',
    detailedExplanation: 'We call enqueue(42). 42 is added to the REAR. The queue now has three elements: [10, 25, 42]. FRONT = 0, REAR = 2. The queue follows FIFO — the first element in (10) will be the first element out.'
  },
  {
    id: 'step-4',
    operation: 'peek',
    description: 'peek()',
    code: `queue.peek()\n// Returns front element\n// returns 10 (no removal)`,
    queueState: [
      { id: 'n1', value: 10, isHighlighted: true },
      { id: 'n2', value: 25 },
      { id: 'n3', value: 42 }
    ],
    front: 0,
    rear: 2,
    returnValue: 10,
    explanation: 'Peek returns 10. Queue unchanged.',
    detailedExplanation: 'peek() inspects the FRONT element without removing it. It returns 10, the element at FRONT (index 0). The queue remains unchanged: [10, 25, 42]. This is useful when you need to see what\'s next without disturbing the queue.'
  },
  {
    id: 'step-5',
    operation: 'dequeue',
    description: 'dequeue()',
    code: `queue.dequeue()\n// Removes from front\n// returns 10\n// queue = [25, 42]`,
    queueState: [
      { id: 'n1', value: 10, isLeaving: true },
      { id: 'n2', value: 25 },
      { id: 'n3', value: 42 }
    ],
    front: 0,
    rear: 2,
    returnValue: 10,
    explanation: 'Dequeued 10. Returns 10. Queue = [25, 42].',
    detailedExplanation: 'dequeue() removes and returns the FRONT element (10). This follows the FIFO principle — first in, first out. The FRONT pointer advances to the next element (25). Time Complexity: O(1).'
  },
  {
    id: 'step-6',
    operation: 'enqueue',
    description: 'enqueue(8)',
    code: `queue.enqueue(8)\n// Adds 8 to the rear\n// queue = [25, 42, 8]`,
    queueState: [
      { id: 'n2', value: 25 },
      { id: 'n3', value: 42 },
      { id: 'n4', value: 8, isNew: true }
    ],
    front: 0,
    rear: 2,
    returnValue: null,
    explanation: 'Enqueued 8. Front = 0, Rear = 2.',
    detailedExplanation: 'We enqueue(8), adding it to the REAR. The queue is now [25, 42, 8]. Notice how new elements always join at the back — just like a real-world queue at a store checkout!'
  },
  {
    id: 'step-7',
    operation: 'dequeue',
    description: 'dequeue()',
    code: `queue.dequeue()\n// Removes from front\n// returns 25\n// queue = [42, 8]`,
    queueState: [
      { id: 'n2', value: 25, isLeaving: true },
      { id: 'n3', value: 42 },
      { id: 'n4', value: 8 }
    ],
    front: 0,
    rear: 2,
    returnValue: 25,
    explanation: 'Dequeued 25. Returns 25. Queue = [42, 8].',
    detailedExplanation: 'dequeue() removes 25 from the FRONT. 25 waited longest — it was added after 10 was dequeued, making it the new oldest element. FRONT advances to point at 42. Queue = [42, 8].'
  }
]

function QueuePage() {
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
    <div className="app-root">
      <div className="ambient-bg">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
        <div className="grid-overlay" />
      </div>
      <Navbar activePage="queue" />
      <main className="main-layout">
        <LeftPanel step={step} activeSection={activeSection} setActiveSection={setActiveSection} />
        <VisualizerPanel
          step={step} currentStep={currentStep} totalSteps={totalSteps}
          isPlaying={isPlaying} speed={speed} steps={DEMO_STEPS}
          onNext={goNext} onPrev={goPrev} onTogglePlay={togglePlay}
          onReset={reset} onSpeedChange={setSpeed} onStepSelect={goToStep}
        />
      </main>
    </div>
  )
}

export default QueuePage
