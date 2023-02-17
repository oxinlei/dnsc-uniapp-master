<template>
   <view style="width: 100%;">
    <web-view :src="state.allUrl"></web-view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from 'vue';
import { BASE_API } from "@/config/baseConfig";
const state = reactive({
  data: [] as any,
  allUrl: '' as string
});
onLoad((opts) => {
  console.log(opts)
  const url = decodeURIComponent(opts.url!);
  // state.allUrl = state.fileUrl+'?file=' + BASE_API + url
  getFile2(url)
});
const getFile2 = (data: any) => {
  uni.showLoading({
      title: '加载中',
      mask: true
  });
  uni.downloadFile({
    url: data,
    header:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    success: (result) => {
        var tempFilePath = result.tempFilePath
        //这里的`/hybrid/html/web/viewer.html`是pdf.js放在项目里的地址
        //h5页面这样写即可
        state.allUrl = `/hybrid/html/web/viewer.html?file=${tempFilePath}`;
        //app需要特殊处理一下才行
        // let fileUrl = plus.io.convertLocalFileSystemURL(tempFilePath)
        // state.allUrl = `/static/pdf/web/viewer.html?file=${fileUrl}`;
        uni.hideLoading();
    },
    fail: function(res) {
      uni.hideLoading();
      uni.showToast({
          title: '文件下载失败，请重试',
          icon: "none",
          mask: true,
          position: "center"
      })
    }
  })
}
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