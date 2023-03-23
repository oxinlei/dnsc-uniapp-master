<template>
  <view class="content">
    <view class="wrap-box">
      <uni-list>
        <uni-list-item v-for="(item, index) in state.data" :key="index" showArrow clickable :title="item.orderName" @click="clickItem(item)" />
      </uni-list>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useHome } from '@/hooks/useHome';
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from 'vue';
const state = reactive({
  data: [] as any,
  commonId: '' as string
});
const _uh = useHome();
onLoad((opts: any) => {
  state.commonId = opts.id!;
  uni.setNavigationBarTitle({
    title: state.commonId === '3' ? '巡检超时' : '维修超时',
  });
  if (state.commonId === '3') {
    _uh.inspectionTimePageList().then((res) => {
      state.data = res
    });
  } else if (state.commonId === '4') {
    _uh.repairTimePageList().then((res) => {
      state.data = res
    });
  }
  
});
function clickItem(item: any) {
  if (state.commonId === '3') {
    uni.navigateTo({
      url: `/pages/Inspection/InspectionDetail?title=${item.orderName}&id=${item.id}`,
    });
  } else if (state.commonId === '4') {
    uni.navigateTo({
      url: `/pages/repair/RepairDetail?title=${item.orderName}&data=${JSON.stringify(item)}`,
    });
  }
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