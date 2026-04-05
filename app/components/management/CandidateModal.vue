<script lang="ts" setup>
interface Props {
  candidate?: {
    id?: number
    fullName: string
    listName: string
    imageUrl: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  save: [data: {
    fullName: string
    listName: string
    imageUrl: string
  }]
}>()

const open = defineModel<boolean>()
const isEditing = computed(() => !!props.candidate?.id)

const form = reactive({
  fullName: '',
  listName: '',
  imageUrl: ''
})

watch(open, (isOpen) => {
  if (isOpen) {
    if (props.candidate?.id) {
      form.fullName = props.candidate.fullName
      form.listName = props.candidate.listName
      form.imageUrl = props.candidate.imageUrl || ''
    } else {
      form.fullName = ''
      form.listName = ''
      form.imageUrl = ''
    }
  }
})

const isLoading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  if (!form.fullName || !form.listName) {
    error.value = 'El nombre completo y el nombre de lista son obligatorios'
    return
  }

  isLoading.value = true
  error.value = null

  emit('save', {
    fullName: form.fullName,
    listName: form.listName,
    imageUrl: form.imageUrl
  })
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditing ? 'Editar Candidato' : 'Nuevo Candidato'"
    description="Completa la información del candidato"
  >
    <template #body>
      <UForm
        :state="form"
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <UFormField
          label="Nombre Completo"
          name="fullName"
          required
          class="w-full"
        >
          <UInput
            v-model="form.fullName"
            placeholder="Juan Pérez García"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Nombre de Lista"
          name="listName"
          required
          class="w-full"
        >
          <UInput
            v-model="form.listName"
            placeholder="Lista Azul"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="URL de Imagen"
          name="imageUrl"
          class="w-full"
        >
          <UInput
            v-model="form.imageUrl"
            placeholder="https://example.com/image.jpg"
            type="url"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :description="error"
        />

        <div class="flex justify-end gap-2">
          <UButton
            variant="outline"
            @click="open = false"
          >
            Cancelar
          </UButton>
          <UButton
            type="submit"
            :loading="isLoading"
          >
            {{ isEditing ? 'Guardar Cambios' : 'Crear Candidato' }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
