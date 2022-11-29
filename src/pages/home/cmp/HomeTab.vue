<template>
  <view class="wrap-box">
    <Tab @change="changeTab">
      <template #content>
        <view class="pos">
          <uni-badge
            v-if="inspectionDot"
            :text="inspectionDot"
            :is-dot="true"
            class="abs-1"
          />
          <uni-badge
            v-if="maintainDot"
            :text="maintainDot"
            :is-dot="true"
            class="abs-2"
          />
          <uni-badge
            v-if="repairDot"
            :text="repairDot"
            :is-dot="true"
            class="abs-3"
          />
        </view>
        <view v-if="tabIndex === 0">
          <TabItem :dataIndex="0" />
        </view>
        <view v-if="tabIndex === 1">
          <TabItem :dataIndex="1" />
        </view>
        <view v-if="tabIndex === 2">
          <TabItem :dataIndex="2" />
        </view>
      </template>
    </Tab>
  </view>
</template>

<script setup lang="ts">
import Tab from '@/component/Tab.vue';
import TabItem from './HomeTabItem.vue';
import { inject, reactive, ref } from 'vue';
import useHomeStore from '@/store/useHomeStore';
import { storeToRefs } from 'pinia';

const _hs = useHomeStore();
const { tabIndex, inspectionDot, repairDot, maintainDot } = storeToRefs(_hs);

const changeTab = (index: number) => {
  _hs.setData({ key: 'tabIndex', value: index });
};
</script>

<style scoped lang="scss">
.pos {
  position: relative;
  .abs-1,
  .abs-2,
  .abs-3 {
    position: absolute;
    left: 28%;
    top: -30px;
  }
  .abs-2 {
    left: 62%;
  }
  .abs-3 {
    left: 95%;
  }
}
</style>
