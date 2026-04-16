<template>
  <div class="flex min-h-screen">
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-transform lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex items-center gap-3 h-16 px-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
        <span class="font-semibold text-sm">Electronic Vote</span>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <template v-if="isAuthenticated">
          <UButton
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :icon="item.icon"
            :label="item.label"
            variant="ghost"
            color="neutral"
            class="w-full justify-start"
            @click="closeMobileSidebar"
          />
        </template>
        <template v-else>
          <UButton
            to="/auth?tab=login"
            icon="i-lucide-log-in"
            label="Login"
            variant="ghost"
            color="neutral"
            class="w-full justify-start"
            @click="closeMobileSidebar"
          />
          <UButton
            to="/auth?tab=register"
            icon="i-lucide-user-plus"
            label="Register"
            variant="ghost"
            color="neutral"
            class="w-full justify-start"
            @click="closeMobileSidebar"
          />
        </template>
      </nav>

      <div
        v-if="isAuthenticated"
        class="border-t border-neutral-200 dark:border-neutral-800 p-4 space-y-2"
      >
        <div class="px-2 text-sm truncate">
          <p class="font-medium truncate">
            {{ user?.name }}
          </p>
          <p class="text-muted text-xs truncate">
            {{ user?.email }}
          </p>
        </div>
        <UButton
          icon="i-lucide-log-out"
          label="Logout"
          variant="ghost"
          color="error"
          class="w-full justify-start"
          @click="handleLogout"
        />
      </div>
    </aside>

    <div class="flex-1 lg:pl-64 flex flex-col min-h-screen">
      <header class="sticky top-0 z-30 flex items-center h-16 px-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 lg:justify-end">
        <button
          class="lg:hidden p-2 -ml-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          aria-label="Toggle sidebar"
          @click="sidebarOpen = !sidebarOpen"
        >
          <UIcon
            name="i-lucide-menu"
            class="size-5"
          />
        </button>

        <div class="ml-auto flex items-center gap-2">
          <UColorModeButton />
        </div>
      </header>

      <main class="flex-1 p-6">
        <slot />
      </main>

      <footer class="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4">
        <p class="text-sm text-muted">
          Electronic Vote &bull; &copy; {{ new Date().getFullYear() }}
        </p>
      </footer>
    </div>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    />
  </div>
</template>

<script lang="ts" setup>
const { user, isAuthenticated, logout } = useAuth()
const { canAccess } = usePermissions()

const sidebarOpen = ref(false)

function closeMobileSidebar() {
  sidebarOpen.value = false
}

const navItems = computed(() => {
  const items = [
    { label: 'Vote', to: '/vote', icon: 'i-lucide-vote' },
    { label: 'Profile', to: '/profile', icon: 'i-lucide-user' }
  ]

  if (canAccess('dashboard')) {
    items.push({ label: 'Dashboard', to: '/dashboard', icon: 'i-lucide-layout-dashboard' })
  }

  if (canAccess('management')) {
    items.push({ label: 'Management', to: '/management', icon: 'i-lucide-settings' })
  }

  return items
})

const handleLogout = async () => {
  try {
    await logout()
  } catch {
    // Error is handled by useAuth
  }
}
</script>
