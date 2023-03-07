<template>
  <view class="item">
    <uni-section
      v-if="dataIndex === 0"
      v-for="(item, index) in tabInspectionData.data"
      :key="index"
      class="item"
      :title="item.label"
      @click="clickTabItem(item)"
    >
      <template v-slot:right>
        {{ item.value }}
      </template>
    </uni-section>
    <uni-section
      v-if="dataIndex === 1"
      v-for="(item, index) in tabMaintainData.data"
      :key="index"
      class="item"
      :title="item.label"
      @click="clickTabItem(item)"
    >
      <template v-slot:right>
        {{ item.value }}
      </template>
    </uni-section>
    <uni-section
      v-if="dataIndex === 2"
      v-for="(item, index) in tabRepairData.data"
      :key="index"
      class="item"
      :title="item.label"
      @click="clickTabItem(item)"
    >
      <template v-slot:right>
        {{ item.value }}
      </template>
    </uni-section>
  </view>
</template>

<script lang="ts" setup>
import useHomeStore from '@/store/useHomeStore';
import { inject } from 'vue';

const prpos = defineProps({
  dataIndex: Number,
});

const tabInspectionData = inject('tabInspectionData') as any;
const tabRepairData = inject('tabRepairData') as any;
const tabMaintainData = inject('tabMaintainData') as any;
const _uhs = useHomeStore();
const clickTabItem = (item: { index: number; label: string }) => {
  _uhs.setData({ key: 'tabListIndex', value: item.index });

  if (_uhs.tabIndex === 0) {
    uni.navigateTo({
      url: '/pages/Inspection/Inspection?title=' + item.label,
    });
  } else if (_uhs.tabIndex === 1) {
    uni.navigateTo({
      url: '/pages/maintain/maintain?title=' + item.label,
    });
  } else {
    uni.navigateTo({
      url: '/pages/repair/Repair?title=' + item.label,
    });
  }
};
</script>

<style scoped lang="scss">
.item {
  border-bottom: 1px solid $uni-border-color;
}
::v-deep .uni-section .uni-section-header{
  padding: 16px 10px;
}
</style>
