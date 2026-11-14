<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { formatDate, isOverdue } from '@/utils/date'
import StateEmpty from '@/components/StateEmpty.vue'
import StateError from '@/components/StateError.vue'
import StateLoading from '@/components/StateLoading.vue'
import StatusBadge from '@/components/StatusBadge.vue'

const store = useTaskStore()
onMounted(() => store.fetchTasks())

function clearFilters(): void {
  store.search = ''
  store.statusFilter = 'All'
}
</script>

<template>
  <div class="head">
    <h1>All tasks</h1>
    <RouterLink to="/tasks/new" class="btn btn-primary">New task</RouterLink>
  </div>

  <div class="filters">
    <div class="field">
      <label for="search">Search by title</label>
      <input id="search" v-model="store.search" type="search" placeholder="e.g. lab report" />
    </div>
    <div class="field">
      <label for="status">Status</label>
      <select id="status" v-model="store.statusFilter">
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  </div>

  <StateLoading v-if="store.loading && !store.tasks.length" />
  <StateError v-else-if="store.error" :message="store.error" @retry="store.fetchTasks()" />
  <StateEmpty
    v-else-if="!store.tasks.length"
    title="No tasks yet"
    message="Add your first assignment to start tracking deadlines."
  >
    <RouterLink to="/tasks/new" class="btn btn-primary">Add a task</RouterLink>
  </StateEmpty>
  <StateEmpty
    v-else-if="!store.filteredTasks.length"
    title="No matching tasks"
    message="Try a different title or status."
  >
    <button type="button" class="btn" @click="clearFilters">Clear search and filter</button>
  </StateEmpty>
  <ul v-else class="rows">
    <li v-for="task in store.filteredTasks" :key="task.id" class="tone" :style="{ '--hue': (task.id * 137) % 360 }">
      <RouterLink :to="{ name: 'task-detail', params: { id: task.id } }" class="row-title">{{ task.title }}</RouterLink>
      <span class="muted">{{ task.subject }}</span>
      <span class="muted">Due {{ formatDate(task.dueDate) }}</span>
      <StatusBadge :status="task.status" :overdue="isOverdue(task)" />
      <button
        v-if="task.status === 'Pending'"
        type="button"
        class="btn btn-small"
        :disabled="store.loading"
        @click="store.markCompleted(task.id)"
      >
        Mark completed
      </button>
    </li>
  </ul>
</template>
