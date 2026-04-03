interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  identification: string
  email: string
  password: string
  name: string
}

export const useAuth = () => {
  const session = useUserSession()

  const user = computed(() => session.user.value)
  const isAuthenticated = computed(() => !!session.user.value)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      return response
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      error.value = err.data?.message || 'Login failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: data
      })
      return response
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      error.value = err.data?.message || 'Registration failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
      await session.clear()
      await nextTick()
      await navigateTo('/')
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      error.value = err.data?.message || 'Logout failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout
  }
}
