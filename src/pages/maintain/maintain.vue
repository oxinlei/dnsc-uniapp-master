<template>
  <view class="container">
    <Tab :titleIndex="tabIndex" @change="changeTab">
      <template #content>
        <view class="pos">
          <uni-badge
            v-if="state.maintainData.data[1].value"
            :text="state.maintainData.data[1].value"
            :is-dot="true"
            class="abs-1"
          />
          <uni-badge
            v-if="state.maintainData.data[2].value"
            :text="state.maintainData.data[2].value"
            :is-dot="true"
            class="abs-2"
          />
          <uni-badge
            v-if="state.maintainData.data[3].value"
            :text="state.maintainData.data[3].value"
            :is-dot="true"
            class="abs-3"
          />
        </view>
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
import { useHome } from '@/hooks/useHome';
import MaintainItem from './cmp/maintainItem.vue';

const _uhs = useHomeStore();
const _uh = useHome();
const { getOrderMaintainList, tabTitleData } = useMaintain();
const state = reactive({
  data: [] as IMaintainRes[],
  tabTitleData: tabTitleData(),
  maintainData: _uh.state.maintainData,
  isLoading: true as boolean
});
const tabIndex = ref(_uhs.tabListIndex);
const pageIndex = ref(1);
provide('titleData', state.tabTitleData);
onShow(() => {
  _uh.getOrderSummary();
  pageIndex.value = 1;
  state.isLoading = true;
  getOrderMaintainList(tabIndex.value).then((res) => {
    state.data = res as IMaintainRes[];
  });
});
onPullDownRefresh(async () => {
  pageIndex.value = 1;
  const res = (await getOrderMaintainList(tabIndex.value)) as IMaintainRes[];
  state.data = res;
  state.isLoading = true;
  uni.stopPullDownRefresh();
});
onReachBottom(async () => {
  if (state.isLoading) {
    pageIndex.value++;
    const res = (await getOrderMaintainList(
      tabIndex.value,
      pageIndex.value
    )) as IMaintainRes[];
    state.isLoading = res.length > 0 ? true : false
    state.data = [...state.data, ...res];
  }
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
