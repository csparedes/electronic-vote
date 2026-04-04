export default defineNuxtRouteMiddleware((to) => {
  const session = useUserSession()

  if (!session.ready.value) {
    return
  }

  const isApiRoute = to.path.startsWith('/api/')
  const isPublicRoute = ['/', '/auth'].includes(to.path)

  if (isApiRoute || isPublicRoute) {
    if (to.path === '/auth' && session.user.value) {
      return navigateTo('/dashboard')
    }
    return
  }

  if (!session.user.value) {
    return navigateTo('/auth')
  }
})
