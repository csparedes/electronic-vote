import { ROLES, type Role } from '~~/server/database/schema'

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [ROLES.VOTER]: ['home', 'auth', 'profile'],
  [ROLES.ADVISOR]: ['home', 'auth', 'profile', 'dashboard'],
  [ROLES.ADMIN]: ['home', 'auth', 'profile', 'dashboard', 'management'],
  [ROLES.DEV]: ['home', 'auth', 'profile', 'dashboard', 'management']
}

export const usePermissions = () => {
  const { user } = useAuth()

  const hasRole = (roles: Role | Role[]): boolean => {
    if (!user.value) return false
    const allowedRoles = Array.isArray(roles) ? roles : [roles]
    return allowedRoles.includes(user.value.role as Role)
  }

  const isAdmin = computed(() => hasRole(ROLES.ADMIN))
  const isDev = computed(() => hasRole(ROLES.DEV))
  const isAdvisor = computed(() => hasRole(ROLES.ADVISOR))
  const isVoter = computed(() => hasRole(ROLES.VOTER))

  const canAccess = (module: string): boolean => {
    if (!user.value) return false
    const userRole = user.value.role as Role
    const permissions = ROLE_PERMISSIONS[userRole]
    return permissions?.includes(module) ?? false
  }

  const hasAccessToRoute = (routeName: string): boolean => {
    const routeModule = routeName.split('/')[1] || 'home'
    return canAccess(routeModule)
  }

  return {
    hasRole,
    isAdmin,
    isDev,
    isAdvisor,
    isVoter,
    canAccess,
    hasAccessToRoute,
    ROLES
  }
}
