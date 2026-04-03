export default defineEventHandler(async (event) => {
  console.log('Logout endpoint called')
  await clearUserSession(event)
  console.log('Session cleared')
  return {
    message: 'Logout successful'
  }
})
