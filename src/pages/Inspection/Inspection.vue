<template>
  <view class="container">
    <Tab :titleIndex="tabIndex" @change="changeTab">
      <template #content>
        <view class="pos">
          <uni-badge
            v-if="state.inspectionData.data[1].value"
            :text="state.inspectionData.data[1].value"
            :is-dot="true"
            class="abs-1"
          />
          <uni-badge
            v-if="state.inspectionData.data[2].value"
            :text="state.inspectionData.data[2].value"
            :is-dot="true"
            class="abs-2"
          />
          <uni-badge
            v-if="state.inspectionData.data[3].value"
            :text="state.inspectionData.data[3].value"
            :is-dot="true"
            class="abs-3"
          />
        </view>
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
import { useHome } from '@/hooks/useHome';
const _uhs = useHomeStore();
const _uh = useHome();
const { getOrderInspectionList, tabTitleData } = useInspection();
const state = reactive({
  inspectionData: _uh.state.inspectionData,
  data: [] as IInspectionRes[],
  tabTitleData: tabTitleData(),
  isLoading: true as boolean
});
const tabIndex = ref(_uhs.tabListIndex);
const pageIndex = ref(1);
provide("titleData", state.tabTitleData);
onShow(() => {
  _uh.getOrderSummary();
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

<style scoped lang="scss">
.pos {
  position: relative;
  .abs-1,
  .abs-2,
  .abs-3 {
    position: absolute;
    left: 36%;
    top: -44px;
  }
  .abs-2 {
    left: 56%;
  }
  .abs-3 {
    left: 76%;
  }
}
</style>
