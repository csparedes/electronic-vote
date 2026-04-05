<script lang="ts" setup>
interface Props {
  candidate: {
    id: number
    fullName: string
    listName: string
    imageUrl: string | null
  }
  selectable?: boolean
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selected: false
})

const emit = defineEmits<{
  edit: [candidate: Props['candidate']]
  delete: [candidate: Props['candidate']]
  toggle: [candidate: Props['candidate']]
}>()

const selectable = computed(() => props.selectable)
const selected = computed(() => props.selected)
</script>

<template>
  <UCard
    class="cursor-pointer transition-all w-full"
    :class="{
      'ring-2 ring-primary': selected,
      'hover:ring-1 hover:ring-primary/50': selectable
    }"
    @click="selectable && emit('toggle', candidate)"
  >
    <div class="flex items-center gap-4">
      <UAvatar
        v-if="candidate.imageUrl"
        :src="candidate.imageUrl"
        :alt="candidate.fullName"
        size="lg"
      />
      <UAvatar
        v-else
        :name="candidate.fullName"
        size="lg"
      />

      <div class="flex-1 min-w-0">
        <h4 class="font-medium truncate">
          {{ candidate.fullName }}
        </h4>
        <UBadge
          variant="outline"
          size="sm"
          class="mt-1"
        >
          {{ candidate.listName }}
        </UBadge>
      </div>

      <div
        v-if="selectable"
        class="flex-shrink-0"
      >
        <UCheckbox
          :model-value="selected"
          @click.stop
          @update:model-value="emit('toggle', candidate)"
        />
      </div>

      <UDropdownMenu
        v-else
        :items="[[
          { label: 'Editar', icon: 'i-lucide-pencil', click: () => emit('edit', candidate) },
          { type: 'separator' },
          { label: 'Eliminar', icon: 'i-lucide-trash-2', color: 'error', click: () => emit('delete', candidate) }
        ]]"
      >
        <UButton
          variant="ghost"
          icon="i-lucide-more-vertical"
          color="neutral"
        />
      </UDropdownMenu>
    </div>
  </UCard>
</template>
