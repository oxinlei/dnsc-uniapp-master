<template>
  <view class="container">
    <Tab @change="changeTab">
      <template #content>
        <uni-search-bar v-model="searchValue" placeholder="搜索栏" @confirm="search" clearButton="none" @cancel="cancel" />
        <view v-if="tabIndex === 0">
          <view class="mt-10">
            <RepairItem :data="state.searchData" :isExamine="true" />
          </view>
        </view>
        <view v-if="tabIndex === 1">
          <view class="mt-10">
            <RepairItem :data="state.searchData" :isExamine="true" />
            <InspectionItem :data="state.searchData" :isExamine="true" />
            <maintainItem :data="state.searchData" :isExamine="true" />
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
import maintainItem from '../maintain/cmp/maintainItem.vue';
import useHomeStore from '@/store/useHomeStore';
import { useHome } from '@/hooks/useHome';
const _ur = useRepair();
provide('titleData', ['派单审核', '验收审核']);
let tabIndex = ref(0) as Ref<number>;
const searchValue = ref("");
const pageIndex = ref(1) as Ref<number>;
const state = reactive({
  data: [] as IRepairRes[],
  searchData: [] as IRepairRes[],
  isLoading: true as boolean
});
const _uh = useHome();
const _uhs = useHomeStore();
onShow(() => {
  pageIndex.value = 1;
  state.isLoading = true;
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
  state.isLoading = true;
  uni.stopPullDownRefresh();
});
onReachBottom(async () => {
  if (state.isLoading) {
    pageIndex.value++;
    const params = returnParams(pageIndex.value);
    const res = (await _ur.getOrderPageListExamine(params)) as IRepairRes[];
    state.isLoading = res.length > 0 ? true : false
    state.data = [...state.data, ...res];
    state.searchData = state.data;
  }
});
const changeTab = (index: number) => {
  state.data = [] as IRepairRes[];
  tabIndex.value = index;
  const params = returnParams();
  _ur.getOrderPageListExamine(params).then((res) => {
    state.data = res as IRepairRes[];
    state.searchData = state.data;
  });
};
function returnParams(index = 1) {
  const idx = tabIndex.value === 0 ? 0 : 1;
  let params = {
    index,
    type: idx,
    key: searchValue.value
  } as any;
  return params as any;
}
const cancel = () => {
  searchValue.value = "";
};
function search() {
  if (searchValue.value === "") return 
  pageIndex.value = 1;
  const params = returnParams(pageIndex.value);
  _ur.getOrderPageListExamine(params).then((res) => {
    state.data = res as IRepairRes[];
    state.searchData = state.data;
  });
}
</script>

<style scoped lang="scss">
::v-deep .uni-searchbar {
  padding: 0;
  margin-top: 10px;
}
</style>
