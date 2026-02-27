<script setup>
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
    
    <div class="flex gap-4 items-start w-full max-w-[1550px] mx-auto">
      
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
            
            <div class="flex items-center">
              <div class="h-8 px-2 bg-gray-200 border-2 border-black flex items-center justify-center text-[17px] font-bold uppercase z-10">
                年
              </div>
              <div class="h-7 flex items-center border-2 border-black border-l-0 bg-white divide-x-2 divide-black">
                <button 
                  v-for="year in options.years" 
                  :key="year" 
                  @click="toggleFilter(filters.standard_years, year)" 
                  class="px-2 h-full text-[10px] font-bold transition-colors hover:bg-gray-200" 
                  :class="isActive(filters.standard_years, year) ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black'"
                >
                  {{ year }}
                </button>
              </div>
            </div>

            <div class="flex items-center">
              <div class="h-8 px-2 bg-gray-200 border-2 border-black flex items-center justify-center text-[17px] font-bold uppercase z-10">
                期
              </div>
              <div class="h-7 flex items-center border-2 border-black border-l-0 bg-white divide-x-2 divide-black">
                <button 
                  v-for="term in options.terms" 
                  :key="term" 
                  @click="toggleFilter(filters.terms, term)" 
                  class="px-1.5 h-full text-[10px] font-bold transition-colors hover:bg-gray-200" 
                  :class="isActive(filters.terms, term) ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black'"
                >
                  {{ term }}
                </button>
              </div>
            </div>

            <div class="flex items-center">
              <div class="h-8 px-2 bg-gray-200 border-2 border-black flex items-center justify-center text-[17px] font-bold uppercase z-10">
                形
              </div>
              <div class="h-7 flex items-center border-2 border-black border-l-0 bg-white divide-x-2 divide-black">
                <button 
                  v-for="fmt in options.formats" 
                  :key="fmt.id" 
                  @click="toggleFilter(filters.class_formats, fmt.id)" 
                  class="px-1.5 h-full text-[10px] font-bold transition-colors hover:bg-gray-200" 
                  :class="isActive(filters.class_formats, fmt.id) ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black'"
                >
                  {{ fmt.label }}
                </button>
              </div>
            </div>

         </div>
      </div>

      <div class="hidden md:block shrink-0">
        <TimeTableFilter 
          :selectedPeriods="filters.periods"
          @toggle="(val) => toggleFilter(filters.periods, val)"
          @reset-all="$emit('reset')"
        />
      </div>

      <div class="shrink-0 ml-auto">
        <button 
          @click="$emit('toggle-info')"
          class="aspect-square size-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
          :class="isInfoOpen ? 'bg-black text-white' : 'bg-highlight hover:bg-black hover:text-white'"
        >
          <span class="material-symbols-outlined text-base">info</span>
        </button>
      </div>

    </div>
  </header>
</template>