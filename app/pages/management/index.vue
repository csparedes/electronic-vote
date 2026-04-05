<script lang="ts" setup>
definePageMeta({
  layout: 'authenticated',
  roles: ['admin', 'dev']
})

const toast = useToast()

const activeTab = ref('elections')

const tabs = [
  { label: 'Elecciones', value: 'elections' },
  { label: 'Candidatos', value: 'candidates' }
]

const elections = ref<Array<{
  id: number
  name: string
  description: string | null
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'finished'
  candidates?: Array<{
    id: number
    fullName: string
    listName: string
    imageUrl: string | null
  }>
}>>([])

const candidates = ref<Array<{
  id: number
  fullName: string
  listName: string
  imageUrl: string | null
}>>([])

const isLoadingElections = ref(false)
const isLoadingCandidates = ref(false)

async function fetchElections() {
  isLoadingElections.value = true
  try {
    const data = await $fetch('/api/elections')
    elections.value = data as typeof elections.value
  } catch {
    toast.add({
      title: 'Error',
      description: 'No se pudieron cargar las elecciones',
      color: 'error'
    })
  } finally {
    isLoadingElections.value = false
  }
}

async function fetchCandidates() {
  isLoadingCandidates.value = true
  try {
    const data = await $fetch('/api/candidates')
    candidates.value = data as typeof candidates.value
  } catch {
    toast.add({
      title: 'Error',
      description: 'No se pudieron cargar los candidatos',
      color: 'error'
    })
  } finally {
    isLoadingCandidates.value = false
  }
}

onMounted(() => {
  fetchElections()
  fetchCandidates()
})

const electionModalOpen = ref(false)
const electionModalData = ref<{
  id?: number
  name: string
  description: string
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'finished'
} | undefined>()

const candidateModalOpen = ref(false)
const candidateModalData = ref<{
  id?: number
  fullName: string
  listName: string
  imageUrl: string
} | undefined>()

const candidatesModalOpen = ref(false)
const candidatesModalData = ref<{
  id: number
  name: string
} | undefined>()

const deleteConfirmOpen = ref(false)
const deleteConfirmData = ref<{
  type: 'election' | 'candidate'
  id: number
  name: string
}>()

function openNewElectionModal() {
  electionModalData.value = undefined
  electionModalOpen.value = true
}

function openEditElectionModal(election: typeof elections.value[0]) {
  electionModalData.value = {
    id: election.id,
    name: election.name,
    description: election.description || '',
    startDate: election.startDate,
    endDate: election.endDate,
    status: election.status
  }
  electionModalOpen.value = true
}

async function handleSaveElection(data: typeof electionModalData.value) {
  try {
    if (data?.id) {
      await $fetch(`/api/elections/${data.id}`, {
        method: 'PUT',
        body: data
      })
      toast.add({
        title: 'Éxito',
        description: 'Elección actualizada correctamente',
        color: 'success'
      })
    } else {
      await $fetch('/api/elections', {
        method: 'POST',
        body: data
      })
      toast.add({
        title: 'Éxito',
        description: 'Elección creada correctamente',
        color: 'success'
      })
    }
    electionModalOpen.value = false
    await fetchElections()
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Error al guardar la elección',
      color: 'error'
    })
  }
}

function openCandidatesModal(election: typeof elections.value[0]) {
  candidatesModalData.value = {
    id: election.id,
    name: election.name
  }
  candidatesModalOpen.value = true
}

async function handleAddCandidate(electionId: number, candidateId: number) {
  try {
    await $fetch(`/api/elections/${electionId}/candidates`, {
      method: 'POST',
      body: { candidateId }
    })
    await fetchElections()
    await fetchCandidates()
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Error al agregar candidato',
      color: 'error'
    })
  }
}

async function handleRemoveCandidate(electionId: number, candidateId: number) {
  try {
    await $fetch(`/api/elections/${electionId}/candidates`, {
      method: 'DELETE',
      body: { candidateId }
    })
    await fetchElections()
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Error al remover candidato',
      color: 'error'
    })
  }
}

function openDeleteConfirm(type: 'election' | 'candidate', id: number, name: string) {
  deleteConfirmData.value = { type, id, name }
  deleteConfirmOpen.value = true
}

async function handleDelete() {
  if (!deleteConfirmData.value) return

  const { type, id } = deleteConfirmData.value

  try {
    if (type === 'election') {
      await $fetch(`/api/elections/${id}`, { method: 'DELETE' })
      toast.add({
        title: 'Éxito',
        description: 'Elección eliminada correctamente',
        color: 'success'
      })
      await fetchElections()
    } else {
      await $fetch(`/api/candidates/${id}`, { method: 'DELETE' })
      toast.add({
        title: 'Éxito',
        description: 'Candidato eliminado correctamente',
        color: 'success'
      })
      await fetchCandidates()
    }
    deleteConfirmOpen.value = false
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Error al eliminar',
      color: 'error'
    })
  }
}

function openNewCandidateModal() {
  candidateModalData.value = undefined
  candidateModalOpen.value = true
}

function openEditCandidateModal(candidate: typeof candidates.value[0]) {
  candidateModalData.value = {
    id: candidate.id,
    fullName: candidate.fullName,
    listName: candidate.listName,
    imageUrl: candidate.imageUrl || ''
  }
  candidateModalOpen.value = true
}

