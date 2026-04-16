<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">
      Dashboard
    </h1>
    <p class="text-muted">
      Welcome to your dashboard!
    </p>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['advisor', 'admin', 'dev']
})
</script>
