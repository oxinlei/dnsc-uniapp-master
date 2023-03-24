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
import { onLoad, onShow, onNavigationBarButtonTap } from '@dcloudio/uni-app';
import { useScanCode } from '@/hooks/useScanCode';
import { useRepair } from '@/hooks/useRepair';
import useInspectionStore from '@/store/useInspectionStore';
import useScanStore from '@/store/useScanStore';
const _ur = useRepair();
const _uis = useInspectionStore();
const _uss = useScanStore();
const _uh = useHome();
onShow(() => {
  getOrderSummary();
  _uh.getOrderSummaryDot();
});
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

// 头部报警消息点击事件
onNavigationBarButtonTap((e) => {
  if (e.index === 0) {
    // uni.navigateTo({
    //   url: "/pages/home/scan",
    // });
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
  }
});
</script>

<style lang="scss" scoped></style>
