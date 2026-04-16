<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">
      Profile
    </h1>
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">
          User Information
        </h2>
      </template>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-muted">Name:</span>
          <span>{{ user?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted">Email:</span>
          <span>{{ user?.email }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted">Identification:</span>
          <span>{{ user?.identification }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted">Role:</span>
          <UBadge
            :label="user?.role"
            color="primary"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({})

const { user } = useAuth()
</script>
