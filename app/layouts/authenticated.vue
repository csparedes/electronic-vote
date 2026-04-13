<template>
  <div class="flex flex-col min-h-screen">
    <UContainer class="flex flex-col flex-1">
      <UHeader>
        <template #left>
          <NuxtLink to="/">
            <AppLogo class="w-auto h-6 shrink-0" />
          </NuxtLink>
        </template>

        <template #right>
          <UDropdownMenu
            :items="navItems"
            :ui="{ content: 'w-48' }"
          >
            <UButton
              variant="subtle"
              :label="user?.name || 'User'"
              trailing-icon="i-lucide-chevron-down"
              color="neutral"
            />
          </UDropdownMenu>
          <UColorModeButton />
        </template>
      </UHeader>

      <div class="flex-1 py-6">
        <slot />
      </div>

      <USeparator icon="i-simple-icons-nuxtdotjs" />

      <UFooter>
        <template #left>
          <p class="text-sm text-muted">
            Electronic Vote • © {{ new Date().getFullYear() }}
          </p>
        </template>
      </UFooter>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const { user, logout } = useAuth()
const { canAccess } = usePermissions()

const handleLogout = async (e: Event) => {
  e.preventDefault()
  try {
    await logout()
  } catch {
    // Error is handled by useAuth
  }
}

const navItems = computed(() => {
  const items: Array<{
    label: string
    to?: string
    icon: string
    onSelect?: (e: Event) => void
    type?: 'separator'
  }> = [
    { label: 'Profile', to: '/profile', icon: 'i-lucide-user' }
  ]

  if (canAccess('dashboard')) {
    items.splice(1, 0, { label: 'Dashboard', to: '/dashboard', icon: 'i-lucide-layout-dashboard' })
  }

  if (canAccess('management')) {
    items.splice(2, 0, { label: 'Management', to: '/management', icon: 'i-lucide-settings' })
  }

  items.push({ type: 'separator', label: '', icon: '' })
  items.push({ label: 'Logout', icon: 'i-lucide-log-out', onSelect: handleLogout })

  return [items]
})
</script>
