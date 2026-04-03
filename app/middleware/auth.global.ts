export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  const isApiRoute = to.path.startsWith('/api/')
  const isPublicRoute = isApiRoute || ['/', '/auth'].includes(to.path)

  if (isPublicRoute) return

  if (!isAuthenticated.value) {
    return navigateTo('/auth')
  }
})
