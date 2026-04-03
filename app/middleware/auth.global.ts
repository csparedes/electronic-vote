export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth()

  const route = useRoute()

  const publicRoutes = ['/', '/auth']
  const isPublicRoute = publicRoutes.some(path => path === route.path)

  if (isPublicRoute) return

  if (!isAuthenticated.value) {
    return navigateTo('/auth')
  }
})
