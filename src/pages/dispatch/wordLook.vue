<template>
   <view style="width: 100%;">
    <web-view :src="state.allUrl"></web-view>
    <!-- <canvas id="pdf-canvas"></canvas> -->
    <!-- <iframe width="100%" height="500" scrolling="no" :src=state.allUrl></iframe> -->
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from 'vue';
import { BASE_API } from "@/config/baseConfig";
const state = reactive({
  pdfDoc: '',
  pdfScale: 1.0,
  data: [],
  fileUrl: '/static/html/web/viewer.html',
  allUrl: ''
});
onLoad((opts) => {
  console.log(opts)
  state.allUrl = `${state.fileUrl}?file=${decodeURIComponent(BASE_API + opts.url)}`
  console.log(state.allUrl)
});
</script>
<style scoped lang="scss">
.content{
  padding-bottom: 40px;
}
.demo-uni-row{
  display: flex;
  justify-content: space-between;
}
::v-deep .van-button{
  width: 100%;
}
</style>