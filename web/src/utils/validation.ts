import type { TaskInput } from '@/types/task'
import { todayISO } from '@/utils/date'

export type TaskErrors = Partial<Record<keyof TaskInput, string>>

export function validateTask(input: TaskInput, isEdit: boolean): TaskErrors {
  const errors: TaskErrors = {}
  const title = input.title.trim()
  const subject = input.subject.trim()

  if (!title) errors.title = 'Enter a title.'
  else if (title.length < 3) errors.title = 'Use at least 3 characters.'
  else if (title.length > 100) errors.title = 'Use 100 characters or fewer.'

  if (!subject) errors.subject = 'Enter the subject this task belongs to.'
  else if (subject.length > 50) errors.subject = 'Use 50 characters or fewer.'

  if (input.description.length > 500) errors.description = 'Use 500 characters or fewer.'

  if (!input.dueDate) errors.dueDate = 'Pick a due date.'
  else if (!isEdit && input.dueDate < todayISO()) errors.dueDate = 'The due date cannot be in the past.'

  return errors
}

export function hasErrors(errors: TaskErrors): boolean {
  return Object.keys(errors).length > 0
}
