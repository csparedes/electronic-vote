<script lang="ts" setup>
definePageMeta({
  layout: 'authenticated',
  middleware: ['role'],
  roles: ['voter', 'advisor', 'admin', 'dev']
})

interface ActiveElection {
  id: number
  name: string
  description: string | null
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'finished'
  candidates: Array<{
    id: number
    fullName: string
    listName: string
    imageUrl: string | null
  }>
}

const toast = useToast()

const elections = ref<ActiveElection[]>([])
const voteStatus = ref<Record<number, boolean>>({})
const isLoading = ref(false)

async function fetchElections() {
  isLoading.value = true
  try {
    elections.value = await $fetch('/api/elections/active') as ActiveElection[]
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to load elections',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

async function fetchVoteStatus() {
  try {
    voteStatus.value = await $fetch('/api/votes/status') as Record<number, boolean>
  } catch {
    // Silently fail - vote status is not critical
  }
}

onMounted(async () => {
  await Promise.all([fetchElections(), fetchVoteStatus()])
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        Active Elections
      </h1>
    </div>

    <div v-if="isLoading">
      <USkeleton class="h-32 mb-4" />
      <USkeleton class="h-32 mb-4" />
    </div>

    <div
      v-else-if="elections.length === 0"
      class="text-center py-12"
    >
      <UIcon
        name="i-lucide-vote"
        class="size-16 mx-auto text-muted opacity-50"
      />
      <p class="mt-4 text-muted">
        There are no active elections right now
      </p>
      <p class="text-sm text-muted mt-2">
        Check back later for upcoming elections
      </p>
    </div>

    <div
      v-else
      class="flex flex-col gap-4"
    >
      <UCard
        v-for="election in elections"
        :key="election.id"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-semibold">
                {{ election.name }}
              </h3>
              <UBadge
                color="success"
                variant="subtle"
                class="mt-1"
              >
                Active
              </UBadge>
            </div>
            <UBadge
              variant="subtle"
              size="sm"
            >
              {{ election.candidates.length }} candidate{{ election.candidates.length !== 1 ? 's' : '' }}
            </UBadge>
          </div>

          <p
            v-if="election.description"
            class="text-sm text-muted"
          >
            {{ election.description }}
          </p>

          <div class="flex items-center gap-4 text-sm text-muted">
            <div class="flex items-center gap-1">
              <UIcon
                name="i-lucide-calendar"
                class="size-4"
              />
              <span>Ends: {{ formatDate(election.endDate) }}</span>
            </div>
          </div>

          <div
            v-if="voteStatus[election.id]"
            class="flex items-center gap-2 text-sm text-success font-medium"
          >
            <UIcon
              name="i-lucide-check-circle"
              class="size-4"
            />
            <span>You have already voted</span>
          </div>

          <div class="flex justify-end">
            <UButton
              v-if="voteStatus[election.id]"
              variant="outline"
              :to="`/vote/${election.id}`"
            >
              View Results
            </UButton>
            <UButton
              v-else
              icon="i-lucide-vote"
              :to="`/vote/${election.id}`"
            >
              Vote Now
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
