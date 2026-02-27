<script setup>
import { computed } from 'vue'

const props = defineProps({
  bookmarkGroups: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['create-group', 'delete-group', 'update-group-name', 'update-group-target', 'remove-course', 'reset-all'])

const BASE_SYLLABUS_URL = "https://kdb.tsukuba.ac.jp/syllabi/2025/" 
const getSyllabusUrl = (courseNumber) => {
  return `${BASE_SYLLABUS_URL}${courseNumber}/jpn`
}

// --- 単位数 ---
const getGroupCredits = (courses) => {
  return courses.reduce((sum, course) => sum + Number(course.credits || 0), 0)
}

const totalAllCredits = computed(() => {
  return props.bookmarkGroups.reduce((sum, group) => sum + getGroupCredits(group.courses), 0)
})

</script>

<template>
  <div class="flex flex-col h-full border-2 border-black bg-white shadow-hard overflow-hidden w-full">
    
    <div class="px-3 py-1 border-b-2 border-black flex justify-between items-center bg-gray-200 shrink-0">
      <h2 class="text-xl font-mono font-bold text-black leading-none">ブックマーク</h2>
      
      <div class="flex items-center gap-2">
        <div class="text-sm font-bold text-black border-2 border-black px-2 py-1 bg-white leading-none">
          TOTAL: {{ totalAllCredits }}
        </div>
        <button 
          @click="$emit('reset-all')"
          class="text-xs uppercase font-bold text-black border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors leading-none bg-white"
        >
          Reset
        </button>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
      
      <div v-for="group in bookmarkGroups" :key="group.id" class="flex flex-col">
        
        <div class="flex items-center justify-between border-2 border-black border-b-0 bg-white px-2 py-1 gap-2">
          
          <input 
            type="text" 
            :value="group.name"
            @input="$emit('update-group-name', group.id, $event.target.value)"
            class="text-xm font-bold text-black bg-white border border-gray-300 px-2 py-1 focus:outline-none focus:border-gray-500 flex-1 min-w-0 placeholder-gray-300"
            placeholder="GROUP NAME"
          />
          
          <div class="flex items-center gap-1 shrink-0">
            <span class="text-xm font-bold text-black min-w-[1.2em] text-right leading-none">
              {{ getGroupCredits(group.courses) }}
            </span>
            
            <span class="text-xm font-black text-gray-400 leading-none">/</span>
            
            <input 
              type="number"
              :value="group.targetCredits"
              @input="$emit('update-group-target', group.id, $event.target.value)"
              class="text-xm font-bold text-black bg-gray-100 border-none w-[2.5em] text-center focus:ring-1 focus:ring-black p-0 leading-none"
              placeholder="--"
            />
          </div>

          <button 
            @click="$emit('delete-group', group.id)"
            class="flex items-center justify-center text-black hover:bg-red-600 hover:text-white hover:border-red-600 border border-transparent transition-colors p-1 shrink-0" 
            title="Remove Group"
          >
            <span class="material-symbols-outlined text-[18px] leading-none">delete</span>
          </button>
        </div>
        
        <div class="border-2 border-black p-1 bg-white min-h-[50px]">
          <div class="space-y-1">
            
            <div v-if="group.courses.length === 0" class="text-[10px] text-gray-400 font-bold text-center py-2">
              EMPTY BOX
            </div>

            <div 
              v-for="course in group.courses" 
              :key="course.id" 
              class="flex items-center justify-between px-2 py-1 bg-entry-bg border border-gray-300 hover:border-black transition-colors gap-2"
            >
              <div class="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                <div class="font-mono font-bold text-[15px] text-black shrink-0">
                  {{ course.course_number }}
                </div>
                
                <a 
                  :href="getSyllabusUrl(course.course_number)" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[15px] font-bold truncate shrink-1 min-w-0 px-1 -ml-1 rounded-sm transition-colors hover:bg-black hover:text-white cursor-pointer block" 
                  :title="course.title"
                >
                  {{ course.title }}
                </a>
              </div>
              
              <div class="flex items-center gap-1 shrink-0 text-[12px] font-bold text-gray-600 ml-auto">
                 <span>{{ course.credits }}単位</span>
                 <span v-if="course.display_standard_years">/{{ course.display_standard_years }}年</span>
                 <span v-if="course.display_terms">/{{ course.display_terms }}</span>
                 <span v-if="course.display_periods">/{{ course.display_periods }}</span>
                 <span v-if="course.display_class_formats" class="hidden xl:inline">/{{ course.display_class_formats }}</span>
              </div>

              <button 
                @click="$emit('remove-course', course.id, group.id)"
                class="ml-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black bg-black text-white hover:bg-white hover:text-black transition-colors shrink-0"
              >
                Drop
              </button>
            </div>

          </div>
        </div>
      </div>

      <button 
        @click="$emit('create-group')"
        class="w-full py-2 border-2 border-dashed border-black hover:bg-black hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mt-4 bg-white"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        Add Custom Box
      </button>

    </div>
  </div>
</template>