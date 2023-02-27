<template>
  <view> </view>
</template>
<script lang="ts" setup>
import { useScanCode } from '@/hooks/useScanCode';
import { onShow } from '@dcloudio/uni-app';
import { reactive } from "vue";
import { useRepair } from '@/hooks/useRepair';
import useInspectionStore from '@/store/useInspectionStore';
import useScanStore from '@/store/useScanStore';
const state = reactive({});
const _ur = useRepair();
const _uis = useInspectionStore();
const _uss = useScanStore();
onShow(() => {
  useScanCode({
    onlyFromCamera: true,
    success: async (res) => {
      _ur.scanRepairQrcode({ erData: res }).then((r: any) => {
        r.data[0].statusDuration = r.statusDuration
        if (r.data.length === 1) {
          _uis.setData({ key: 'selectDeviceData', value: r.data[0] });
          uni.navigateTo({
            url: `/pages/dispatch/dispatchLook?isShowButton=2`,
          });
        } else {
          _uss.setData({ key: 'data', value: r.data });
          uni.navigateTo({
            url: '/pages/dispatch/scanList',
          });
        }
      });
    },
    fail(e) {
      uni.showToast({
        icon: 'none',
        title: '扫码失败',
      });
    },
  });
});
</script>

<style></style>
