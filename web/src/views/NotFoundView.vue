<script setup lang="ts">
import { RouterLink } from 'vue-router'
import StateEmpty from '@/components/StateEmpty.vue'
</script>

<template>
  <StateEmpty title="Page not found" message="This address does not match any page in the app.">
    <RouterLink to="/" class="btn btn-primary">Go to the dashboard</RouterLink>
  </StateEmpty>
</template>
