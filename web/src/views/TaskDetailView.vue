<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { formatDate, formatDateTime, isOverdue } from '@/utils/date'
import StateError from '@/components/StateError.vue'
import StateLoading from '@/components/StateLoading.vue'
import StatusBadge from '@/components/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const store = useTaskStore()
const id = computed(() => Number(route.params.id))
const confirmingDelete = ref(false)

const task = computed(() => (store.current?.id === id.value ? store.current : null))

function load(): void {
  void store.fetchTask(id.value)
}
onMounted(load)

async function remove(): Promise<void> {
  if (await store.deleteTask(id.value)) await router.push({ name: 'tasks' })
  else confirmingDelete.value = false
}
</script>

<template>
  <RouterLink to="/tasks" class="back">Back to all tasks</RouterLink>
  <StateLoading v-if="store.loading && !task" label="Loading task…" />
  <StateError v-else-if="store.error && !task" :message="store.error" @retry="load" />
  <article v-else-if="task">
    <div class="head">
      <h1>{{ task.title }}</h1>
      <StatusBadge :status="task.status" :overdue="isOverdue(task)" />
    </div>
    <dl class="details">
      <div><dt>Subject</dt><dd>{{ task.subject }}</dd></div>
      <div><dt>Due date</dt><dd>{{ formatDate(task.dueDate) }}</dd></div>
      <div><dt>Created</dt><dd>{{ formatDateTime(task.createdAt) }}</dd></div>
      <div><dt>Description</dt><dd>{{ task.description || 'No description.' }}</dd></div>
    </dl>

    <p v-if="store.error" class="form-error" role="alert">{{ store.error }}</p>

    <div class="actions">
      <button
        v-if="task.status === 'Pending'"
        type="button"
        class="btn btn-primary"
        :disabled="store.loading"
        @click="store.markCompleted(task.id)"
      >
        Mark completed
      </button>
      <RouterLink :to="{ name: 'task-edit', params: { id: task.id } }" class="btn">Edit task</RouterLink>
      <button v-if="!confirmingDelete" type="button" class="btn btn-danger" @click="confirmingDelete = true">
        Delete task
      </button>
      <template v-else>
        <span>Delete this task? This cannot be undone.</span>
        <button type="button" class="btn btn-danger" :disabled="store.loading" @click="remove">Yes, delete</button>
        <button type="button" class="btn" @click="confirmingDelete = false">Keep task</button>
      </template>
    </div>
  </article>
</template>
