<template>
  <view class="container">
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
              v-if="dev.itemType !== 'bool'"
              v-model="dev.itemValue"
              placeholder="请填写相关参数..."
            />
            <uni-data-checkbox
              v-if="dev.itemType === 'bool'"
              v-model="dev.itemValue"
              :localdata="checkBoxOpts"
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
      v-if="selectData.orderStatus === 20 && selectData.isOption === 1"
      class="flex-footer"
    >
      <uni-row class="demo-uni-row">
        <uni-col :span="11">
          <view class="demo-uni-col dark">
            <button type="primary" @click="save">保存</button>
          </view>
        </uni-col>
        <uni-col :span="11" :offset="2">
          <view class="demo-uni-col light">
            <button type="primary" @click="clickToDispatch">维修派单</button>
          </view>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>

<script lang="ts" setup>
import useMaintainStore from "@/store/useMaintainStore";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, reactive, ref } from "vue";
import { useMaintain } from "@/hooks/useMaintain";
const state = reactive({});
const _ums = useMaintainStore();
const _um = useMaintain();
const { selectPositionData, selectDeviceData, selectData } = storeToRefs(
  _ums
) as any;
const deviceData = _ums.selectDeviceData;
const isDevFault = ref(
  deviceData.completeStatus === 0 ? 1 : deviceData.completeStatus
);
const checkBoxOpts = [
  {
    text: "是",
    value: "是",
  },
  {
    text: "否",
    value: "否",
  },
];
const checkBoxOpts1 = [
  {
    text: "正常",
    value: 1,
  },
  {
    text: "故障",
    value: 2,
  }
];

onBeforeUnmount(() => {
  _ums.setData({
    key: "selectDeviceData",
    value: {},
  });
});

// 验证表单
const validateForm = () => {
  const { feedbackData } = selectDeviceData.value;
  let isOk = false;
  feedbackData.forEach((item: any) => {
    if (item.itemValue === "") {
      isOk = true;
    }
  });
  return isOk;
};

const save = () => {
  if (validateForm()) {
    uni.showToast({
      title: "请填写完整信息",
      icon: "none",
    });
    return;
  }
  const d = {
    orderId: selectData.value.id,
    feedbackData: JSON.stringify(deviceData.feedbackData),
    deviceId: deviceData.deviceId,
    completeStatus: isDevFault.value,
  };

  _um.optionItem(d).then(() => {
    selectPositionData.value.forEach((pos: any) => {
      if (pos.deviceId === deviceData.deviceId) {
        pos.completeStatus = 1;
      }
    });
    uni.navigateBack();
  });
};
const clickToDispatch = () => {
  uni.navigateTo({
    url: "/pages/dispatch/dispatchAdd?existDev=1",
  });
};

// _ums.setData({ key: "selectDeviceData", value: old_data });
</script>
<style scoped lang="scss"></style>
