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
                <uni-tag v-if="dev.completeStatus === 0" :inverted="true" text="未保养" />
                <uni-tag
                  v-if="dev.completeStatus === 1"
                  text="已保养"
                  type="primary"
                />
                <uni-tag
                  v-if="dev.completeStatus === 2"
                  text="已保养"
                  type="error"
                />
                <uni-tag
                  v-if="dev.completeStatus === 3"
                  text="无法保养"
                  type="warning"
                  :inverted="true"
                />
              </view>
              <view v-if="dev.completeStatus === 0" @click.stop="onClickCannot(dev)" style="margin-top: 14px">
                <uni-tag
                  text="无法保养"
                  type="error"
                />
              </view>
              <view v-if="state.orderStatus === '20' && state.isOption === '1' && dev.completeStatus === 0"  @click.stop="onClickToScanningCode()" style="margin-top: 14px">
                <uni-tag
                  text="扫码保养"
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
import useMaintainStore from "@/store/useMaintainStore";
import { storeToRefs } from "pinia";
import { useScanCode } from '@/hooks/useScanCode';
import SelectBar from "@/component/SelectBar.vue";
import { useMaintain } from '@/hooks/useMaintain';
import useScanStore from '@/store/useScanStore';
const _ums = useMaintainStore();
const { selectPositionData, selectData } = storeToRefs(
  _ums
) as any;
const _um = useMaintain();
const _uss = useScanStore();
const state = reactive({
  searchValue: "",
  orderStatus: '',
  isOption: '',
  searchData: selectPositionData as any[],
});
const orderId = ref('');
onLoad((opts) => {
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
  _ums.setData({ key: "selectDeviceData", value: dev });
  uni.navigateTo({
    url: `/pages/maintain/maintainDeviceInfo`,
  });
};
const onClickCannot = (dev: any) => {
  const d = {
    orderId: selectData.value.id,
    feedbackData: JSON.stringify(dev.feedbackData),
    deviceId: dev.deviceId,
    completeStatus: 3,
  };
  _um.optionItem(d).then(() => {
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
      _um
        .scanMaintainQrcode({ erData: res, orderId: orderId.value })
        .then((r: any) => {
          if (r.length >= 1) {
            _uss.setData({ key: 'data', value: r });
            uni.navigateTo({
              url: '/pages/Inspection/scanList',
            });
          } else {
            _ums.setData({ key: 'selectDeviceData', value: r });
            uni.navigateTo({
              url: '/pages/Inspection/InspectionDeviceInfo?isQrcode=1',
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
};
</script>
<style scoped lang="scss">
.tag {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .uni-searchbar {
  padding: 0;
}
::v-deep .uni-tag--inverted{
  width: 48px;
  text-align: center;
}
</style>
