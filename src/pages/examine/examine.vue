<template>
  <view class="container">
    <Tab @change="changeTab">
      <template #content>
        <SelectBar :data="state.data" @change="search" field="orderName" />
        <view v-if="tabIndex === 0">
          <view class="mt-10">
            <RepairItem :data="state.searchData" :isExamine="true" />
          </view>
        </view>
        <view v-if="tabIndex === 1">
          <view class="mt-10">
            <RepairItem :data="state.searchData" />
            <InspectionItem :data="state.searchData" />
          </view>
        </view>
      </template>
    </Tab>
  </view>
</template>

<script setup lang="ts">
import Tab from '@/component/Tab.vue';
import { provide, reactive, Ref, ref } from 'vue';
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app';
import { IRepairRes, useRepair } from '@/hooks/useRepair';
import RepairItem from '../repair/cmp/RepairItem.vue';
import InspectionItem from '../Inspection/cmp/InspectionItem.vue';
import SelectBar from '@/component/SelectBar.vue';
import useHomeStore from '@/store/useHomeStore';
import { useHome } from '@/hooks/useHome';
const _ur = useRepair();
provide('titleData', ['派单审核', '验收审核']);
let tabIndex = ref(0) as Ref<number>;

const pageIndex = ref(1) as Ref<number>;
const state = reactive({
  data: [] as IRepairRes[],
  searchData: [] as IRepairRes[],
});
const _uh = useHome();
const _uhs = useHomeStore();
onShow(() => {
  const params = returnParams();
  _ur.getOrderPageListExamine(params).then((res) => {
    state.data = res as IRepairRes[];
    state.searchData = res as IRepairRes[];
  });
  _uh.getOrderSummaryDot();
});
onPullDownRefresh(async () => {
  pageIndex.value = 1;
  const params = returnParams(pageIndex.value);
  const res = (await _ur.getOrderPageListExamine(params)) as IRepairRes[];
  state.data = res;
  state.searchData = state.data;
  uni.stopPullDownRefresh();
});
onReachBottom(async () => {
  pageIndex.value++;
  const params = returnParams(pageIndex.value);
  const res = (await _ur.getOrderPageListExamine(params)) as IRepairRes[];
  state.data = [...state.data, ...res];
  state.searchData = state.data;
});
const changeTab = (index: number) => {
  tabIndex.value = index;
  const params = returnParams();
  _ur.getOrderPageListExamine(params).then((res) => {
    state.data = res as IRepairRes[];
    state.searchData = state.data;
  });
};
function returnParams(index = 1) {
  const idx = tabIndex.value === 0 ? 0 : 200;
  let params = {
    index,
    orderStatus: idx,
  } as any;
  if (tabIndex.value === 0) {
    params.planType = 2;
  }
  return params as any;
}
function search(data) {
  if (data) {
    state.searchData = data;
  } else {
    state.searchData = state.data;
  }
}
</script>

<style scoped lang="scss">
::v-deep .uni-searchbar {
  padding: 0;
  margin-top: 10px;
}
</style>
