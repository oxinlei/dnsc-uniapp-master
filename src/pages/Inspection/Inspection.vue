<template>
  <view class="container">
    <Tab :titleIndex="tabIndex" @change="changeTab">
      <template #content>
        <view class="mt-10">
          <InspectionItem :data="state.data" />
        </view>
      </template>
    </Tab>
  </view>
</template>

<script setup lang="ts">
import { useInspection, IInspectionRes } from "@/hooks/useInspection";
import { onMounted, provide, reactive, ref } from "vue";
import {
  onLoad,
  onPullDownRefresh,
  onReachBottom,
  onShow,
} from "@dcloudio/uni-app";
import Tab from "@/component/Tab.vue";
import useHomeStore from "@/store/useHomeStore";
import InspectionItem from "./cmp/InspectionItem.vue";

const _uhs = useHomeStore();
const { getOrderInspectionList, tabTitleData } = useInspection();
const state = reactive({
  data: [] as IInspectionRes[],
  tabTitleData: tabTitleData(),
  isLoading: true as boolean
});
const tabIndex = ref(_uhs.tabListIndex);
const pageIndex = ref(1);
provide("titleData", state.tabTitleData);

onShow(() => {
  getOrderInspectionList(tabIndex.value).then((res) => {
    state.data = res as IInspectionRes[];
  });
});
onPullDownRefresh(async () => {
  pageIndex.value = 1;
  const res = (await getOrderInspectionList(
    tabIndex.value
  )) as IInspectionRes[];
  state.data = res;
  uni.stopPullDownRefresh();
});
onReachBottom(async () => {
  if (state.isLoading) {
    pageIndex.value++;
    const res = (await getOrderInspectionList(
      tabIndex.value,
      pageIndex.value
    )) as IInspectionRes[];
    state.isLoading = res.length > 0 ? true : false
    state.data = [...state.data, ...res];
  }
});

const changeTab = (index: number) => {
  _uhs.setData({ key: "tabListIndex", value: index });
  tabIndex.value = index;
  pageIndex.value = 1;
  getOrderInspectionList(index).then((res) => {
    state.data = res as IInspectionRes[];
  });
};
</script>

<style scoped lang="scss"></style>
