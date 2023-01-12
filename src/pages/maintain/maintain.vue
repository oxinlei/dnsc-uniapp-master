<template>
  <view class="container">
    <Tab :titleIndex="tabIndex" @change="changeTab">
      <template #content>
        <view class="mt-10">
          <MaintainItem :data="state.data" />
        </view>
      </template>
    </Tab>
  </view>
</template>

<script setup lang="ts">
import { useMaintain, IMaintainRes } from '@/hooks/useMaintain';
import { onMounted, provide, reactive, ref } from 'vue';
import {
  onLoad,
  onPullDownRefresh,
  onReachBottom,
  onShow,
} from '@dcloudio/uni-app';
import Tab from '@/component/Tab.vue';
import useHomeStore from '@/store/useHomeStore';
import MaintainItem from './cmp/maintainItem.vue';

const _uhs = useHomeStore();
const { getOrderMaintainList, tabTitleData } = useMaintain();
const state = reactive({
  data: [] as IMaintainRes[],
  tabTitleData: tabTitleData(),
});
const tabIndex = ref(_uhs.tabListIndex);
const pageIndex = ref(1);
provide('titleData', state.tabTitleData);

onShow(() => {
  pageIndex.value = 1;
  getOrderMaintainList(tabIndex.value).then((res) => {
    state.data = res as IMaintainRes[];
  });
});
onPullDownRefresh(async () => {
  pageIndex.value = 1;
  const res = (await getOrderMaintainList(tabIndex.value)) as IMaintainRes[];
  state.data = res;
  uni.stopPullDownRefresh();
});
onReachBottom(async () => {
  pageIndex.value++;
  const res = (await getOrderMaintainList(
    tabIndex.value,
    pageIndex.value
  )) as IMaintainRes[];
  state.data = [...state.data, ...res];
});

const changeTab = (index: number) => {
  _uhs.setData({ key: 'tabListIndex', value: index });
  tabIndex.value = index;
  pageIndex.value = 1;
  getOrderMaintainList(index).then((res) => {
    state.data = res as IMaintainRes[];
  });
};
</script>

<style scoped lang="scss"></style>
