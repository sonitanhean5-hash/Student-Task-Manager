<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { formatDate, isOverdue } from '@/utils/date'
import StateEmpty from '@/components/StateEmpty.vue'
import StateError from '@/components/StateError.vue'
import StateLoading from '@/components/StateLoading.vue'
import StatusBadge from '@/components/StatusBadge.vue'

const store = useTaskStore()
onMounted(() => store.fetchTasks())

const upNext = computed(() =>
  [...store.pendingTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5),
)
const percentDone = computed(() => (store.total ? Math.round((store.completedTasks.length / store.total) * 100) : 0))
</script>

<template>
  <h1>Dashboard</h1>
  <StateLoading v-if="store.loading && !store.tasks.length" />
  <StateError v-else-if="store.error" :message="store.error" @retry="store.fetchTasks()" />
  <StateEmpty
    v-else-if="!store.tasks.length"
    title="No tasks yet"
    message="Add your first assignment to start tracking deadlines."
  >
    <RouterLink to="/tasks/new" class="btn btn-primary">Add a task</RouterLink>
  </StateEmpty>
  <template v-else>
    <section aria-labelledby="progress-h">
      <h2 id="progress-h">Progress</h2>
      <p>{{ store.completedTasks.length }} of {{ store.total }} tasks completed</p>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="percentDone">
        <span :style="{ width: percentDone + '%' }" />
      </div>
      <dl class="summary">
        <div><dt>All tasks</dt><dd>{{ store.total }}</dd></div>
        <div><dt>Pending</dt><dd>{{ store.pendingTasks.length }}</dd></div>
        <div><dt>Completed</dt><dd>{{ store.completedTasks.length }}</dd></div>
      </dl>
    </section>

    <section aria-labelledby="next-h">
      <h2 id="next-h">Due next</h2>
      <p v-if="!upNext.length">Nothing pending. Every task is completed.</p>
      <ul v-else class="rows">
        <li v-for="task in upNext" :key="task.id">
          <RouterLink :to="{ name: 'task-detail', params: { id: task.id } }" class="row-title">{{ task.title }}</RouterLink>
          <span class="muted">{{ task.subject }}</span>
          <span class="muted">Due {{ formatDate(task.dueDate) }}</span>
          <StatusBadge :status="task.status" :overdue="isOverdue(task)" />
        </li>
      </ul>
    </section>
  </template>
</template>
