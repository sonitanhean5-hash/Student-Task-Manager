import seed from '@/mocks/db.json'
import type { Task, TaskInput, TaskStatus } from '@/types/task'

// Mock API: in-memory copy of mocks/db.json with simulated latency.
// In M3 this file is the only thing that changes: each function becomes a fetch() to the NestJS API.
const DELAY_MS = 600

let tasks: Task[] = (seed.tasks as Task[]).map((t) => ({ ...t }))
let nextId = Math.max(0, ...tasks.map((t) => t.id)) + 1
let simulateError = false

export function setSimulateError(value: boolean): void {
  simulateError = value
}

function respond<T>(produce: () => T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      try {
        if (simulateError) throw new Error('Could not reach the server. Check your connection and try again.')
        resolve(produce())
      } catch (error) {
        reject(error)
      }
    }, DELAY_MS)
  })
}

function find(id: number): Task {
  const task = tasks.find((t) => t.id === id)
  if (!task) throw new Error('This task does not exist. It may have been deleted.')
  return task
}

export const taskService = {
  list: () => respond(() => tasks.map((t) => ({ ...t }))),

  get: (id: number) => respond(() => ({ ...find(id) })),

  create: (input: TaskInput) =>
    respond(() => {
      const task: Task = { ...input, id: nextId++, status: 'Pending', createdAt: new Date().toISOString() }
      tasks = [...tasks, task]
      return { ...task }
    }),

  update: (id: number, input: TaskInput) =>
    respond(() => {
      const updated: Task = { ...find(id), ...input }
      tasks = tasks.map((t) => (t.id === id ? updated : t))
      return { ...updated }
    }),

  setStatus: (id: number, status: TaskStatus) =>
    respond(() => {
      const updated: Task = { ...find(id), status }
      tasks = tasks.map((t) => (t.id === id ? updated : t))
      return { ...updated }
    }),

  remove: (id: number) =>
    respond(() => {
      find(id)
      tasks = tasks.filter((t) => t.id !== id)
    }),
}
