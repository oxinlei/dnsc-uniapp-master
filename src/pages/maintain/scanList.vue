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
import useMaintainStore from "@/store/useMaintainStore";
import useScanStore from '@/store/useScanStore';
import { reactive } from 'vue';
const state = reactive({});
const _uss = useScanStore();
const _ums = useMaintainStore();

const { data } = _uss as any;

const clickItem = (item: any) => {
  _ums.setData({ key: 'selectDeviceData', value: item });
  uni.navigateTo({
    url: '/pages/maintain/maintainDeviceInfo?isQrcode=1',
  });
};
</script>
<style scoped lang="scss"></style>
