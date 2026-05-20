// ===== SHARED TYPES =====

export type QueueOperation = 'enqueue' | 'dequeue' | 'peek' | 'idle'

export interface QueueItem {
  id: string
  value: number | string
  isNew?: boolean
  isLeaving?: boolean
  isHighlighted?: boolean
}

export interface QueueStep {
  id: string
  operation: QueueOperation
  description: string
  code: string
  queueState: QueueItem[]
  front: number | null
  rear: number | null
  returnValue?: number | string | null
  explanation: string
  detailedExplanation: string
}

// ===== LINKED LIST TYPES =====

export type LLOperation =
  | 'insertHead'
  | 'insertTail'
  | 'insertAt'
  | 'deleteHead'
  | 'deleteTail'
  | 'deleteAt'
  | 'search'
  | 'traverse'
  | 'idle'

export interface LLNode {
  id: string
  value: number | string
  isNew?: boolean
  isLeaving?: boolean
  isHighlighted?: boolean
  isSearching?: boolean
  isFound?: boolean
}

export interface LLStep {
  id: string
  operation: LLOperation
  description: string
  code: string
  nodes: LLNode[]
  headIndex: number | null
  tailIndex: number | null
  activeIndex: number | null
  returnValue?: number | string | null
  explanation: string
  detailedExplanation: string
  size: number
}
