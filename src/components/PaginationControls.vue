<script setup>
import { computed } from 'vue'

const props = defineProps({
  nextUrl: String,
  prevUrl: String,
  totalCount: Number,
  currentCount: Number,
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 20
  },
  loading: Boolean
})

const emit = defineEmits(['change-page'])

const onPrev = () => {
  if (props.prevUrl) emit('change-page', props.prevUrl)
}

const onNext = () => {
  if (props.nextUrl) emit('change-page', props.nextUrl)
}

const rangeStart = computed(() => {
  if (props.totalCount === 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const rangeEnd = computed(() => {
  if (props.totalCount === 0) return 0
  return rangeStart.value + props.currentCount - 1
})
</script>

<template>
  <div class="p-1 border-t-2 border-black bg-gray-200 flex justify-between items-center shrink-0" v-if="!loading">
    
    <button 
      @click="onPrev" 
      :disabled="!prevUrl"
      class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest border border-black px-3 py-1.5 transition-colors bg-white hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
    >
      <span class="material-symbols-outlined text-[14px]">arrow_back</span>
  
    </button>
    
    <span class="text-[14px] font-mono font-bold text-gray-600 uppercase">
      {{ rangeStart }}-{{ rangeEnd }} / {{ totalCount }}
    </span>
    
    <button 
      @click="onNext" 
      :disabled="!nextUrl"
      class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest border border-black px-3 py-1.5 transition-colors bg-white hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
    >
    
      <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
    </button>
    
  </div>
</template>