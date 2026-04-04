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

const BASE_SYLLABUS_URL = "https://kdb.tsukuba.ac.jp/syllabi/2026/" 
const getSyllabusUrl = (courseNumber) => {
  return `${BASE_SYLLABUS_URL}${courseNumber}/jpn`
}

const openDropdownId = ref(null)

const expandedCourseId = ref(null)

const toggleDropdown = (id) => {
  if (openDropdownId.value === id) {
    openDropdownId.value = null
  } else {
    openDropdownId.value = id
  }
}

const toggleExpand = (id) => {
  if (expandedCourseId.value === id) {
    expandedCourseId.value = null
  } else {
    expandedCourseId.value = id
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
        @click="toggleExpand(course.id)"
        class="group grid grid-cols-12 gap-0 md:gap-1 items-center px-2 md:px-3 py-1 bg-entry-bg border border-gray-400 hover:border-black transition-all cursor-pointer md:cursor-default relative z-0 hover:z-10"
      >
        
        <div class="col-span-6 md:col-span-3 flex flex-col justify-center gap-0.5 overflow-hidden">
          <div class="font-mono font-bold text-sm text-black leading-tight truncate">
            {{ course.course_number }}
          </div>
          
          <a 
            :href="getSyllabusUrl(course.course_number)" 
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
            class="text-sm font-bold text-black leading-tight flex items-center gap-1 group/link cursor-pointer transition-colors px-1 -ml-1 rounded-sm hover:bg-black hover:text-white" 
            :title="course.title"
          >
            {{ course.title }}
            <span class="material-symbols-outlined text-[0.9em] text-black group-hover/link:text-white shrink-0 pt-0.5">
              north_east
            </span>
          </a>
        </div>

        <div class="col-span-2 md:col-span-1 flex flex-col items-end justify-center gap-0.5 border-r-2 border-gray-300 pr-1 md:pr-2 h-full">
          <div class="text-[11px] md:text-sm font-bold text-black leading-tight whitespace-nowrap">
            {{ course.credits }}単位
          </div>
          <div class="text-[11px] md:text-sm font-bold text-black leading-tight whitespace-nowrap">
            <span v-if="course.display_standard_years">{{ course.display_standard_years }}年</span>
            <span v-else>-</span>
          </div>
        </div>
        
        <div class="col-span-2 md:col-span-1 flex flex-col items-start justify-center gap-0.5 overflow-hidden pl-1">
          <div class="text-[11px] md:text-sm font-bold text-black leading-tight w-full text-left" :title="course.display_terms">
            {{ course.display_terms || '-' }}
          </div>
          <div class="text-[11px] md:text-sm font-bold text-black leading-tight w-full text-left" :title="course.display_periods">
            {{ course.display_periods || '-' }}
          </div>
        </div>

        <div class="col-span-2 md:col-span-1 flex flex-wrap justify-center content-center gap-1">
          <template v-if="course.display_class_formats">
            <span 
              v-for="(fmt, index) in course.display_class_formats.split(',')" 
              :key="index"
              class="bg-white border border-gray-300 px-0 rounded-sm text-[9px] md:text-[10px] font-bold text-black max-w-full text-center"
            >
              {{ fmt.trim() }}
            </span>
          </template>
          <span v-else class="text-[11px] md:text-sm font-bold text-gray-400">-</span>
        </div>
        
        <div 
          class="overflow-hidden pl-1 md:flex md:col-span-5 md:mt-0 md:mb-0 md:border-t-0 md:pt-0 items-center"
          :class="expandedCourseId === course.id ? 'flex col-span-9 mt-2 mb-1 border-t border-gray-300 pt-1' : 'hidden'"
        >
          <div class="text-[10px] text-gray-900 font-medium w-full" :title="course.remarks || '備考データは現在ありません'">
            {{ course.remarks || "-" }}
          </div>
        </div>

        <div 
          class="justify-end relative dropdown-container md:flex md:col-span-1 md:mt-0 md:mb-0 md:border-t-0 md:pt-0 items-center"
          :class="expandedCourseId === course.id ? 'flex col-span-3 mt-2 mb-1 border-t border-gray-300 pt-1' : 'hidden'"
        >
          <button 
            @click.stop="toggleDropdown(course.id)"
            class="text-[9px] font-bold uppercase tracking-wider px-1 py-1 border border-black transition-colors bg-white hover:bg-black hover:text-white flex items-center justify-center gap-0.5 w-full max-w-[50px]"
          >
            Add
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