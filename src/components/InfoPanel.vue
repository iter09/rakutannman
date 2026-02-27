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
      <h3 class="font-serif font-bold text-lg border-b-2 border-black pb-1 mb-2">Information</h3>
      
      <div class="text-xs font-medium text-gray-700 space-y-2 leading-relaxed">
        <p>
          非公式で作った、筑波大学の授業検索サイトです。必ず公式サイトで正確な情報を参照してください。<br>
          科目名をクリックするとその科目の公式シラバスを別タブで開きます。
        </p>
        <p>
          ・科目番号検索: 前方一致<br>
          ・科目名検索: 部分一致<br>
          ・同項目複数選択: OR検索
        </p>
        <p>
          パネルを開いたまま検索操作が可能です。
          右上のボタンをもう一度押すと閉じます。
        </p>
      </div>
    </div>
  </transition>
</template>