<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { hasErrors, validateTask, type TaskErrors } from '@/utils/validation'
import type { TaskInput } from '@/types/task'
import StateError from '@/components/StateError.vue'
import StateLoading from '@/components/StateLoading.vue'

const route = useRoute()
const router = useRouter()
const store = useTaskStore()

const editingId = computed(() => (route.params.id ? Number(route.params.id) : null))
const isEdit = computed(() => editingId.value !== null)

// Draft values and validation feedback live here, not in the store: nobody else needs them.
const form = reactive<TaskInput>({ title: '', subject: '', description: '', dueDate: '' })
const errors = ref<TaskErrors>({})
const touched = reactive<Partial<Record<keyof TaskInput, boolean>>>({})
const submitted = ref(false)
const loadFailed = ref(false)

watch(form, () => (errors.value = validateTask(form, isEdit.value)), { deep: true })

function shown(field: keyof TaskInput): string | undefined {
  return touched[field] || submitted.value ? errors.value[field] : undefined
}

async function load(): Promise<void> {
  if (editingId.value === null) return
  loadFailed.value = false
  const task = await store.fetchTask(editingId.value)
  if (task) {
    Object.assign(form, { title: task.title, subject: task.subject, description: task.description, dueDate: task.dueDate })
  } else {
    loadFailed.value = true
  }
}

onMounted(() => {
  store.clearError()
  void load()
})

async function onSubmit(): Promise<void> {
  submitted.value = true
  errors.value = validateTask(form, isEdit.value)
  if (hasErrors(errors.value)) return
  const input: TaskInput = {
    title: form.title.trim(),
    subject: form.subject.trim(),
    description: form.description.trim(),
    dueDate: form.dueDate,
  }
  const id = editingId.value
  const saved = id !== null ? await store.updateTask(id, input) : await store.createTask(input)
  if (saved) await router.push({ name: 'task-detail', params: { id: saved.id } })
}
</script>

<template>
  <h1>{{ isEdit ? 'Edit task' : 'New task' }}</h1>
  <StateLoading v-if="isEdit && store.loading && !loadFailed && !form.title" label="Loading task…" />
  <StateError v-else-if="loadFailed" :message="store.error ?? 'Could not load this task.'" @retry="load" />
  <form v-else novalidate class="form" @submit.prevent="onSubmit">
    <div class="field">
      <label for="title">Title</label>
      <input id="title" v-model="form.title" type="text" :aria-invalid="!!shown('title')" @blur="touched.title = true" />
      <p v-if="shown('title')" class="field-error">{{ shown('title') }}</p>
    </div>
    <div class="field">
      <label for="subject">Subject</label>
      <input id="subject" v-model="form.subject" type="text" :aria-invalid="!!shown('subject')" @blur="touched.subject = true" />
      <p v-if="shown('subject')" class="field-error">{{ shown('subject') }}</p>
    </div>
    <div class="field">
      <label for="dueDate">Due date</label>
      <input id="dueDate" v-model="form.dueDate" type="date" :aria-invalid="!!shown('dueDate')" @blur="touched.dueDate = true" />
      <p v-if="shown('dueDate')" class="field-error">{{ shown('dueDate') }}</p>
    </div>
    <div class="field">
      <label for="description">Description (optional)</label>
      <textarea id="description" v-model="form.description" rows="4" :aria-invalid="!!shown('description')" @blur="touched.description = true" />
      <p v-if="shown('description')" class="field-error">{{ shown('description') }}</p>
    </div>

    <p v-if="store.error" class="form-error" role="alert">{{ store.error }}</p>

    <div class="actions">
      <button type="submit" class="btn btn-primary" :disabled="store.loading">
        {{ store.loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create task' }}
      </button>
      <RouterLink :to="isEdit && editingId ? { name: 'task-detail', params: { id: editingId } } : { name: 'tasks' }" class="btn">
        Cancel
      </RouterLink>
    </div>
  </form>
</template>
