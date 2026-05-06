<script setup lang="ts">
import { useBpReadings, getBpCategory, BP_CATEGORIES } from '~/composables/useBpReadings'
import type { BpReading } from '~/types'

const { readings, deleteReading } = useBpReadings()

const confirmDeleteId = ref<string | null>(null)
const showDeleteModal = computed({
  get: () => confirmDeleteId.value !== null,
  set: (v) => { if (!v) confirmDeleteId.value = null }
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function categoryInfo(r: BpReading) {
  return BP_CATEGORIES[getBpCategory(r.systolic, r.diastolic)]
}

function confirmDelete(id: string) {
  confirmDeleteId.value = id
}

function handleDelete() {
  if (confirmDeleteId.value) {
    deleteReading(confirmDeleteId.value)
    confirmDeleteId.value = null
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-list" class="size-5 text-muted" />
          <h2 class="font-semibold text-base">Historial</h2>
        </div>
        <UBadge variant="subtle" color="neutral">{{ readings.length }} toma{{ readings.length !== 1 ? 's' : '' }}</UBadge>
      </div>
    </template>

    <div v-if="readings.length === 0" class="py-10 text-center text-muted text-sm">
      <UIcon name="i-lucide-clipboard-list" class="size-10 mb-2 mx-auto text-muted/40" />
      <p>No hay tomas registradas todavía</p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="r in readings"
        :key="r.id"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-default hover:bg-elevated/50 transition-colors"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-mono font-semibold text-lg leading-none">
              {{ r.systolic }}<span class="text-muted font-normal">/</span>{{ r.diastolic }}
              <span class="text-sm text-muted font-normal ml-0.5">mmHg</span>
            </span>
            <UBadge
              :color="categoryInfo(r).color"
              variant="subtle"
              size="sm"
            >
              {{ categoryInfo(r).label }}
            </UBadge>
          </div>
          <div class="flex items-center gap-3 mt-1 text-xs text-muted">
            <span>{{ formatDate(r.timestamp) }}</span>
            <span v-if="r.bpm" class="flex items-center gap-1">
              <UIcon name="i-lucide-activity" class="size-3" />
              {{ r.bpm }} ppm
            </span>
          </div>
        </div>

        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Eliminar toma"
          @click="confirmDelete(r.id)"
        />
      </div>
    </div>
  </UCard>

  <UModal v-model:open="showDeleteModal" title="Eliminar toma">
    <template #body>
      <p class="text-sm text-muted">¿Estás seguro de que querés eliminar esta toma? Esta acción no se puede deshacer.</p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="confirmDeleteId = null">Cancelar</UButton>
        <UButton color="error" icon="i-lucide-trash-2" @click="handleDelete">Eliminar</UButton>
      </div>
    </template>
  </UModal>
</template>
