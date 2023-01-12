<template>
  <view class="container pb-50">
    <view class="wrap-box">
      <uni-forms
        border
        ref="baseForm"
        label-width="50%"
        class="p-10"
        label-align="center"
      >
        <uni-forms-item
          v-for="(dev, index) in selectDeviceData.feedbackData"
          :key="index"
          :label="dev.itemTitle"
          required
        >
          <view class="flex-center">
            <uni-easyinput
              v-if="dev.itemType !== 'bool' && dev.itemType !== 'dict'"
              v-model="dev.itemValue"
              placeholder="请填写相关参数..."
            />
            <uni-data-checkbox
              v-if="dev.itemType === 'bool'"
              v-model="dev.itemValue"
              :localdata="checkBoxOpts"
            />
            <uni-data-checkbox
              v-if="dev.itemType === 'dict'"
              v-model="dev.itemValue"
              :localdata="[{ text: dev.selectData[0], value: dev.selectData[0] }, { text: dev.selectData[1], value: dev.selectData[1] }]"
            />
          </view>
        </uni-forms-item>
        <uni-forms-item v-if="selectDeviceData.isFireExtinguisher === 1" label="灭火器换药时间" required>
          <view class="flex-center">
            <uni-datetime-picker
              v-model="state.chanageDressing"
              type="date"
            />
          </view>
        </uni-forms-item>
        <uni-forms-item label="设备是否故障" required>
          <view class="flex-center">
            <uni-data-checkbox
              v-model="isDevFault"
              :localdata="checkBoxOpts1"
            />
          </view>
        </uni-forms-item>
      </uni-forms>
    </view>
    <view
      v-if="
      selectData.orderStatus === 20 && selectData.isOption === 1 && isQrcode"
      class="flex-footer"
    > 
      <uni-row class="demo-uni-row">
        <uni-col :span="11">
          <view class="demo-uni-col dark">
            <!-- <button type="primary" @click="commontSave('保存')">保存</button> -->
            <van-button type="primary" size="normal" @click="commontSave('保存')">保存</van-button>
          </view>
        </uni-col>
        <uni-col :span="11" :offset="2">
          <view class="demo-uni-col light">
            <!-- <button type="primary" @click="commontSave('维修派单')">维修派单</button> -->
            <van-button type="primary" size="normal" @click="commontSave('维修派单')">维修派单</van-button>
          </view>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>

<script lang="ts" setup>
import useInspectionStore from '@/store/useInspectionStore';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, reactive, ref } from 'vue';
import { useInspection } from '@/hooks/useInspection';
import { onLoad } from '@dcloudio/uni-app';
const _uis = useInspectionStore();
const _ui = useInspection();
const { selectPositionData, selectDeviceData, selectData } = storeToRefs(
  _uis
) as any;
const deviceData = _uis.selectDeviceData;
const state = reactive({
  chanageDressing: deviceData.chanageDressing
});
const isDevFault = ref(
  deviceData.completeStatus === 0 ? 1 : deviceData.completeStatus
);
// const chanageDressing = ref(deviceData.chanageDressing)
const checkBoxOpts =  [
  {
    text: '是',
    value: '是',
  },
  {
    text: '否',
    value: '否',
  },
];
const checkBoxOpts1 = [
  {
    text: '故障',
    value: 2,
  },
  {
    text: '正常',
    value: 1,
  },
];

// 是否扫码入口
const isQrcode = ref('');
onLoad((opts) => {
  isQrcode.value = opts.isQrcode!;
});

onBeforeUnmount(() => {
  _uis.setData({
    key: 'selectDeviceData',
    value: {},
  });
});

// 验证表单
const validateForm = () => {
  const { feedbackData } = selectDeviceData.value;
  let isOk = false;
  feedbackData.forEach((item: any) => {
    if (item.itemValue === '') {
      isOk = true;
    }
  });
  return isOk;
};

const commontSave = (type: string) => {
  if (validateForm()) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none',
    });
    return;
  }
  const d = {
    orderId: selectData.value.id,
    feedbackData: JSON.stringify(deviceData.feedbackData),
    deviceId: deviceData.deviceId,
    completeStatus: isDevFault.value,
    chanageDressing: state.chanageDressing.replace(/\ +/g, "")
  };
  _ui.optionItem(d).then(() => {
    selectPositionData.value.forEach((pos: any) => {
      if (pos.deviceId === deviceData.deviceId) {
        pos.completeStatus = isDevFault.value;
        pos.feedbackData = deviceData.feedbackData
      }
    });
    if (type === '保存') {
      uni.navigateBack()
    } else {
      uni.navigateTo({
        url: '/pages/dispatch/dispatchAdd?existDev=1'
      })
    }
  })
}
// const clickToDispatch = () => {
//   uni.navigateTo({
//     url: '/pages/dispatch/dispatchAdd?existDev=1',
//   });
// };
// _uis.setData({ key: "selectDeviceData", value: old_data });
</script>
<style scoped lang="scss">
::v-deep .uni-calendar__content-mobile{
  z-index: 999;
}
::v-deep .van-button{
  width:100%;
}
</style>
