import { ref, readonly } from 'vue'

// JSONデータの列
const COL_ID = 0          // 科目番号
const COL_TITLE = 1       // 科目名
const COL_CREDITS = 2     // 単位数
// const COL_D_YEAR = 3   // 表示用: 年次
// const COL_D_TERM = 4   // 表示用: 学期
// const COL_D_PERIOD = 5 // 表示用: 曜時限
// const COL_D_FMT = 6    // 表示用: 授業形式
const COL_BIT_YEAR = 7    // 検索用: 年次 (Bit)
const COL_BIT_TERM = 8    // 検索用: 学期 (Bit)
const COL_BIT_P_LOW = 9   // 検索用: 曜時限Low (Bit)
const COL_BIT_P_HIGH = 10 // 検索用: 曜時限High (Bit)
const COL_BIT_FMT = 11    // 検索用: 授業形式 (Bit)

// 曜時限ビットフラグ境界線
const PERIOD_BOUNDARY = 30

export function useCourseSearch() {
  const allCourses = ref([])
  const filteredCourses = ref([])
  const masters = ref({
    years: [], terms: [], periods: [], formats: []
  })
  const isLoading = ref(false)
  const error = ref(null)

  // 高速化用
  let yearMap = {}
  let termMap = {}
  let periodMap = {}
  let formatMap = {}

  // --- データロード ---
  const loadData = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}FastCourses.json`)
      if (!response.ok) throw new Error('Failed to load course data')
      
      const json = await response.json()
      
      allCourses.value = json.data
      filteredCourses.value = json.data
      masters.value = json.meta.masters

      // マップ生成
      yearMap = createIndexMap(json.meta.masters.years)
      termMap = createIndexMap(json.meta.masters.terms)
      periodMap = createIndexMap(json.meta.masters.periods)
      formatMap = createIndexMap(json.meta.masters.formats)

    } catch (err) {
      console.error(err)
      error.value = 'データの読み込みに失敗しました。'
    } finally {
      isLoading.value = false
    }
  }

  // --- ヘルパー: {値: index} ---
  const createIndexMap = (array) => {
    return array.reduce((acc, val, index) => {
      acc[val] = index
      return acc
    }, {})
  }

  // --- ヘルパー: UIの選択ビットマスク ---
  const getBitMask = (selectedValues, map) => {
    let mask = 0
    if (!selectedValues || selectedValues.length === 0) return 0
    
    for (const val of selectedValues) {
      if (map[val] !== undefined) {
        mask |= (1 << map[val])
      }
    }
    return mask
  }

  // --- ヘルパー: 曜時限ビットマスク---
  const getPeriodMasks = (selectedValues) => {
    let low = 0
    let high = 0
    if (!selectedValues || selectedValues.length === 0) return [0, 0]

    for (const val of selectedValues) {
      const idx = periodMap[val]
      if (idx !== undefined) {
        if (idx < PERIOD_BOUNDARY) {
          low |= (1 << idx)
        } else {
          high |= (1 << (idx - PERIOD_BOUNDARY))
        }
      }
    }
    return [low, high]
  }

  // --- 検索実行 ---
  /**
   * @param {Object} filters
   * {
   * course_number: String, // 前方一致
   * title: String,         // 部分一致
   * standard_years: Array, // ["1", "2"]
   * terms: Array,          // ["春A", "春B"]
   * periods: Array,        // ["月1", "火2"]
   * class_formats: Array   // ["対面"]
   * }
   */
  const searchCourses = (filters) => {
    if (allCourses.value.length === 0) return

    // 検索条件変換
    const targetId = filters.course_number ? filters.course_number.toUpperCase() : ''
    const targetTitle = filters.title ? filters.title.toLowerCase() : ''

    const maskYear = getBitMask(filters.standard_years, yearMap)
    const maskTerm = getBitMask(filters.terms, termMap)
    const [maskPLow, maskPHigh] = getPeriodMasks(filters.periods)
    const maskFormat = getBitMask(filters.class_formats, formatMap)

    // ループ
    filteredCourses.value = allCourses.value.filter(row => {
      
      // 科目番号(前方一致)
      if (targetId && !row[COL_ID].startsWith(targetId)) {
        return false
      }

      // 科目名(部分一致)大文字小文字区別なし
      if (targetTitle && !row[COL_TITLE].toLowerCase().includes(targetTitle)) {
        return false
      }

      // ビット演算フィルタリング
      if (maskYear > 0 && (row[COL_BIT_YEAR] & maskYear) === 0) return false
      if (maskTerm > 0 && (row[COL_BIT_TERM] & maskTerm) === 0) return false
      if (maskFormat > 0 && (row[COL_BIT_FMT] & maskFormat) === 0) return false

      // 曜時限 (Low/High)
      if (maskPLow > 0 || maskPHigh > 0) {
        const matchLow = (row[COL_BIT_P_LOW] & maskPLow) !== 0
        const matchHigh = (row[COL_BIT_P_HIGH] & maskPHigh) !== 0
        if (!matchLow && !matchHigh) return false
      }

      return true
    })
  }

  return {
    allCourses: readonly(allCourses), 
    filteredCourses,
    masters: readonly(masters),
    isLoading: readonly(isLoading),
    error: readonly(error),

    loadData,
    searchCourses
  }
}