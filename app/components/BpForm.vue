<script setup lang="ts">
import { useBpReadings } from '~/composables/useBpReadings'

const { readings, addReading } = useBpReadings()

const systolic = ref(120)
const diastolic = ref(80)
const bpm = ref(60)
const includeBpm = ref(true)

onMounted(() => {
  const last = readings.value[0]
  if (last) {
    systolic.value = last.systolic
    diastolic.value = last.diastolic
    bpm.value = last.bpm ?? 60
  }
})

const loading = ref(false)
const toast = useToast()

async function submit() {
  loading.value = true
  await nextTick()

  addReading({
    systolic: systolic.value,
    diastolic: diastolic.value,
    bpm: includeBpm.value ? bpm.value : undefined
  })

  loading.value = false
  toast.add({ title: 'Toma registrada', color: 'success', icon: 'i-lucide-check-circle' })
}
</script>

<template>
  <div class="rounded-2xl border border-default bg-elevated p-5 space-y-5">
    <div class="flex items-center gap-2">
      <UIcon
        name="i-lucide-plus-circle"
        class="text-primary size-5"
      />
      <h2 class="font-semibold text-sm">
        Nueva toma
      </h2>
    </div>

    <!-- Dials -->
    <div class="flex items-start justify-around">
      <DialPicker
        v-model="systolic"
        :min="60"
        :max="250"
        label="Sistólica"
        unit="mmHg"
      />
      <DialPicker
        v-model="diastolic"
        :min="40"
        :max="160"
        label="Diastólica"
        unit="mmHg"
      />
      <div class="flex flex-col items-center gap-2">
        <DialPicker
          v-model="bpm"
          :min="30"
          :max="220"
          label="Pulsaciones"
          unit="ppm"
        />
        <UToggle
          v-model="includeBpm"
          size="xs"
        />
      </div>
    </div>

    <!-- Reading preview -->
    <div class="text-center">
      <span class="font-mono text-3xl font-bold tracking-tight">{{ systolic }}</span>
      <span class="text-muted font-normal text-xl">/</span>
      <span class="font-mono text-3xl font-bold tracking-tight">{{ diastolic }}</span>
      <span class="text-muted text-sm ml-1">mmHg</span>
      <span
        v-if="includeBpm"
        class="text-muted text-sm ml-3"
      >· {{ bpm }} ppm</span>
    </div>

    <UButton
      block
      :loading="loading"
      icon="i-lucide-check"
      color="primary"
      size="lg"
      @click="submit"
    >
      Registrar
    </UButton>
  </div>
</template>
