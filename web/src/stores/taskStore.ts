import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { taskService } from '@/services/taskService'
import type { StatusFilter, Task, TaskInput } from '@/types/task'

export const useTaskStore = defineStore('tasks', () => {
  // state shared between pages
  const tasks = ref<Task[]>([])
  const current = ref<Task | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const search = ref('')
  const statusFilter = ref<StatusFilter>('All')

  // derived
  const total = computed(() => tasks.value.length)
  const pendingTasks = computed(() => tasks.value.filter((t) => t.status === 'Pending'))
  const completedTasks = computed(() => tasks.value.filter((t) => t.status === 'Completed'))
  const filteredTasks = computed(() => {
    const term = search.value.trim().toLowerCase()
    return tasks.value
      .filter((t) => statusFilter.value === 'All' || t.status === statusFilter.value)
      .filter((t) => !term || t.title.toLowerCase().includes(term))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  })

  async function run<T>(action: () => Promise<T>): Promise<T | undefined> {
    loading.value = true
    error.value = null
    try {
      return await action()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Something went wrong. Try again.'
      return undefined
    } finally {
      loading.value = false
    }
  }

  function replace(task: Task): void {
    tasks.value = tasks.value.map((t) => (t.id === task.id ? task : t))
    if (current.value?.id === task.id) current.value = task
  }

  async function fetchTasks(): Promise<void> {
    const result = await run(() => taskService.list())
    if (result) tasks.value = result
  }

  async function fetchTask(id: number): Promise<Task | undefined> {
    const result = await run(() => taskService.get(id))
    if (result) current.value = result
    return result
  }

  async function createTask(input: TaskInput): Promise<Task | undefined> {
    const created = await run(() => taskService.create(input))
    if (created) tasks.value = [...tasks.value, created]
    return created
  }

  async function updateTask(id: number, input: TaskInput): Promise<Task | undefined> {
    const updated = await run(() => taskService.update(id, input))
    if (updated) replace(updated)
    return updated
  }

  async function markCompleted(id: number): Promise<void> {
    const updated = await run(() => taskService.setStatus(id, 'Completed'))
    if (updated) replace(updated)
  }

  async function deleteTask(id: number): Promise<boolean> {
    const done = await run(async () => {
      await taskService.remove(id)
      return true
    })
    if (done) {
      tasks.value = tasks.value.filter((t) => t.id !== id)
      if (current.value?.id === id) current.value = null
    }
    return done === true
  }

  function clearError(): void {
    error.value = null
  }

  return {
    tasks, current, loading, error, search, statusFilter,
    total, pendingTasks, completedTasks, filteredTasks,
    fetchTasks, fetchTask, createTask, updateTask, markCompleted, deleteTask, clearError,
  }
})
