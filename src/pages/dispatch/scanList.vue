<template>
  <view class="content">
    <view class="wrap-box">
      <uni-list>
        <uni-list-item
          v-for="(item, index) in data"
          :key="index"
          showArrow
          clickable
          :title="item.deviceName"
          @click="clickItem(item)"
        />
      </uni-list>
    </view>
  </view>
</template>

<script lang="ts" setup>
import useInspectionStore from '@/store/useInspectionStore';
import useScanStore from '@/store/useScanStore';
import { reactive } from 'vue';
const state = reactive({});
const _uss = useScanStore();
const _uis = useInspectionStore();

const { data } = _uss as any;

const clickItem = (item: any) => {
  _uis.setData({ key: 'selectDeviceData', value: item });
  uni.navigateTo({
    url: '/pages/dispatch/dispatchAdd?existDev=1&isScan=1',
  });
};
</script>
<style scoped lang="scss"></style>
