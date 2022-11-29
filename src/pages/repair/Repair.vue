<template>
  <view class="container">
    <Tab :titleIndex="tabIndex" @change="changeTab">
      <template #content>
        <view class="mt-10">
          <RepairItem :data="state.data" />
        </view>
      </template>
    </Tab>
  </view>
</template>

<script setup lang="ts">
import { useRepair, IRepairRes } from '@/hooks/useRepair';
import { onMounted, provide, reactive, ref } from 'vue';
import {
  onLoad,
  onPullDownRefresh,
  onReachBottom,
  onShow,
} from '@dcloudio/uni-app';
import Tab from '@/component/Tab.vue';
import useHomeStore from '@/store/useHomeStore';
import RepairItem from './cmp/RepairItem.vue';

const _uhs = useHomeStore();
const { getOrderPageList, tabTitleData } = useRepair();
const state = reactive({
  data: [] as IRepairRes[],
  tabTitleData: tabTitleData(),
});
const tabIndex = ref(_uhs.tabListIndex);
const pageIndex = ref(1);
provide('titleData', state.tabTitleData);

onShow(() => {
  getOrderPageList(tabIndex.value).then((res) => {
    state.data = res as IRepairRes[];
  });
});
onPullDownRefresh(async () => {
  pageIndex.value = 1;
  const res = (await getOrderPageList(tabIndex.value)) as IRepairRes[];
  state.data = res;
  uni.stopPullDownRefresh();
});
onReachBottom(async () => {
  pageIndex.value++;
  const res = (await getOrderPageList(
    tabIndex.value,
    pageIndex.value
  )) as IRepairRes[];
  state.data = [...state.data, ...res];
});

const changeTab = (index: number) => {
  _uhs.setData({ key: 'tabListIndex', value: index });
  tabIndex.value = index;
  pageIndex.value = 1;
  getOrderPageList(index).then((res) => {
    state.data = res as IRepairRes[];
  });
};
</script>

<style scoped lang="scss"></style>
