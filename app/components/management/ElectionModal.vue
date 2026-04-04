<script lang="ts" setup>
interface Props {
  election?: {
    id?: number
    name: string
    description: string
    startDate: string
    endDate: string
    status: 'draft' | 'active' | 'finished'
  }
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [data: {
    name: string
    description: string
    startDate: string
    endDate: string
    status: 'draft' | 'active' | 'finished'
  }]
}>()

const isEditing = computed(() => !!props.election?.id)

const form = reactive({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'draft' as 'draft' | 'active' | 'finished'
})

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.election?.id) {
      form.name = props.election.name
      form.description = props.election.description || ''
      form.startDate = formatDateForInput(props.election.startDate)
      form.endDate = formatDateForInput(props.election.endDate)
      form.status = props.election.status
    } else {
      form.name = ''
      form.description = ''
      form.startDate = ''
      form.endDate = ''
      form.status = 'draft'
    }
  }
})

function formatDateForInput(dateStr: string) {
  const date = new Date(dateStr)
  return date.toISOString().slice(0, 16)
}

const isLoading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  if (!form.name || !form.startDate || !form.endDate) {
    error.value = 'Todos los campos obligatorios deben ser completados'
    return
  }

  if (new Date(form.endDate) <= new Date(form.startDate)) {
    error.value = 'La fecha de fin debe ser posterior a la fecha de inicio'
    return
  }

  isLoading.value = true
  error.value = null

  emit('save', {
    name: form.name,
    description: form.description,
    startDate: form.startDate,
    endDate: form.endDate,
    status: form.status
  })
}
</script>

<template>
  <UModal
    :open="open"
    title="Elección"
    @update:open="emit('close')"
  >
    <UCard>
      <UForm
        :state="form"
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <UFormField
          label="Nombre"
          name="name"
          required
          class="w-full"
        >
          <UInput
            v-model="form.name"
            placeholder="Elecciones Presidenciales 2026"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Descripción"
          name="description"
          class="w-full"
        >
          <UTextarea
            v-model="form.description"
            placeholder="Descripción de la elección..."
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Fecha de Inicio"
          name="startDate"
          required
          class="w-full"
        >
          <UInput
            v-model="form.startDate"
            type="datetime-local"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Fecha de Fin"
          name="endDate"
          required
          class="w-full"
        >
          <UInput
            v-model="form.endDate"
            type="datetime-local"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Estado"
          name="status"
          class="w-full"
        >
          <USelect
            v-model="form.status"
            :items="[
              { label: 'Borrador', value: 'draft' },
              { label: 'Activa', value: 'active' },
              { label: 'Finalizada', value: 'finished' }
            ]"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :description="error"
        />

        <div class="flex justify-end gap-2 pt-4">
          <UButton
            variant="outline"
            @click="emit('close')"
          >
            Cancelar
          </UButton>
          <UButton
            type="submit"
            :loading="isLoading"
          >
            {{ isEditing ? 'Guardar Cambios' : 'Crear Elección' }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
