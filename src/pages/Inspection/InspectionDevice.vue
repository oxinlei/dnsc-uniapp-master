<template>
  <view class="container">
    <SelectBar :data="selectPositionData" @change="search" field="deviceName" />
    <view class="wrap-box mt-10">
      <uni-list>
        <uni-list-item
          v-for="(dev, index) in state.searchData"
          :key="index"
          :title="'设备名称：' + dev.deviceName"
          showArrow
          clickable
          @click="onClickToDevDetail(dev)"
        >
          <template v-slot:footer>
            <view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
              <view class="tag">
                <uni-tag v-if="dev.completeStatus === 0" :inverted="true" text="未巡检" />
                <uni-tag
                  v-if="dev.completeStatus === 1"
                  text="已巡检"
                  type="primary"
                  :inverted="true"
                />
                <uni-tag
                  v-if="dev.completeStatus === 2"
                  text="已巡检"
                  type="error"
                  :inverted="true"
                />
                <uni-tag
                  v-if="dev.completeStatus === 3"
                  text="无法巡检"
                  type="warning"
                  :inverted="true"
                />
              </view>
              <view v-if="dev.completeStatus === 0" @click.stop="onClickCannot(dev)" style="margin-top: 14px">
                <uni-tag
                  text="无法巡检"
                  type="error"
                />
              </view>
              <view v-if="state.orderStatus === '20' && state.isOption === '1' && dev.completeStatus === 0"  @click.stop="onClickToScanningCode()" style="margin-top: 14px">
                <uni-tag
                  text="扫码巡检"
                  type="primary"
                />
              </view>
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { onMounted, provide, reactive, ref } from "vue";
import useInspectionStore from "@/store/useInspectionStore";
import { storeToRefs } from "pinia";
import { useScanCode } from '@/hooks/useScanCode';
import SelectBar from "@/component/SelectBar.vue";
import { useInspection } from '@/hooks/useInspection';

const _uis = useInspectionStore();
const _ui = useInspection();
const { selectPositionData, selectData } = storeToRefs(
  _uis
) as any;

const state = reactive({
  searchValue: "",
  orderStatus: '',
  isOption: '',
  searchData: selectPositionData as any[],
});
const orderId = ref('');
onLoad((opts) => {
  console.log(opts)
  orderId.value = opts.orderId!;
  state.orderStatus = opts.orderStatus!;
  state.isOption = opts.isOption!;
});
onMounted(() => {});
const search = (val: undefined | any[]) => {
  if (val === undefined) {
    state.searchData = selectPositionData;
  } else {
    state.searchData = val;
  }
};
const onClickToDevDetail = (dev: any) => {
  _uis.setData({ key: "selectDeviceData", value: dev });
  uni.navigateTo({
    url: `/pages/Inspection/InspectionDeviceInfo`,
  });
};
const onClickCannot = (dev: any) => {
  const d = {
    orderId: selectData.value.id,
    feedbackData: JSON.stringify(dev.feedbackData),
    deviceId: dev.deviceId,
    completeStatus: 3,
  };
  _ui.optionItem(d).then(() => {
    selectPositionData.value.forEach((pos: any) => {
      if (pos.deviceId === dev.deviceId) {
        pos.completeStatus = 3;
      }
    });
  })
}
const onClickToScanningCode = () => {
  useScanCode({
    onlyFromCamera: true,
    success: async (res) => {
      console.log(res)
      console.log(orderId.value)
      _ui
        .scanInspectionQrcode({ erData: res, orderId: orderId.value })
        .then((r) => {
          _uis.setData({ key: 'selectDeviceData', value: r });
          uni.navigateTo({
            url: '/pages/Inspection/InspectionDeviceInfo?isQrcode=1',
          });
        });
    },
    fail(e) {
      uni.showToast({
        icon: 'none',
        title: '扫码失败',
      });
    },
  });
};
</script>
<style scoped lang="scss">
.tag {
  display: flex;
  justify-content: center;
  align-items: center;
  // height: 100%;
}
::v-deep .uni-searchbar {
  padding: 0;
}
::v-deep .uni-tag--inverted{
  width: 48px;
  text-align: center;
}
</style>
