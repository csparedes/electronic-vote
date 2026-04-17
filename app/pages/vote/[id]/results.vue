<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['voter', 'advisor', 'admin', 'dev']
})

interface CandidateResult {
  id: number
  fullName: string
  listName: string
  imageUrl: string | null
  voteCount: number
  percentage: number
}

interface ElectionResult {
  id: number
  name: string
  description: string | null
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'finished'
}

const route = useRoute()
const electionId = Number(route.params.id)
const election = ref<ElectionResult | null>(null)
const results = ref<CandidateResult[]>([])
const totalVotes = ref(0)
const isLoading = ref(true)

const winningCandidate = computed(() => {
  if (results.value.length === 0) return null
  return results.value[0]
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

const fetchResults = async () => {
  isLoading.value = true
  try {
    const data = await $fetch(`/api/elections/${electionId}/results`) as {
      election: ElectionResult
      totalVotes: number
      results: CandidateResult[]
    }
    election.value = data.election
    results.value = data.results
    totalVotes.value = data.totalVotes
  } catch {
    console.error('Failed to load results')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchResults)
</script>

<template>
  <div class="space-y-6">
    <div>
      <UButton
        variant="ghost"
        icon="i-lucide-arrow-left"
        to="/vote"
      >
        Back to Elections
      </UButton>
    </div>

    <div v-if="isLoading">
      <USkeleton class="h-8 w-48 mb-4" />
      <USkeleton class="h-4 w-96 mb-8" />
      <div class="space-y-4">
        <USkeleton class="h-20" />
        <USkeleton class="h-20" />
        <USkeleton class="h-20" />
      </div>
    </div>

    <div v-else-if="election">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold">
            {{ election.name }}
          </h1>
          <p
            v-if="election.description"
            class="text-muted mt-1"
          >
            {{ election.description }}
          </p>
        </div>
        <UBadge
          :color="election.status === 'finished' ? 'success' : election.status === 'active' ? 'warning' : 'neutral'"
          variant="subtle"
        >
          {{ election.status }}
        </UBadge>
      </div>

      <div class="flex items-center gap-4 text-sm text-muted mt-3">
        <div class="flex items-center gap-1">
          <UIcon
            name="i-lucide-calendar"
            class="size-4"
          />
          <span>Ended: {{ formatDate(election.endDate) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon
            name="i-lucide-vote"
            class="size-4"
          />
          <span>{{ totalVotes }} total votes</span>
        </div>
      </div>

      <UAlert
        v-if="winningCandidate && winningCandidate.voteCount > 0"
        color="success"
        variant="soft"
        icon="i-lucide-trophy"
        title="Leading Candidate"
        :description="`${winningCandidate.fullName} (${winningCandidate.listName}) with ${winningCandidate.voteCount} votes (${winningCandidate.percentage}%)`"
        class="mt-4"
      />

      <div
        v-if="results.length > 0"
        class="mt-6 space-y-4"
      >
        <h2 class="text-lg font-semibold">
          Vote Results
        </h2>

        <div
          v-for="(candidate, index) in results"
          :key="candidate.id"
          class="relative"
        >
          <UCard
            :class="{
              'ring-2 ring-primary': index === 0 && candidate.voteCount > 0,
              'opacity-75': index > 2
            }"
          >
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0">
                <div
                  v-if="candidate.imageUrl"
                  class="w-12 h-12 rounded-full overflow-hidden"
                >
                  <img
                    :src="candidate.imageUrl"
                    :alt="candidate.fullName"
                    class="w-full h-full object-cover"
                  >
                </div>
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
                >
                  <UIcon
                    name="i-lucide-user"
                    class="size-6 text-neutral-400"
                  />
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span
                    v-if="index === 0 && candidate.voteCount > 0"
                    class="flex-shrink-0"
                  >
                    <UIcon
                      name="i-lucide-crown"
                      class="size-4 text-primary"
                    />
                  </span>
                  <h3 class="font-semibold truncate">
                    {{ candidate.fullName }}
                  </h3>
                  <UBadge
                    variant="subtle"
                    size="sm"
                  >
                    {{ candidate.listName }}
                  </UBadge>
                </div>

                <div class="mt-2 flex items-center gap-3">
                  <div class="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-full h-3 overflow-hidden">
                    <div
                      class="h-full bg-primary rounded-full transition-all duration-500"
                      :style="{ width: `${candidate.percentage}%` }"
                    />
                  </div>
                  <div class="flex-shrink-0 text-sm font-medium w-20 text-right">
                    {{ candidate.voteCount }} votes
                    <span class="text-muted">({{ candidate.percentage }}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <div
        v-else
        class="text-center py-12"
      >
        <UIcon
          name="i-lucide-chart-bar"
          class="size-16 mx-auto text-muted opacity-50"
        />
        <p class="mt-4 text-lg font-medium">
          No votes have been cast yet
        </p>
        <p class="text-muted">
          Results will be available once voting begins
        </p>
      </div>
    </div>
  </div>
</template>
