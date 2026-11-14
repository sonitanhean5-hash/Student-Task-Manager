<script setup lang="ts">
defineProps<{ message: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="state state-error" role="alert">
    <h2>Something went wrong</h2>
    <p>{{ message }}</p>
    <button type="button" class="btn" @click="$emit('retry')">Try again</button>
  </div>
</template>
