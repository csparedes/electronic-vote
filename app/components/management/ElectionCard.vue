<script lang="ts" setup>
interface Props {
  election: {
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
  }
}

defineProps<Props>()
const emit = defineEmits<{
  edit: [election: Props['election']]
  manageCandidates: [election: Props['election']]
  delete: [election: Props['election']]
}>()

const statusColors: Record<string, 'neutral' | 'success' | 'warning'> = {
  draft: 'neutral',
  active: 'success',
  finished: 'warning'
}

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  active: 'Activa',
  finished: 'Finalizada'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <UCard class="w-full">
    <template #header>
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold">
            {{ election.name }}
          </h3>
          <UBadge
            :color="statusColors[election.status]"
            variant="subtle"
            class="mt-1"
          >
            {{ statusLabels[election.status] }}
          </UBadge>
        </div>
        <UDropdownMenu
          :items="[[
            { label: 'Editar', icon: 'i-lucide-pencil', click: () => emit('edit', election) },
            { label: 'Gestionar Candidatos', icon: 'i-lucide-users', click: () => emit('manageCandidates', election) },
            { type: 'separator' },
            { label: 'Eliminar', icon: 'i-lucide-trash-2', color: 'error', click: () => emit('delete', election) }
          ]]"
        >
          <UButton
            variant="ghost"
            icon="i-lucide-more-vertical"
            color="neutral"
          />
        </UDropdownMenu>
      </div>
    </template>

    <div class="space-y-3">
      <p
        v-if="election.description"
        class="text-sm text-muted"
      >
        {{ election.description }}
      </p>

      <div class="flex items-center gap-2 text-sm">
        <UIcon
          name="i-lucide-calendar"
          class="size-4"
        />
        <span>Inicio:</span>
        <span class="font-medium">{{ formatDate(election.startDate) }}</span>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <UIcon
          name="i-lucide-calendar-x"
          class="size-4"
        />
        <span>Fin:</span>
        <span class="font-medium">{{ formatDate(election.endDate) }}</span>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <UIcon
          name="i-lucide-user"
          class="size-4"
        />
        <span>Candidatos:</span>
        <UBadge
          variant="subtle"
          size="sm"
        >
          {{ election.candidates?.length || 0 }}
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
