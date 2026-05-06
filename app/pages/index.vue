<script setup lang="ts">
import { useBpReadings, getBpCategory, BP_CATEGORIES } from '~/composables/useBpReadings'

const { readings } = useBpReadings()
const activeTab = ref<'toma' | 'evolucion' | 'historial'>('toma')

const tabs = [
  { key: 'toma', label: 'Toma', icon: 'i-lucide-heart-pulse' },
  { key: 'evolucion', label: 'Evolución', icon: 'i-lucide-chart-line' },
  { key: 'historial', label: 'Historial', icon: 'i-lucide-list' }
] as const

const latest = computed(() => readings.value[0])
const latestCategory = computed(() =>
  latest.value ? BP_CATEGORIES[getBpCategory(latest.value.systolic, latest.value.diastolic)] : null
)
</script>

<template>
  <div class="flex flex-col h-dvh">
    <!-- Top bar -->
    <header class="flex items-center justify-between px-4 h-12 shrink-0 border-b border-default bg-background/80 backdrop-blur-sm">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-heart-pulse" class="text-red-500 size-4" />
        <span class="font-semibold text-sm">Tensión Arterial</span>
      </div>
      <UColorModeButton size="sm" />
    </header>

    <!-- Content area -->
    <main class="flex-1 overflow-y-auto">
      <!-- Tab: Toma -->
      <div v-show="activeTab === 'toma'" class="p-4 space-y-4">
        <!-- Última toma -->
        <div v-if="latest">
          <div class="rounded-2xl border border-default bg-elevated p-5">
            <p class="text-xs text-muted uppercase tracking-widest mb-3">Última toma</p>
            <div class="flex items-end justify-between">
              <div>
                <p class="text-5xl font-mono font-bold leading-none tracking-tight">
                  {{ latest.systolic }}<span class="text-2xl text-muted font-normal">/</span>{{ latest.diastolic }}
                </p>
                <p class="text-sm text-muted mt-1">mmHg<span v-if="latest.bpm"> · {{ latest.bpm }} ppm</span></p>
              </div>
              <div class="text-right">
                <UBadge
                  v-if="latestCategory"
                  :color="latestCategory.color"
                  variant="subtle"
                  size="md"
                  class="mb-2"
                >
                  {{ latestCategory.label }}
                </UBadge>
                <p class="text-xs text-muted">
                  {{ new Date(latest.timestamp).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <BpForm />
      </div>

      <!-- Tab: Evolución -->
      <div v-show="activeTab === 'evolucion'" class="p-4">
        <BpChart :readings="readings" />
      </div>

      <!-- Tab: Historial -->
      <div v-show="activeTab === 'historial'" class="p-4">
        <BpHistory />
      </div>
    </main>

    <!-- Bottom nav -->
    <nav
      class="shrink-0 border-t border-default bg-background/90 backdrop-blur-sm grid grid-cols-3"
      style="padding-bottom: env(safe-area-inset-bottom, 0px)"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex flex-col items-center justify-center gap-1 py-3 transition-colors"
        :class="activeTab === tab.key
          ? 'text-primary'
          : 'text-muted hover:text-default'"
        @click="activeTab = tab.key"
      >
        <UIcon :name="tab.icon" class="size-5" />
        <span class="text-[11px] font-medium">{{ tab.label }}</span>
      </button>
    </nav>
  </div>
</template>