async function handleSaveCandidate(data: typeof candidateModalData.value) {
  try {
    if (data?.id) {
      await $fetch(`/api/candidates/${data.id}`, {
        method: 'PUT',
        body: data
      })
      toast.add({
        title: 'Éxito',
        description: 'Candidato actualizado correctamente',
        color: 'success'
      })
    } else {
      await $fetch('/api/candidates', {
        method: 'POST',
        body: data
      })
      toast.add({
        title: 'Éxito',
        description: 'Candidato creado correctamente',
        color: 'success'
      })
    }
    candidateModalOpen.value = false
    await fetchCandidates()
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Error al guardar el candidato',
      color: 'error'
    })
  }
}

const importModalOpen = ref(false)
const importCsvData = ref('')
const isImporting = ref(false)

function openImportModal() {
  importCsvData.value = ''
  importModalOpen.value = true
}

async function handleImport() {
  if (!importCsvData.value.trim()) {
    toast.add({
      title: 'Error',
      description: 'Debes ingresar datos CSV',
      color: 'error'
    })
    return
  }

  isImporting.value = true

  try {
    const result = await $fetch('/api/candidates/import', {
      method: 'POST',
      body: { csv: importCsvData.value }
    }) as { message: string }

    toast.add({
      title: 'Éxito',
      description: result.message,
      color: 'success'
    })

    importModalOpen.value = false
    await fetchCandidates()
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Error al importar candidatos',
      color: 'error'
    })
  } finally {
    isImporting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        Gestión
      </h1>
    </div>

    <UTabs
      v-model="activeTab"
      :items="tabs"
    />

    <div v-if="activeTab === 'elections'">
      <div class="flex justify-end mb-4">
        <UButton
          icon="i-lucide-plus"
          @click="openNewElectionModal"
        >
          Nueva Elección
        </UButton>
      </div>

      <div v-if="isLoadingElections">
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
          No hay elecciones creadas
        </p>
        <UButton
          variant="outline"
          class="mt-4"
          @click="openNewElectionModal"
        >
          Crear primera elección
        </UButton>
      </div>

      <div
        v-else
        class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <ManagementElectionCard
          v-for="election in elections"
          :key="election.id"
          :election="election"
          @edit="openEditElectionModal"
          @manage-candidates="openCandidatesModal"
          @delete="openDeleteConfirm('election', election.id, election.name)"
        />
      </div>
    </div>

    <div v-else>
      <div class="flex justify-end gap-2 mb-4">
        <UButton
          variant="outline"
          icon="i-lucide-upload"
          @click="openImportModal"
        >
          Importar CSV
        </UButton>
        <UButton
          icon="i-lucide-plus"
          @click="openNewCandidateModal"
        >
          Nuevo Candidato
        </UButton>
      </div>

      <div v-if="isLoadingCandidates">
        <USkeleton class="h-20 mb-2" />
        <USkeleton class="h-20 mb-2" />
      </div>

      <div
        v-else-if="candidates.length === 0"
        class="text-center py-12"
      >
        <UIcon
          name="i-lucide-users"
          class="size-16 mx-auto text-muted opacity-50"
        />
        <p class="mt-4 text-muted">
          No hay candidatos creados
        </p>
        <UButton
          variant="outline"
          class="mt-4"
          @click="openNewCandidateModal"
        >
          Crear primer candidato
        </UButton>
      </div>

      <div
        v-else
        class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <ManagementCandidateCard
          v-for="candidate in candidates"
          :key="candidate.id"
          :candidate="candidate"
          @edit="openEditCandidateModal"
          @delete="openDeleteConfirm('candidate', candidate.id, candidate.fullName)"
        />
      </div>
    </div>

    <ManagementElectionModal
      v-model:open="electionModalOpen"
      :election="electionModalData"
      @save="handleSaveElection"
    />

    <ManagementCandidateModal
      v-model:open="candidateModalOpen"
      :candidate="candidateModalData"
      @save="handleSaveCandidate"
    />

    <ManagementElectionCandidatesModal
      :open="candidatesModalOpen"
      :election="candidatesModalData || { id: 0, name: '' }"
      :election-candidates="elections.find(e => e.id === candidatesModalData?.id)?.candidates || []"
      :all-candidates="candidates"
      @close="candidatesModalOpen = false"
      @add-candidate="(id) => candidatesModalData && handleAddCandidate(candidatesModalData.id, id)"
      @remove-candidate="(id) => candidatesModalData && handleRemoveCandidate(candidatesModalData.id, id)"
    />

    <UModal
      v-model:open="deleteConfirmOpen"
      title="Confirmar eliminación"
      :dismissible="false"
    >
      <p class="text-muted">
        ¿Estás seguro de eliminar {{ deleteConfirmData?.type === 'election' ? 'la elección' : 'el candidato' }} "{{ deleteConfirmData?.name }}"? Esta acción no se puede deshacer.
      </p>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="outline"
            @click="deleteConfirmOpen = false"
          >
            Cancelar
          </UButton>
          <UButton
            color="error"
            @click="handleDelete"
          >
            Eliminar
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="importModalOpen"
      title="Importar Candidatos desde CSV"
    >
      <UCard>
        <div class="space-y-4">
          <p class="text-sm text-muted">
            Pega el contenido CSV con las columnas: <code class="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">fullName</code>, <code class="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">listName</code>, <code class="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">imageUrl</code> (opcional)
          </p>

          <UTextarea
            v-model="importCsvData"
            placeholder="fullName,listName,imageUrl
Juan Pérez,Lista Azul,https://example.com/juan.jpg
María García,Lista Roja,"
            :rows="8"
          />

          <UAlert
            color="info"
            variant="soft"
            title="Formato esperado"
            description="La primera fila debe contener los encabezados. Las filas siguientes contienen los datos."
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="outline"
              @click="importModalOpen = false"
            >
              Cancelar
            </UButton>
            <UButton
              :loading="isImporting"
              @click="handleImport"
            >
              Importar
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
