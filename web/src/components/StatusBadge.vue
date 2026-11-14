<script setup lang="ts">
import type { TaskStatus } from '@/types/task'

defineProps<{ status: TaskStatus; overdue?: boolean }>()
</script>

<template>
  <span class="badge" :class="overdue ? 'badge-overdue' : status === 'Completed' ? 'badge-done' : 'badge-pending'">
    {{ overdue ? 'Overdue' : status }}
  </span>
</template>
