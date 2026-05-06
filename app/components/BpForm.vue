<script setup lang="ts">
import { useBpReadings } from '~/composables/useBpReadings'

const { addReading } = useBpReadings()

const form = reactive({
  systolic: null as number | null,
  diastolic: null as number | null,
  bpm: null as number | null
})

const loading = ref(false)
const toast = useToast()

async function submit() {
  if (!form.systolic || !form.diastolic) return

  loading.value = true
  await nextTick()

  addReading({
    systolic: form.systolic,
    diastolic: form.diastolic,
    bpm: form.bpm ?? undefined
  })

  form.systolic = null
  form.diastolic = null
  form.bpm = null
  loading.value = false

  toast.add({ title: 'Toma registrada', color: 'success', icon: 'i-lucide-check-circle' })
}

const isValid = computed(() =>
  form.systolic && form.diastolic
  && form.systolic > 0 && form.systolic < 300
  && form.diastolic > 0 && form.diastolic < 200
)
</script>

<template>
  <div class="rounded-2xl border border-default bg-elevated p-5 space-y-4">
    <div class="flex items-center gap-2">
      <UIcon
        name="i-lucide-plus-circle"
        class="text-primary size-5"
      />
      <h2 class="font-semibold text-sm">
        Nueva toma
      </h2>
    </div>

    <form
      class="space-y-4"
      @submit.prevent="submit"
    >
      <div class="grid grid-cols-2 gap-3">
        <UFormField
          label="Sistólica (mmHg)"
          required
        >
          <UInput
            v-model.number="form.systolic"
            type="number"
            placeholder="120"
            min="60"
            max="300"
            inputmode="numeric"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Diastólica (mmHg)"
          required
        >
          <UInput
            v-model.number="form.diastolic"
            type="number"
            placeholder="80"
            min="40"
            max="200"
            inputmode="numeric"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFormField
        label="Pulsaciones (ppm)"
        hint="Opcional"
      >
        <UInput
          v-model.number="form.bpm"
          type="number"
          placeholder="70"
          min="30"
          max="250"
          inputmode="numeric"
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        block
        :loading="loading"
        :disabled="!isValid"
        icon="i-lucide-check"
        color="primary"
        size="lg"
      >
        Registrar
      </UButton>
    </form>
  </div>
</template>
