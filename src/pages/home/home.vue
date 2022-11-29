<template>
  <view class="container">
    <HomeGrid />
    <HomeTab />
  </view>
</template>

<script setup lang="ts">
import HomeGrid from './cmp/HomeGrid.vue';
import HomeTab from './cmp/HomeTab.vue';
import { onMounted, provide, reactive, ref } from 'vue';
import { useHome } from '@/hooks/useHome';
import { onLoad, onShow } from '@dcloudio/uni-app';
import useHomeStore from '@/store/useHomeStore';
const _uh = useHome();
const _uhs = useHomeStore();
onShow(() => {
  getOrderSummary();
  _uh.getOrderSummaryDot();
});

onLoad(() => {});
const state = reactive({
  inspectionData: _uh.state.inspectionData,
  repairData: _uh.state.repairData,
  maintainData: _uh.state.maintainData,
});
provide('tabInspectionData', state.inspectionData);
provide('tabRepairData', state.repairData);
provide('tabMaintainData', state.maintainData);
provide('titleData', ['巡检', '保养', '维修']);

const getOrderSummary = () => {
  _uh.getOrderSummary();
};
</script>

<style lang="scss" scoped></style>
