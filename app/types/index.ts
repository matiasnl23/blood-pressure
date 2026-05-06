export interface BpReading {
  id: string
  systolic: number
  diastolic: number
  bpm?: number
  timestamp: string
  note?: string
}

export type BpCategory = 'normal' | 'elevada' | 'hipertension-1' | 'hipertension-2' | 'crisis'

export interface BpCategoryInfo {
  label: string
  color: 'success' | 'warning' | 'error' | 'neutral'
  description: string
}
