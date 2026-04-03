export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  const isApiRoute = to.path.startsWith('/api/')
  const isAuthRoute = to.path === '/auth'

  if (isAuthRoute && isAuthenticated.value) {
    return navigateTo('/dashboard')
  }

  if (isApiRoute) return

  if (!isAuthenticated.value) {
    return navigateTo('/auth')
  }
})
