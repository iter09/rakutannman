<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  courses: Array,
  loading: Boolean,
  error: String,
  totalCount: Number,
  bookmarkGroups: { 
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle-course'])

const BASE_SYLLABUS_URL = "https://kdb.tsukuba.ac.jp/syllabi/2025/" 
const getSyllabusUrl = (courseNumber) => {
  return `${BASE_SYLLABUS_URL}${courseNumber}/jpn`
}

const openDropdownId = ref(null)

const toggleDropdown = (id) => {
  if (openDropdownId.value === id) {
    openDropdownId.value = null
  } else {
    openDropdownId.value = id
  }
}

const closeDropdown = (e) => {
  if (!e.target.closest('.dropdown-container')) {
    openDropdownId.value = null
  }
}

onMounted(() => document.addEventListener('click', closeDropdown))
onUnmounted(() => document.removeEventListener('click', closeDropdown))

// ヘルパー
const isInGroup = (course, groupId) => {
  const group = props.bookmarkGroups.find(g => g.id === groupId)
  return group && group.courses.some(c => c.id === course.id)
}
</script>

<template>
  <div class="h-full">
    
    <div v-if="loading" class="p-10 text-center text-gray-500 italic font-mono text-sm">
      Searching Database...
    </div>
    <div v-else-if="error" class="p-10 text-center text-red-600 font-bold font-mono text-sm">
      {{ error }}
    </div>
    <div v-else-if="courses.length === 0" class="p-10 text-center text-gray-400 font-bold font-mono text-sm uppercase tracking-widest">
      No Courses Found
    </div>

    <div v-else class="space-y-2 pb-20"> 
      <div 
        v-for="course in courses" 
        :key="course.id"
        class="group grid grid-cols-12 gap-2 items-center px-3 py-2 bg-entry-bg border border-gray-400 hover:border-black transition-all cursor-default relative z-0 hover:z-10"
      >
        
        <div class="col-span-4 flex flex-col justify-center gap-0.5 overflow-hidden">
          <div class="font-mono font-bold text-sm text-black leading-tight truncate">
            {{ course.course_number }}
          </div>
          
          <a 
            :href="getSyllabusUrl(course.course_number)" 
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-bold text-black leading-tight flex items-center gap-1 group/link cursor-pointer transition-colors px-1 -ml-1 rounded-sm hover:bg-black hover:text-white" 
            :title="course.title"
          >
            {{ course.title }}
            <span class="material-symbols-outlined text-[0.9em] text-black group-hover/link:text-white shrink-0 pt-0.5">
              north_east
            </span>
          </a>
        </div>

        <div class="col-span-2 flex flex-col items-end justify-center gap-0.5 border-r-2 border-gray-300 pr-3 h-full">
          <div class="text-sm font-bold text-black leading-tight whitespace-nowrap">
            {{ course.credits }}単位
          </div>
          <div class="text-sm font-bold text-black leading-tight whitespace-nowrap">
            <span v-if="course.display_standard_years">{{ course.display_standard_years }}年</span>
            <span v-else>-</span>
          </div>
        </div>
        
        <div class="col-span-2 flex flex-col items-start justify-center gap-0.5 overflow-hidden pl-1">
          <div class="text-sm font-bold text-black leading-tight truncate w-full text-left" :title="course.display_terms">
            {{ course.display_terms || '-' }}
          </div>
          <div class="text-sm font-bold text-black leading-tight truncate w-full text-left" :title="course.display_periods">
            {{ course.display_periods || '-' }}
          </div>
        </div>

        <div class="col-span-2 flex flex-wrap justify-center content-center gap-1">
          <template v-if="course.display_class_formats">
            <span 
              v-for="(fmt, index) in course.display_class_formats.split(',')" 
              :key="index"
              class="bg-white border border-gray-300 px-1 rounded-sm text-[10px] font-bold text-black truncate max-w-full text-center"
            >
              {{ fmt.trim() }}
            </span>
          </template>
          <span v-else class="text-sm font-bold text-gray-400">-</span>
        </div>
        
        <div class="col-span-2 flex justify-end relative dropdown-container">
          
          <button 
            @click.stop="toggleDropdown(course.id)"
            class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-black transition-colors bg-white hover:bg-black hover:text-white flex items-center gap-1"
          >
            Add
            <span class="material-symbols-outlined text-[10px]">arrow_drop_down</span>
          </button>

          <div 
            v-if="openDropdownId === course.id"
            class="absolute top-full right-0 mt-1 w-48 bg-white border-2 border-black shadow-hard z-50 flex flex-col p-1"
          >
            <div v-if="bookmarkGroups.length === 0" class="text-[10px] p-2 text-gray-500 text-center">
              ブックマークなし
            </div>

            <button
              v-for="group in bookmarkGroups"
              :key="group.id"
              @click.stop="emit('toggle-course', course, group.id)"
              class="text-left px-2 py-1.5 text-xs font-bold hover:bg-gray-100 flex items-center justify-between group/item"
            >
              <span class="truncate">{{ group.name }}</span>
              <span v-if="isInGroup(course, group.id)" class="material-symbols-outlined text-[14px]">check</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>