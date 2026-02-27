<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import _ from 'lodash'

import AppHeader from './components/AppHeader.vue'
import CourseList from './components/CourseList.vue'
import PaginationControls from './components/PaginationControls.vue'
import BookmarkSidebar from './components/BookmarkSidebar.vue'
import InfoPanel from './components/InfoPanel.vue'

import { useCourseSearch } from './composables/useCourseSearch'

const { 
  loadData, 
  filteredCourses, 
  masters,
  searchCourses, 
  isLoading, 
  error 
} = useCourseSearch()

const showInfoPanel = ref(false)

const filters = reactive({
  standard_years: [],
  terms: [],
  periods: [],
  class_formats: [],
  course_number: '',
  title: '', 
})

const currentPage = ref(1)
const pageSize = 20

const courseListContainer = ref(null)

// --- ブックマーク---
const STORAGE_KEY = 'my-course-bookmarks'

const loadBookmarks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load bookmarks from localStorage', e)
  }
  return [{ id: Date.now(), name: 'GBから', targetCredits: '', courses: [] }]
}

const bookmarkGroups = ref(loadBookmarks())

watch(bookmarkGroups, (newVal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })


// --- データ変換---
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  
  const slice = filteredCourses.value.slice(start, end)

  return slice.map(row => ({
    id: row[0],
    course_number: row[0],
    title: row[1],
    credits: row[2],
    display_standard_years: row[3],
    display_terms: row[4],
    display_periods: row[5],
    display_class_formats: row[6],
  }))
})

const headerOptions = computed(() => {
  const formatLabelMap = {
    '1': '対面',
    '2': 'オンデマンド',
    '3': '同時双方向'
  }

  return {
    years: masters.value.years || [],
    terms: masters.value.terms || [],
    periods: masters.value.periods || [],
    formats: (masters.value.formats || []).map(f => ({
      id: f,
      label: formatLabelMap[f] || f 
    }))
  }
})

// --- ページネーション---
const hasNext = computed(() => (currentPage.value * pageSize) < filteredCourses.value.length)
const hasPrev = computed(() => currentPage.value > 1)
const dummyNextUrl = computed(() => hasNext.value ? 'NEXT' : null)
const dummyPrevUrl = computed(() => hasPrev.value ? 'PREV' : null)


onMounted(() => {
  loadData()
})

// 検索実行
const debouncedSearch = _.debounce(() => {
  currentPage.value = 1
  searchCourses(filters)
  
  nextTick(() => {
    if (courseListContainer.value) {
      courseListContainer.value.scrollTop = 0
    }
  })
}, 200)

watch(filters, () => {
  debouncedSearch()
}, { deep: true })

// ページ切り替え
const handlePageChange = (directionOrUrl) => {
  if (directionOrUrl === 'NEXT') {
    if (hasNext.value) currentPage.value++
  } else if (directionOrUrl === 'PREV') {
    if (hasPrev.value) currentPage.value--
  }
  
  nextTick(() => {
    if (courseListContainer.value) {
      courseListContainer.value.scrollTop = 0
    }
  })
}

// --- ブックマーク操作 ---
const createGroup = () => {
  const newId = Date.now()
  const nextNum = bookmarkGroups.value.length + 1
  bookmarkGroups.value.push({
    id: newId,
    name: `${nextNum}`,
    targetCredits: '', 
    courses: []
  })
}

const deleteGroup = (id) => {
  const idx = bookmarkGroups.value.findIndex(g => g.id === id)
  if (idx !== -1) bookmarkGroups.value.splice(idx, 1)
}

const updateGroupName = (id, name) => {
  const g = bookmarkGroups.value.find(g => g.id === id)
  if (g) g.name = name
}

const updateGroupTarget = (id, val) => {
  const g = bookmarkGroups.value.find(g => g.id === id)
  if (g) g.targetCredits = val
}

const toggleCourseInGroup = (course, groupId) => {
  const group = bookmarkGroups.value.find(g => g.id === groupId)
  if (!group) return
  const idx = group.courses.findIndex(c => c.id === course.id)
  if (idx === -1) {
    group.courses.push(course)
  } else {
    group.courses.splice(idx, 1)
  }
}

const removeCourseFromGroup = (courseId, groupId) => {
  const group = bookmarkGroups.value.find(g => g.id === groupId)
  if (group) {
    const idx = group.courses.findIndex(c => c.id === courseId)
    if (idx !== -1) group.courses.splice(idx, 1)
  }
}

const resetAllBookmarks = () => {
  bookmarkGroups.value = [{ id: Date.now(), name: 'GAから', targetCredits: '', courses: [] }]
}

</script>

<template>
  <div class="h-screen flex flex-col bg-paper text-ink font-display overflow-hidden relative selection:bg-black selection:text-white bg-grain">
    
    <InfoPanel :isVisible="showInfoPanel" />

    <AppHeader 
      :filters="filters" 
      :options="headerOptions"
      :isInfoOpen="showInfoPanel"
      @reset="Object.keys(filters).forEach(k => filters[k] = Array.isArray(filters[k]) ? [] : '')"
      @toggle-info="showInfoPanel = !showInfoPanel" 
    />

    <main class="flex-1 flex overflow-hidden p-4 gap-4 max-w-[1550px] w-full mx-auto relative">
      
      <div class="w-full md:w-[45%] flex flex-col h-full border-2 border-black bg-white shadow-hard relative">
        <div ref="courseListContainer" class="flex-1 overflow-y-auto p-3 space-y-2 scroll-smooth bg-gray-50">
          <CourseList 
            :courses="paginatedCourses" 
            :loading="isLoading" 
            :error="error" 
            :totalCount="filteredCourses.length"
            :bookmarkGroups="bookmarkGroups"
            @toggle-course="toggleCourseInGroup"
          />
        </div>

        <PaginationControls 
          :nextUrl="dummyNextUrl"
          :prevUrl="dummyPrevUrl"
          :totalCount="filteredCourses.length"
          :currentCount="paginatedCourses.length"
          :currentPage="currentPage" 
          :pageSize="pageSize"
          :loading="isLoading"
          @change-page="handlePageChange"
        />
      </div>

      <div class="hidden md:flex w-[45%] h-full">
        <BookmarkSidebar 
          :bookmarkGroups="bookmarkGroups" 
          @create-group="createGroup"
          @delete-group="deleteGroup"
          @update-group-name="updateGroupName"
          @update-group-target="updateGroupTarget"
          @remove-course="removeCourseFromGroup"
          @reset-all="resetAllBookmarks"
        />
      </div>

    </main>
  </div>
</template>