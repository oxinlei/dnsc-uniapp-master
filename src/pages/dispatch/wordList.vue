<template>
  <view class="content">
    <view class="wrap-box">
      <uni-list>
        <uni-list-item v-for="(item, index) in state.data" :key="index" showArrow clickable :title="item.title" @click="clickItem(item)" />
      </uni-list>
    </view>
    <uni-popup ref="dialogSave" background-color="#fff" type="center" :mask-click="false">
      <web-view  :src="state.allUrl"></web-view>
      <button @click="closeBtn">关闭</button>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { useDispatch } from '@/hooks/useDispatch';
import { onLoad } from "@dcloudio/uni-app";
import { reactive, Ref, ref } from 'vue';
import { BASE_API } from "@/config/baseConfig";
const state = reactive({
  data: [] as any,
  fileUrl: '/static/pdf/web/viewer.html' as string,
  allUrl: '' as string
});
const _ud = useDispatch();
onLoad((opts) => {
 _ud.getGoodsDocList(opts.classId!).then((res) => {
  console.log(res)
    state.data = res
  });
});
const dialogSave: Ref = ref();
const clickItem = (item: any) => {
  console.log(item.previewUrl)
  const url = decodeURIComponent(item.previewUrl);
  state.allUrl = BASE_API + state.fileUrl+'?file=' + url
  console.log( state.allUrl)
  dialogSave.value.open();
};
const closeBtn = () => {
  dialogSave.value.close();
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