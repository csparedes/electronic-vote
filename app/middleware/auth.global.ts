export default defineNuxtRouteMiddleware((to) => {
  const session = useUserSession()

  if (!session.ready.value) {
    return
  }

  const isApiRoute = to.path.startsWith('/api/')
  const isAuthRoute = to.path === '/auth'

  if (isAuthRoute && session.user.value) {
    return navigateTo('/dashboard')
  }

  if (isApiRoute) return

  if (!session.user.value) {
    return navigateTo('/auth')
  }
})
