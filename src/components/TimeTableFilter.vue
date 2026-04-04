<script setup>
const props = defineProps({
  selectedPeriods: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggle', 'reset-all'])

const days = ['月', '火', '水', '木', '金', '土']
const periodsLeft = [1, 2, 3, 4, 5, 6]
const periodsRightBottom = [7, 8]

const isActive = (value) => props.selectedPeriods.includes(value)

const toggle = (value) => {
  emit('toggle', value)
}
</script>

<template>
  <div class="grid grid-cols-6 grid-rows-12 md:grid-cols-12 md:grid-rows-6 gap-px border-2 border-black bg-black p-0.5 w-[180px] h-[384px] md:w-[360px] md:h-[192px] select-none shadow-[2px_2px_0px_0px_#ccc]">
    
    <template v-for="period in periodsLeft" :key="period">
      <button
        v-for="(day, index) in days"
        :key="day + period"
        @click="toggle(day + period)"
        class="grid-pos flex items-center justify-center text-[12px] font-bold leading-none transition-colors tracking-tighter"
        :class="isActive(day + period) ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'"
        :style="{ 
          '--row': period, '--col': index + 1, 
          '--md-row': period, '--md-col': index + 1 
        }"
        :title="day + period"
      >
        {{ day }}{{ period }}
      </button>
    </template>

    <template v-for="(period, pIndex) in periodsRightBottom" :key="period">
      <button
        v-for="(day, index) in days"
        :key="day + period"
        @click="toggle(day + period)"
        class="grid-pos flex items-center justify-center text-[12px] font-bold leading-none transition-colors tracking-tighter"
        :class="isActive(day + period) ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'"
        :style="{ 
          '--row': period, '--col': index + 1, 
          '--md-row': 5 + pIndex, '--md-col': index + 7 
        }"
        :title="day + period"
      >
        {{ day }}{{ period }}
      </button>
    </template>

    <button
      @click="toggle('集中')"
      class="col-start-1 col-span-2 row-start-9 row-span-2 md:col-start-7 md:col-span-2 md:row-start-1 md:row-span-2 flex items-center justify-center text-[10px] font-bold leading-none transition-colors border border-transparent"
      :class="isActive('集中') ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'"
    >
      集中
    </button>

    <button
      @click="toggle('応談')"
      class="col-start-3 col-span-2 row-start-9 row-span-2 md:col-start-9 md:col-span-2 md:row-start-1 md:row-span-2 flex items-center justify-center text-[10px] font-bold leading-none transition-colors border border-transparent"
      :class="isActive('応談') ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'"
    >
      応談
    </button>
    
    <button
      @click="toggle('随時')"
      class="col-start-5 col-span-2 row-start-9 row-span-2 md:col-start-11 md:col-span-2 md:row-start-1 md:row-span-2 flex items-center justify-center text-[10px] font-bold leading-none transition-colors border border-transparent"
      :class="isActive('随時') ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'"
    >
      随時
    </button>

    <button
      @click="toggle('NT')"
      class="col-start-5 col-span-2 row-start-11 row-span-2 md:col-start-11 md:col-span-2 md:row-start-3 md:row-span-2 flex items-center justify-center text-[10px] font-bold leading-none transition-colors border border-transparent"
      :class="isActive('NT') ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'"
    >
      NT
    </button>

    <button
      @click="$emit('reset-all')"
      class="col-start-1 col-span-4 row-start-11 row-span-2 md:col-start-7 md:col-span-4 md:row-start-3 md:row-span-2 bg-gray-100 flex items-center justify-center text-[10px] text-red-600 font-bold border-t border-b border-gray-200 hover:bg-red-50 hover:text-red-700 transition-colors uppercase tracking-widest gap-1"
    >
      <span class="material-symbols-outlined text-[14px]">refresh</span>
      Reset
    </button>

  </div>
</template>

<style scoped>
/* スマホ/PCの配置を切り替え */
.grid-pos {
  grid-row-start: var(--row);
  grid-column-start: var(--col);
}
@media (min-width: 768px) {
  .grid-pos {
    grid-row-start: var(--md-row);
    grid-column-start: var(--md-col);
  }
}
</style>