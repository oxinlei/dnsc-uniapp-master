<template>
  <view class="container">
    <Tab :titleIndex="tabIndex" @change="changeTab">
      <template #content>
        <view class="pos">
          <uni-badge
            v-if="state.repairData.data[1].value"
            :text="state.repairData.data[1].value"
            :is-dot="true"
            class="abs-1"
          />
          <uni-badge
            v-if="state.repairData.data[2].value"
            :text="state.repairData.data[2].value"
            :is-dot="true"
            class="abs-2"
          />
          <uni-badge
            v-if="state.repairData.data[3].value"
            :text="state.repairData.data[3].value"
            :is-dot="true"
            class="abs-3"
          />
        </view>
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
import { useHome } from '@/hooks/useHome';
const _uhs = useHomeStore();
const _uh = useHome();
const { getOrderPageList, tabTitleData } = useRepair();
const state = reactive({
  repairData: _uh.state.repairData,
  data: [] as IRepairRes[],
  tabTitleData: tabTitleData(),
});
const tabIndex = ref(_uhs.tabListIndex);
const pageIndex = ref(1);
provide('titleData', state.tabTitleData);

onShow(() => {
  _uh.getOrderSummary();
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

<style scoped lang="scss">
.pos {
  position: relative;
  .abs-1,
  .abs-2,
  .abs-3 {
    position: absolute;
    left: 30%;
    top: -44px;
  }
  .abs-2 {
    left: 46%;
  }
  .abs-3 {
    left: 63%;
  }
}
</style>
