<script setup>
const props = defineProps({
  isVisible: Boolean
})
</script>

<template>
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 translate-x-10"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-10"
  >
    <div 
      v-if="isVisible"
      class="absolute top-16 right-4 w-80 bg-white border-2 border-black shadow-hard z-30 p-4 flex flex-col gap-2"
    >      
      <div class="text-xs font-medium text-gray-700 space-y-2 leading-relaxed">
        <p>
          非公式の、筑波大学の授業検索サイトです。<br>
          <strong>必ず<a href="https://kdb.tsukuba.ac.jp" target="_blank" rel="noopener noreferrer" class="underline">公式kdb</a>で正確な情報を参照してください。</strong><br>
          授業データは2026年3月3日に筑波大学kdbからcsvダウンロードしたものを使用しています。<br>
          科目名をクリックするとその科目の公式シラバスを別タブで開きます。
        </p>
        <p>
          ・科目番号検索: 前方一致<br>
          ・科目名検索: 部分一致<br>
          ・同項目複数選択: OR検索
        </p>

        <div class="mt-4 pt-3 border-t border-dashed border-gray-400 space-y-2">
          <ul class="text-[11px] space-y-1.5">
            <li>
              <a 
                href="https://forms.gle/vZuYVd2gw2PMTgRy6" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-1 w-fit transition-colors"
              >
                お問い合わせフォーム
              </a>
            </li>
            <li>
              <a 
                href="https://github.com/iter09/rakutannman" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-1 w-fit transition-colors"
              >
                GitHub リポジトリ
              </a>
            </li>
          </ul>
        </div>

        <p>
          Google FontsとMaterial Iconsを使用
        </p>
      </div>
    </div>
  </transition>
</template>