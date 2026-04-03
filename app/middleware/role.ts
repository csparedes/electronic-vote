import type { Role } from '~/server/database/schema'

export default defineNuxtRouteMiddleware((to) => {
  const { hasRole } = usePermissions()

  const requiredRoles = to.meta.roles as Role[] | undefined

  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasRole(requiredRoles)) {
      throw createError({
        statusCode: 403,
        message: 'Access denied. Insufficient permissions.'
      })
    }
  }
})
