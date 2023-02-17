<template>
  <view class="content">
    <view class="wrap-box">
      <uni-list>
        <uni-list-item v-for="(item, index) in state.data" :key="index" showArrow clickable :title="item.title" @click="clickItem(item)" />
      </uni-list>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useDispatch } from '@/hooks/useDispatch';
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from 'vue';
const state = reactive({
  data: [] as any,
  fileUrl: '/static/pdf/web/viewer.html' as string,
  allUrl: '' as string
});
const _ud = useDispatch();
onLoad((opts) => {
 _ud.getGoodsDocList(opts.classId!).then((res) => {
    state.data = res
  });
});
function clickItem(item: any) {
  uni.navigateTo({
    url: `/pages/dispatch/wordLook?url=${item.previewUrl}`,
  });
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