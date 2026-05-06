<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  min: number
  max: number
  label: string
  unit?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [number] }>()

const ITEM_H = 48
const VISIBLE = 5

const values = computed(() => {
  const arr: number[] = []
  for (let v = props.min; v <= props.max; v++) arr.push(v)
  return arr
})

const containerRef = ref<HTMLElement | null>(null)

function scrollToValue(val: number, smooth = false) {
  const idx = values.value.indexOf(val)
  if (containerRef.value && idx >= 0) {
    containerRef.value.scrollTo({ top: idx * ITEM_H, behavior: smooth ? 'smooth' : 'instant' })
  }
}

onMounted(() => scrollToValue(props.modelValue))

watch(() => props.modelValue, (val) => {
  if (!containerRef.value) return
  const currentIdx = Math.round(containerRef.value.scrollTop / ITEM_H)
  const targetIdx = values.value.indexOf(val)
  if (targetIdx !== currentIdx) scrollToValue(val, true)
})

function onScroll() {
  if (!containerRef.value) return
  const idx = Math.round(containerRef.value.scrollTop / ITEM_H)
  const clamped = Math.max(0, Math.min(idx, values.value.length - 1))
  const val = values.value[clamped]
  if (val !== undefined && val !== props.modelValue) emit('update:modelValue', val)
}

function selectValue(v: number) {
  emit('update:modelValue', v)
  scrollToValue(v, true)
}
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div
      class="relative rounded-2xl overflow-hidden bg-elevated/50"
      :style="`width: 84px; height: ${ITEM_H * VISIBLE}px;`"
    >
      <!-- selection band -->
      <div
        class="absolute inset-x-0 pointer-events-none z-20 border-y border-primary/30 bg-primary/8"
        :style="`top: ${ITEM_H * 2}px; height: ${ITEM_H}px;`"
      />

      <!-- scrollable drum -->
      <div
        ref="containerRef"
        class="h-full overflow-y-scroll picker-scroll"
        @scroll.passive="onScroll"
      >
        <div
          :style="`height: ${ITEM_H * 2}px`"
          aria-hidden="true"
        />

        <div
          v-for="v in values"
          :key="v"
          class="flex items-center justify-center font-mono select-none transition-colors duration-100 cursor-default"
          :style="`height: ${ITEM_H}px; scroll-snap-align: center;`"
          :class="v === modelValue
            ? 'text-primary font-bold text-2xl'
            : 'text-muted/60 text-lg'"
          @click="selectValue(v)"
        >
          {{ v }}
        </div>

        <div
          :style="`height: ${ITEM_H * 2}px`"
          aria-hidden="true"
        />
      </div>
    </div>

    <div class="text-center leading-tight">
      <p class="text-xs text-muted">
        {{ label }}
      </p>
      <p
        v-if="unit"
        class="text-[10px] text-muted/50"
      >
        {{ unit }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.picker-scroll {
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 38%,
    black 62%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 38%,
    black 62%,
    transparent 100%
  );
}

.picker-scroll::-webkit-scrollbar {
  display: none;
}
</style>
