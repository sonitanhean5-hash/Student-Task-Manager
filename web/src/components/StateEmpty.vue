<script setup lang="ts">
defineProps<{ title: string; message: string }>()
</script>

<template>
  <div class="state">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <slot />
  </div>
</template>
