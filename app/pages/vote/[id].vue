<script lang="ts" setup>
definePageMeta({
  middleware: ['role'],
  roles: ['voter', 'advisor', 'admin', 'dev']
})

interface Candidate {
  id: number
  fullName: string
  listName: string
  imageUrl: string | null
}

interface Election {
  id: number
  name: string
  description: string | null
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'finished'
  candidates: Candidate[]
}

const route = useRoute()
const router = useRouter()
const toast = useToast()

const electionId = Number(route.params.id)
const election = ref<Election | null>(null)
const hasVoted = ref(false)
const isLoading = ref(true)
const isVoting = ref(false)
const selectedCandidateId = ref<number | null>(null)
const showConfirmModal = ref(false)

async function fetchElection() {
  isLoading.value = true
  try {
    election.value = await $fetch(`/api/elections/${electionId}`) as Election
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to load election',
      color: 'error'
    })
    router.push('/vote')
  } finally {
    isLoading.value = false
  }
}

async function fetchVoteStatus() {
  try {
    const status = await $fetch('/api/votes/status', {
      params: { electionId }
    }) as Record<number, boolean>
    hasVoted.value = !!status[electionId]
  } catch {
    // Silently fail
  }
}

onMounted(async () => {
  await Promise.all([fetchElection(), fetchVoteStatus()])
})

function selectCandidate(candidateId: number) {
  if (!hasVoted.value && election.value?.status === 'active') {
    selectedCandidateId.value = candidateId
  }
}

function confirmVote() {
  if (!selectedCandidateId.value) return
  showConfirmModal.value = true
}

async function submitVote() {
  if (!selectedCandidateId.value) return

  isVoting.value = true
  try {
    await $fetch('/api/votes', {
      method: 'POST',
      body: {
        electionId,
        candidateId: selectedCandidateId.value
      }
    })
    toast.add({
      title: 'Vote Cast!',
      description: 'Your vote has been recorded successfully',
      color: 'success'
    })
    hasVoted.value = true
    showConfirmModal.value = false
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Failed to cast vote',
      color: 'error'
    })
  } finally {
    isVoting.value = false
  }
}

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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <USkeleton class="h-40" />
        <USkeleton class="h-40" />
        <USkeleton class="h-40" />
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
          :color="hasVoted ? 'success' : 'warning'"
          variant="subtle"
        >
          {{ hasVoted ? 'Voted' : 'Pending' }}
        </UBadge>
      </div>

      <div class="flex items-center gap-4 text-sm text-muted mt-3">
        <div class="flex items-center gap-1">
          <UIcon
            name="i-lucide-calendar"
            class="size-4"
          />
          <span>Ends: {{ formatDate(election.endDate) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon
            name="i-lucide-users"
            class="size-4"
          />
          <span>{{ election.candidates.length }} candidates</span>
        </div>
      </div>

      <UAlert
        v-if="hasVoted"
        color="success"
        variant="soft"
        icon="i-lucide-check-circle"
        title="You have already voted"
        description="Your vote has been recorded. You cannot vote again in this election."
        class="mt-4"
      />

      <div
        v-if="!hasVoted && election.status === 'active'"
        class="mt-6"
      >
        <h2 class="text-lg font-semibold mb-4">
          Select a candidate
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="candidate in election.candidates"
            :key="candidate.id"
            class="cursor-pointer"
            @click="selectCandidate(candidate.id)"
          >
            <UCard
              :class="{
                'ring-2 ring-primary': selectedCandidateId === candidate.id,
                'hover:ring-1 hover:ring-neutral': selectedCandidateId !== candidate.id
              }"
            >
              <div class="text-center space-y-3">
                <div
                  v-if="candidate.imageUrl"
                  class="mx-auto"
                >
                  <img
                    :src="candidate.imageUrl"
                    :alt="candidate.fullName"
                    class="w-20 h-20 rounded-full object-cover mx-auto"
                  >
                </div>
                <div
                  v-else
                  class="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto"
                >
                  <UIcon
                    name="i-lucide-user"
                    class="size-8 text-neutral-400"
                  />
                </div>

                <h3 class="font-semibold">
                  {{ candidate.fullName }}
                </h3>
                <UBadge
                  variant="subtle"
                  size="sm"
                >
                  {{ candidate.listName }}
                </UBadge>

                <div
                  v-if="selectedCandidateId === candidate.id"
                  class="flex items-center justify-center gap-1 text-sm text-primary font-medium"
                >
                  <UIcon
                    name="i-lucide-check-circle"
                    class="size-4"
                  />
                  <span>Selected</span>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <div
          v-if="election.candidates.length > 0"
          class="flex justify-end mt-6"
        >
          <UButton
            size="lg"
            icon="i-lucide-vote"
            :disabled="!selectedCandidateId"
            @click="confirmVote"
          >
            Cast Vote
          </UButton>
        </div>
      </div>

      <div
        v-if="!hasVoted && election.candidates.length === 0 && !isLoading"
        class="text-center py-8"
      >
        <UIcon
          name="i-lucide-users"
          class="size-12 mx-auto text-muted opacity-50"
        />
        <p class="mt-4 text-muted">
          No candidates have been added to this election yet
        </p>
      </div>
    </div>

    <UModal
      v-model:open="showConfirmModal"
      title="Confirm Your Vote"
      :dismissible="false"
    >
      <template #body>
        <div class="space-y-3">
          <p>You are about to cast your vote for:</p>
          <p class="font-semibold text-lg">
            {{ election?.candidates.find(c => c.id === selectedCandidateId)?.fullName }}
          </p>
          <UAlert
            color="warning"
            variant="soft"
            icon="i-lucide-alert-triangle"
            title="This action cannot be undone"
            description="Once you submit your vote, you cannot change it."
          />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="outline"
            @click="showConfirmModal = false"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            :loading="isVoting"
            @click="submitVote"
          >
            Confirm Vote
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
