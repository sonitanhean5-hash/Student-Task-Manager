export type TaskStatus = 'Pending' | 'Completed'
export type StatusFilter = 'All' | TaskStatus

export interface TaskInput {
  title: string
  subject: string
  description: string
  dueDate: string // YYYY-MM-DD
}

export interface Task extends TaskInput {
  id: number
  status: TaskStatus
  createdAt: string // ISO date-time
}
