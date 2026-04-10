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

// --- 状態管理 ---
const showTimeTable = ref(false)       // スマホ用timetable表示
const isExcludeMode = ref(false)       // マイナス検索モード状態

// --- フィルター切り替えロジック ---

// 1. 年次・形式・学期用 (通常/除外の切り替え対応)
const handleToggle = (key, value) => {
  const normalArr = props.filters[key]
  const excludeArr = props.filters[`exclude_${key}`]
  
  if (!normalArr || !excludeArr) return

  if (isExcludeMode.value) {
    // 【マイナス検索モード時】
    if (excludeArr.includes(value)) {
      // 既に除外されていれば解除
      excludeArr.splice(excludeArr.indexOf(value), 1)
    } else {
      // 除外リストに追加し、もし通常リストに存在すれば消す
      excludeArr.push(value)
      if (normalArr.includes(value)) normalArr.splice(normalArr.indexOf(value), 1)
    }
  } else {
    // 【通常検索モード時】
    if (normalArr.includes(value)) {
      // 既に選択されていれば解除
      normalArr.splice(normalArr.indexOf(value), 1)
    } else {
      // 通常リストに追加し、もし除外リストに存在すれば消す
      normalArr.push(value)
      if (excludeArr.includes(value)) excludeArr.splice(excludeArr.indexOf(value), 1)
    }
  }
}

const isActive = (array, value) => array && array.includes(value)
</script>

<template>
  <header class="px-4 py-3 border-b-2 border-black bg-white z-20 shrink-0 shadow-sm relative">
    
    <div class="flex gap-4 items-start w-full max-w-[1550px] mx-auto relative">
      
      <div class="flex flex-col gap-3 min-w-0 flex-1">
        
         <div class="flex gap-2 items-stretch w-full max-w-[650px]">
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

           <button 
             @click="isExcludeMode = !isExcludeMode"
             class="hidden md:flex flex-col items-center justify-center px-1 border-2 border-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
             :class="isExcludeMode ? 'bg-red-600 text-white' : 'bg-gray-100 text-black hover:bg-gray-200'"
             title="マイナス検索モード"
           >
             <span class="text-[24px]">✕</span>
             <span class="text-[10px] font-bold">マイナス検索<br>(テキスト以外)</span>
           </button>
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
                  @click="handleToggle('standard_years', year)" 
                  class="relative h-8 px-2 text-[10px] font-bold transition-colors border-2 border-black whitespace-nowrap -ml-[2px] focus:z-10 flex items-center justify-center" 
                  :class="[
                    isActive(filters.standard_years, year) ? 'bg-black text-white hover:bg-gray-800 z-10' : 'bg-white text-black z-0 hover:z-10 hover:bg-gray-200',
                    isActive(filters.exclude_standard_years, year) ? 'bg-gray-200 z-10' : ''
                  ]"
                >
                  <span :class="isActive(filters.exclude_standard_years, year) ? 'opacity-50' : ''">{{ year }}</span>
                  <span v-if="isActive(filters.exclude_standard_years, year)" class="absolute inset-0 flex items-center justify-center text-red-600 text-[24px] pointer-events-none select-none">×</span>
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
                  @click="handleToggle('class_formats', fmt.id)" 
                  class="relative h-8 px-1.5 text-[10px] font-bold transition-colors border-2 border-black whitespace-nowrap -ml-[2px] focus:z-10 flex items-center justify-center" 
                  :class="[
                    isActive(filters.class_formats, fmt.id) ? 'bg-black text-white hover:bg-gray-800 z-10' : 'bg-white text-black z-0 hover:z-10 hover:bg-gray-200',
                    isActive(filters.exclude_class_formats, fmt.id) ? 'bg-gray-200 z-10' : ''
                  ]"
                >
                  <span :class="isActive(filters.exclude_class_formats, fmt.id) ? 'opacity-50' : ''">{{ fmt.label }}</span>
                  <span v-if="isActive(filters.exclude_class_formats, fmt.id)" class="absolute inset-0 flex items-center justify-center text-red-600 text-[24px] pointer-events-none select-none">×</span>
                </button>
              </div>
            </div>

            <div class="flex items-start max-w-full">
              <div class="h-8 px-2 bg-gray-200 border-2 border-black flex items-center justify-center text-[17px] font-bold uppercase z-10 shrink-0 relative">
                期
              </div>
              <div class="flex flex-wrap gap-y-1 pl-[2px] -ml-[2px] min-w-0">
                <button 
                  v-for="term in options.terms" 
                  :key="term" 
                  @click="handleToggle('terms', term)" 
                  class="relative h-8 px-1.5 text-[10px] font-bold transition-colors border-2 border-black whitespace-nowrap -ml-[2px] focus:z-10 flex items-center justify-center" 
                  :class="[
                    isActive(filters.terms, term) ? 'bg-black text-white hover:bg-gray-800 z-10' : 'bg-white text-black z-0 hover:z-10 hover:bg-gray-200',
                    isActive(filters.exclude_terms, term) ? 'bg-gray-200 z-10' : ''
                  ]"
                >
                  <span :class="isActive(filters.exclude_terms, term) ? 'opacity-50' : ''">{{ term }}</span>
                  <span v-if="isActive(filters.exclude_terms, term)" class="absolute inset-0 flex items-center justify-center text-red-600 text-[24px] pointer-events-none select-none">×</span>
                </button>
              </div>
            </div>

         </div>
      </div>

      <div 
        class="absolute md:static right-0 top-[130px] md:top-auto md:right-auto z-30 shrink-0 md:bg-transparent"
        :class="showTimeTable ? 'block' : 'hidden md:block'"
      >
        <TimeTableFilter 
          :selectedPeriods="filters.periods"
          :excludePeriods="filters.exclude_periods" 
          @toggle="(val) => handleToggle('periods', val)"
          @reset-all="$emit('reset')"
        />
      </div>

      <div class="shrink-0 ml-auto flex flex-col gap-2 relative z-40">
      
        <button 
          @click="$emit('toggle-info')"
          class="aspect-square size-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
          :class="isInfoOpen ? 'bg-black text-white' : 'bg-highlight hover:bg-black hover:text-white'"
        >
          <span class="material-symbols-outlined text-base">info</span>
        </button>

        <button 
          @click="isExcludeMode = !isExcludeMode"
          class="md:hidden aspect-square size-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors"
          :class="isExcludeMode ? 'bg-red-600 text-white' : 'bg-white hover:bg-gray-100'"
        >
          <span class="material-symbols-outlined text-base">×</span>
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