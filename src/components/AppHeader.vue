<script setup>
import { ref } from 'vue'
import TimeTableFilter from './TimeTableFilter.vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    required: true
  },
  isInfoOpen: Boolean
})

const emit = defineEmits(['reset', 'toggle-info'])

// スマホ時の時間割表示状態を管理する変数
const showTimeTable = ref(false)

const toggleFilter = (array, value) => {
  const index = array.indexOf(value)
  if (index === -1) {
    array.push(value)
  } else {
    array.splice(index, 1)
  }
}
const isActive = (array, value) => array.includes(value)
const countSelected = (array) => array.length
</script>

<template>
  <header class="px-4 py-3 border-b-2 border-black bg-white z-20 shrink-0 shadow-sm relative">
    
    <div class="flex gap-4 items-start w-full max-w-[1550px] mx-auto relative">
      
      <div class="flex flex-col gap-3 min-w-0">
        
         <div class="w-full max-w-[500px] flex flex-col gap-2">
            <div class="relative flex items-center bg-gray-100 border-2 border-black h-8 px-2 transition-shadow focus-within:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span class="material-symbols-outlined text-black mr-2 text-[18px]">tag</span>
              <input v-model="filters.course_number" class="w-full h-full bg-transparent border-none text-black font-medium placeholder-gray-400 focus:outline-none focus:ring-0 text-l" placeholder="科目番号 (前方一致)..." type="text" />
            </div>
            <div class="relative flex items-center bg-gray-100 border-2 border-black h-8 px-2 transition-shadow focus-within:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span class="material-symbols-outlined text-black mr-2 text-[18px]">search</span>
              <input v-model="filters.title" class="w-full h-full bg-transparent border-none text-black font-medium placeholder-gray-400 focus:outline-none focus:ring-0 text-l" placeholder="科目名 (部分一致)..." type="text" />
            </div>
         </div>

          <div class="flex flex-wrap gap-2 items-start content-start">
            
            <div class="flex items-start max-w-full">
              <div class="h-8 px-2 bg-gray-200 border-2 border-black flex items-center justify-center text-[17px] font-bold uppercase z-10 shrink-0 relative">
                年
              </div>
              <div class="flex flex-wrap gap-y-1 pl-[2px] -ml-[2px] min-w-0">
                <button 
                  v-for="year in options.years" 
                  :key="year" 
                  @click="toggleFilter(filters.standard_years, year)" 
                  class="h-7 px-2 text-[10px] font-bold transition-colors hover:bg-gray-200 border-2 border-black whitespace-nowrap -ml-[2px] focus:z-10" 
                  :class="isActive(filters.standard_years, year) ? 'bg-black text-white hover:bg-gray-800 z-10' : 'bg-white text-black z-0 hover:z-10'"
                >
                  {{ year }}
                </button>
              </div>
            </div>

            <div class="flex items-start max-w-full">
              <div class="h-8 px-2 bg-gray-200 border-2 border-black flex items-center justify-center text-[17px] font-bold uppercase z-10 shrink-0 relative">
                形
              </div>
              <div class="flex flex-wrap gap-y-1 pl-[2px] -ml-[2px] min-w-0">
                <button 
                  v-for="fmt in options.formats" 
                  :key="fmt.id" 
                  @click="toggleFilter(filters.class_formats, fmt.id)" 
                  class="h-7 px-1.5 text-[10px] font-bold transition-colors hover:bg-gray-200 border-2 border-black whitespace-nowrap -ml-[2px] focus:z-10" 
                  :class="isActive(filters.class_formats, fmt.id) ? 'bg-black text-white hover:bg-gray-800 z-10' : 'bg-white text-black z-0 hover:z-10'"
                >
                  {{ fmt.label }}
                </button>
              </div>
            </div>

            <div class="flex items-start max-w-full">
              <div class="h-8 px-2 bg-gray-200 border-2 border-black flex items-center justify-center text-[17px] font-bold uppercase z-10 shrink-0 relative">
                期
              </div>
              <div class="flex flex-wrap gap-y-0 pl-[2px] -ml-[2px] min-w-0">
                <button 
                  v-for="term in options.terms" 
                  :key="term" 
                  @click="toggleFilter(filters.terms, term)" 
                  class="h-7 px-1.5 text-[10px] font-bold transition-colors hover:bg-gray-200 border-2 border-black whitespace-nowrap -ml-[2px] focus:z-10" 
                  :class="isActive(filters.terms, term) ? 'bg-black text-white hover:bg-gray-800 z-10' : 'bg-white text-black z-0 hover:z-10'"
                >
                  {{ term }}
                </button>
              </div>
            </div>

         </div>
      </div>

      <div 
        class="absolute md:static right-0 top-[100px] md:top-auto md:right-auto z-30 shrink-0 md:bg-transparent"
        :class="showTimeTable ? 'block' : 'hidden md:block'"
      >
        <TimeTableFilter 
          :selectedPeriods="filters.periods"
          @toggle="(val) => toggleFilter(filters.periods, val)"
          @reset-all="$emit('reset')"
        />
      </div>

      <div class="shrink-0 ml-auto flex flex-col gap-2">
        <button 
          @click="$emit('toggle-info')"
          class="aspect-square size-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
          :class="isInfoOpen ? 'bg-black text-white' : 'bg-highlight hover:bg-black hover:text-white'"
        >
          <span class="material-symbols-outlined text-base">info</span>
        </button>

        <button 
          @click="showTimeTable = !showTimeTable"
          class="md:hidden aspect-square size-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
          :class="showTimeTable ? 'bg-black text-white' : 'bg-highlight hover:bg-black hover:text-white'"
        >
          <span class="material-symbols-outlined text-base">calendar_month</span>
        </button>
      </div>

    </div>
  </header>
</template>