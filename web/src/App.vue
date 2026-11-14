<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { setSimulateError } from '@/services/taskService'

const simulateError = ref(false)
watch(simulateError, (value) => setSimulateError(value))
</script>

<template>
  <a class="skip" href="#main">Skip to content</a>
  <header class="topbar">
    <RouterLink to="/" class="brand">Student Tasks</RouterLink>
    <nav aria-label="Main">
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/tasks">All tasks</RouterLink>
      <RouterLink to="/tasks/new" class="btn btn-primary">New task</RouterLink>
    </nav>
  </header>
  <main id="main" class="page">
    <RouterView />
  </main>
  <footer class="footer">
    <label>
      <input v-model="simulateError" type="checkbox" />
      Simulate an API error (prototype only)
    </label>
  </footer>
</template>
