<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type TooltipItem,
  type ChartOptions
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { BpReading } from '~/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps<{
  readings: BpReading[]
}>()

const colorMode = useColorMode()

const chartData = computed(() => {
  const sorted = [...props.readings].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  const labels = sorted.map((r) => {
    const d = new Date(r.timestamp)
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  })

  return {
    labels,
    datasets: [
      {
        label: 'Sistólica',
        data: sorted.map(r => r.systolic),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: false
      },
      {
        label: 'Diastólica',
        data: sorted.map(r => r.diastolic),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: false
      }
    ]
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => {
  const isDark = colorMode.value === 'dark'
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const textColor = isDark ? '#94a3b8' : '#64748b'

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          usePointStyle: true,
          pointStyleWidth: 10
        }
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'line'>) => ` ${ctx.dataset.label}: ${ctx.parsed.y} mmHg`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: textColor, maxRotation: 45, font: { size: 11 } },
        grid: { color: gridColor }
      },
      y: {
        type: 'linear',
        ticks: { color: textColor, callback: (v: string | number) => `${v}` },
        grid: { color: gridColor },
        suggestedMin: 40,
        suggestedMax: 180
      }
    }
  }
})
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-chart-line"
          class="text-primary size-5"
        />
        <h2 class="font-semibold text-base">
          Evolución
        </h2>
      </div>
    </template>

    <div
      v-if="readings.length >= 2"
      class="h-72"
    >
      <Line
        :data="chartData"
        :options="chartOptions"
      />
    </div>
    <div
      v-else
      class="h-40 flex flex-col items-center justify-center gap-2 text-muted text-sm"
    >
      <UIcon
        name="i-lucide-chart-line"
        class="size-8 opacity-30"
      />
      <p>Registrá al menos 2 tomas para ver el gráfico</p>
    </div>
  </UCard>
</template>
