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
        Reset your password
      </p>
    </div>

    <UCard class="w-full">
      <template #header>
        <h1 class="text-xl font-semibold text-center">
          Forgot Password?
        </h1>
      </template>

      <p class="text-muted text-sm mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <UForm
        :state="form"
        class="space-y-4"
        @submit="handleSubmit"
      >
        <UFormField
          label="Email"
          name="email"
          required
          class="w-full"
        >
          <UInput
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          :loading="isLoading"
        >
          Send Reset Link
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-center text-sm">
          <span class="text-muted">Remember your password? </span>
          <UButton
            to="/auth"
            variant="link"
            size="sm"
          >
            Back to login
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

const toast = useToast()
const router = useRouter()
const isLoading = ref(false)

const form = reactive({
  email: ''
})

const handleSubmit = async () => {
  isLoading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.add({
      title: 'Email Sent',
      description: 'Check your email for password reset instructions.',
      color: 'success'
    })

    router.push('/auth')
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to send reset email. Please try again.',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>
