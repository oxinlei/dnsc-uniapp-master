<template>
  <view class="content">
    <view class="wrap-box">
      <uni-list>
        <uni-list-chat
          v-for="(item, index) in state.data"
          :key="index"
          :avatar-circle="true"
          :title="item.recipientName"
          avatar="/static/imgs/A/baojing.png"
          :note="item.msgContent"
          :time="moment(item.sendTime).format('MM-DD HH:mm')"
          @click="clickItem(item)"
        />
      </uni-list>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useHome } from '@/hooks/useHome';
import { reactive, ref } from "vue";
import moment from "moment";
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
const _uh = useHome();
const state = reactive({
  data: [] as any,
  isLoading: true as boolean
});
const pageIndex = ref(1);
onShow(() => {
  pageIndex.value = 1;
  state.isLoading = true;
  _uh.getMessageLogPageList({ index: pageIndex.value, size: 20 }).then((res: any) => {
    state.data = res.data
  });
});
onPullDownRefresh(async () => {
  pageIndex.value = 1;
  const res: any = (await _uh.getMessageLogPageList(
    { index: pageIndex.value, size: 20 }
  ))
  state.data = res.data;
  state.isLoading = true;
  uni.stopPullDownRefresh();
});
onReachBottom(async () => {
  if (state.isLoading) {
    pageIndex.value++;
    const res: any = (await _uh.getMessageLogPageList(
      { index: pageIndex.value, size: 20  }
    ))
    state.isLoading = res.data.length > 0 ? true : false
    state.data = [...state.data, ...res.data];
  }
});
const clickItem = (item: any) => {
  uni.navigateTo({
    url: `/pages/home/messageDetail?data=${item}`,
  });
};
</script>
<style scoped lang="scss"></style>
