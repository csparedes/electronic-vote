<script lang="ts" setup>
interface Candidate {
  id: number
  fullName: string
  listName: string
  imageUrl: string | null
}

interface Props {
  election: {
    id: number
    name: string
  }
  electionCandidates: Candidate[]
  allCandidates: Candidate[]
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  addCandidate: [candidateId: number]
  removeCandidate: [candidateId: number]
}>()

const selectedIds = ref<Set<number>>(new Set(props.electionCandidates.map(c => c.id)))

watch(() => props.electionCandidates, (newCandidates) => {
  selectedIds.value = new Set(newCandidates.map(c => c.id))
}, { deep: true })

const availableCandidates = computed(() => {
  return props.allCandidates.filter(c => !selectedIds.value.has(c.id))
})

const assignedCandidates = computed(() => {
  return props.electionCandidates
})

function toggleCandidate(candidate: Candidate) {
  if (selectedIds.value.has(candidate.id)) {
    selectedIds.value.delete(candidate.id)
    emit('removeCandidate', candidate.id)
  } else {
    selectedIds.value.add(candidate.id)
    emit('addCandidate', candidate.id)
  }
}
</script>

<template>
  <UModal
    :open="open"
    :title="`Gestionar Candidatos: ${election.name}`"
    class="max-w-2xl"
    @update:open="emit('close')"
  >
    <UCard>
      <div class="space-y-6">
        <div>
          <h4 class="font-medium mb-3 flex items-center gap-2">
            <UIcon
              name="i-lucide-check-circle"
              class="size-5 text-success"
            />
            Candidatos Asignados ({{ assignedCandidates.length }})
          </h4>

          <div
            v-if="assignedCandidates.length === 0"
            class="text-center py-8 text-muted"
          >
            <UIcon
              name="i-lucide-inbox"
              class="size-12 mx-auto mb-2 opacity-50"
            />
            <p>No hay candidatos asignados</p>
          </div>

          <div
            v-else
            class="space-y-2"
          >
            <ManagementCandidateCard
              v-for="candidate in assignedCandidates"
              :key="candidate.id"
              :candidate="candidate"
              :selectable="true"
              :selected="true"
              @toggle="toggleCandidate"
            />
          </div>
        </div>

        <USeparator />

        <div>
          <h4 class="font-medium mb-3 flex items-center gap-2">
            <UIcon
              name="i-lucide-plus-circle"
              class="size-5 text-primary"
            />
            Candidatos Disponibles ({{ availableCandidates.length }})
          </h4>

          <div
            v-if="availableCandidates.length === 0"
            class="text-center py-8 text-muted"
          >
            <UIcon
              name="i-lucide-user-plus"
              class="size-12 mx-auto mb-2 opacity-50"
            />
            <p>No hay candidatos disponibles</p>
            <p class="text-sm mt-1">
              Crea nuevos candidatos en la pestaña de Candidatos
            </p>
          </div>

          <div
            v-else
            class="space-y-2 max-h-64 overflow-y-auto"
          >
            <ManagementCandidateCard
              v-for="candidate in availableCandidates"
              :key="candidate.id"
              :candidate="candidate"
              :selectable="true"
              :selected="false"
              @toggle="toggleCandidate"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton @click="emit('close')">
            Cerrar
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
