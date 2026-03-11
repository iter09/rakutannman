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
      class="absolute top-16 right-4 w-80 md:w-[600px] max-h-[calc(100vh-5rem)] overflow-y-auto bg-white border-2 border-black shadow-hard z-30 p-4"
    >
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-gray-800 leading-relaxed">
        
        <div class="space-y-3">
          <p>
            非公式の、筑波大学の授業検索サイトです。<br>
            <strong>必ず<a href="https://kdb.tsukuba.ac.jp" target="_blank" rel="noopener noreferrer" class="underline">公式kdb</a>で正確な情報を参照してください。</strong><br>
            授業データは2026年3月3日に筑波大学kdbからcsvダウンロードしたものを使用しており、データは2025年度のものです。<br>
            科目名をクリックするとその科目の公式シラバスを別タブで開きます。
          </p>
          <p>
            ・科目番号検索: 前方一致<br>
            ・科目名検索: 部分一致<br>
            ・同項目複数選択: OR検索
          </p>
          <p>
            <strong>科目番号の始まり</strong><br>
            0：大学院<br>
            1：総合科目<br>
            2：体育<br>
            3：第１外国語・第２外国語<br>
            4：芸術<br>
            5：国語<br>
            6：情報<br>
            8：学内及び学外の諸活動に係る自由科目<br>
            9：教職、博物館<br>
            A：人文・文化<br>
            B：社会・国際<br>
            C：人間<br>
            E：生命環境<br>
            F：理工<br>
            G：情報<br>
            H：医<br>
            W：体育専門<br>
            Y：芸術専門<br>
            U：学際サイエンス・デザイン専門<br>
            V：グローバル教育院<br>
          </p>

        </div>

        <div class="pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-dashed border-gray-400 md:pl-4 space-y-3">
          <p>
            <strong>公式シラバスも見るべき</strong><br>
            -○○学群/クラス対象<br>
            -○○の単位を取得している者は履修不可<br>
            -○○を履修している前提<br>
            -専門導入科目(事前登録対象)<br>
            -○○語で授業<br>

            <br>
            <strong>2026年度の事前登録スケジュール</strong><br>
            春Ａ
            4 月 4 日（土）～ 4 月 9 日（木) 12:00<br>
            春Ｂ
            4 月 4 日（土）～ 5 月 13 日（水) 23:59<br>
            春Ｃ
            4 月 4 日（土）～ 6 月 23 日（火) 23:59<br>
            秋Ａ
            4 月 4 日（土）～ 9 月 16 日（水) 23:59<br>
            秋Ｂ
            4 月 4 日（土）～ 11 月 4 日（水) 23:59<br>
            秋Ｃ
            4 月 4 日（土）～ 12 月 16 日（水) 23:59<br>
          </p>

          <p class="font-bold text-black mb-1">リンク・お問い合わせ</p>
          <ul class="text-[11px] space-y-2">
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
            <li>
               Google FontsとMaterial Iconsを使用
            </li> 
          </ul>
        </div>

      </div>
    </div>
  </transition>
</template>