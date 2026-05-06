import type { BpReading, BpCategory, BpCategoryInfo } from '~/types'

export function useBpReadings() {
  const readings = useLocalStorage<BpReading[]>('bp-readings', [])

  const sortedReadings = computed(() =>
    [...readings.value].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  )

  function addReading(data: Omit<BpReading, 'id' | 'timestamp'>) {
    readings.value.push({
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    })
  }

  function deleteReading(id: string) {
    readings.value = readings.value.filter((r: BpReading) => r.id !== id)
  }

  return { readings: sortedReadings, addReading, deleteReading }
}

export function getBpCategory(systolic: number, diastolic: number): BpCategory {
  if (systolic > 180 || diastolic > 120) return 'crisis'
  if (systolic >= 140 || diastolic >= 90) return 'hipertension-2'
  if (systolic >= 130 || diastolic >= 80) return 'hipertension-1'
  if (systolic >= 120 && diastolic < 80) return 'elevada'
  return 'normal'
}

export const BP_CATEGORIES: Record<BpCategory, BpCategoryInfo> = {
  'normal': { label: 'Normal', color: 'success', description: 'Sistólica < 120 y Diastólica < 80' },
  'elevada': { label: 'Elevada', color: 'warning', description: 'Sistólica 120–129 y Diastólica < 80' },
  'hipertension-1': { label: 'Hipertensión I', color: 'error', description: 'Sistólica 130–139 o Diastólica 80–89' },
  'hipertension-2': { label: 'Hipertensión II', color: 'error', description: 'Sistólica ≥ 140 o Diastólica ≥ 90' },
  'crisis': { label: 'Crisis hipertensiva', color: 'error', description: 'Sistólica > 180 o Diastólica > 120' }
}
