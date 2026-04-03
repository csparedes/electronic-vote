<template>
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <NuxtLink
        to="/"
        class="inline-block"
      >
        <AppLogo class="w-auto h-8" />
      </NuxtLink>
      <p class="text-muted mt-2">
        Electronic voting system
      </p>
    </div>

    <UCard class="w-full">
      <template #header>
        <h1 class="text-xl font-semibold text-center">
          {{ activeTab === 'login' ? 'Welcome back' : 'Create account' }}
        </h1>
      </template>

      <UTabs
        v-model="activeTab"
        :items="tabs"
        class="mb-6"
      />

      <div v-if="activeTab === 'login'">
        <UForm
          :state="loginForm"
          class="space-y-4"
          @submit="handleLogin"
        >
          <UFormField
            label="Email"
            name="email"
            required
            class="w-full"
          >
            <UInput
              v-model="loginForm.email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Password"
            name="password"
            required
            class="w-full"
          >
            <UInput
              v-model="loginForm.password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            block
            :loading="isLoading"
          >
            Sign in
          </UButton>
        </UForm>
      </div>

      <div v-else>
        <UForm
          :state="registerForm"
          class="space-y-4"
          @submit="handleRegister"
        >
          <UFormField
            label="Identification"
            name="identification"
            required
            class="w-full"
          >
            <UInput
              v-model="registerForm.identification"
              placeholder="Your ID number"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Full Name"
            name="name"
            required
            class="w-full"
          >
            <UInput
              v-model="registerForm.name"
              placeholder="John Doe"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Email"
            name="email"
            required
            class="w-full"
          >
            <UInput
              v-model="registerForm.email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Password"
            name="password"
            required
            class="w-full"
          >
            <UInput
              v-model="registerForm.password"
              type="password"
              placeholder="Min 6 characters"
              autocomplete="new-password"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            block
            :loading="isLoading"
          >
            Create account
          </UButton>
        </UForm>
      </div>

      <template #footer>
        <div class="text-center text-sm text-muted">
          <UButton
            to="/auth/change-password"
            variant="link"
            size="sm"
          >
            Forgot password?
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { login, register, isLoading } = useAuth()

const tabs = [
  { label: 'Login', value: 'login' },
  { label: 'Register', value: 'register' }
]

const activeTab = ref(route.query.tab === 'register' ? 'register' : 'login')

watch(activeTab, (newTab) => {
  router.replace({ query: { tab: newTab } })
})

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  identification: '',
  name: '',
  email: '',
  password: ''
})

const handleLogin = async () => {
  try {
    console.log('Attempting login...')
    const result = await login(loginForm)
    console.log('Login result:', result)
    toast.add({
      title: 'Success',
      description: 'Welcome back!',
      color: 'success'
    })
    await navigateTo('/dashboard')
  } catch (err: unknown) {
    console.error('Login error:', err)
    const errObj = err as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: errObj?.data?.message || 'Login failed',
      color: 'error'
    })
  }
}

const handleRegister = async () => {
  try {
    await register(registerForm)
    toast.add({
      title: 'Success',
      description: 'Account created successfully! Please login.',
      color: 'success'
    })
    activeTab.value = 'login'
    loginForm.email = registerForm.email
    loginForm.password = ''
  } catch (err: unknown) {
    const errObj = err as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: errObj?.data?.message || 'Registration failed',
      color: 'error'
    })
  }
}
</script>
