<script lang="ts" setup>
definePageMeta({
  layout: 'auth'
})

const toast = useToast()
const router = useRouter()
const isLoading = ref(false)

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleSubmit = async () => {
  if (form.newPassword !== form.confirmPassword) {
    toast.add({
      title: 'Error',
      description: 'New passwords do not match',
      color: 'error'
    })
    return
  }

  if (form.newPassword.length < 8) {
    toast.add({
      title: 'Error',
      description: 'New password must be at least 8 characters',
      color: 'error'
    })
    return
  }

  isLoading.value = true

  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      }
    })

    toast.add({
      title: 'Success',
      description: 'Your password has been changed successfully',
      color: 'success'
    })

    router.push('/auth')
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Failed to change password. Please try again.',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

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
        Change your password
      </p>
    </div>

    <UCard class="w-full">
      <template #header>
        <h1 class="text-xl font-semibold text-center">
          Change Password
        </h1>
      </template>

      <UForm
        :state="form"
        class="space-y-4"
        @submit="handleSubmit"
      >
        <UFormField
          label="Current Password"
          name="currentPassword"
          required
          class="w-full"
        >
          <UInput
            v-model="form.currentPassword"
            type="password"
            placeholder="Enter your current password"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="New Password"
          name="newPassword"
          required
          class="w-full"
        >
          <UInput
            v-model="form.newPassword"
            type="password"
            placeholder="Enter your new password"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Confirm New Password"
          name="confirmPassword"
          required
          class="w-full"
        >
          <UInput
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          :loading="isLoading"
        >
          Change Password
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
