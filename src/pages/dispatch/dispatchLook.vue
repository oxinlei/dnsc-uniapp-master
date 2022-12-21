<template>
  <view class="content">
    <view class="wrap-box">
      <ListRow isBorder title="设备编号" :content="selectDeviceData.deviceNo" />
      <ListRow isBorder title="设备名称" :content="selectDeviceData.deviceName" />
      <ListRow isBorder title="功能位置" :content="selectDeviceData.areaName + '-' + selectDeviceData.positionName" />
      <ListRow isBorder title="设备分类" :content="selectDeviceData.className" />
      <ListRow isBorder title="设备型号" :content="selectDeviceData.models" />
      <ListRow isBorder title="ABC分类" :content="selectDeviceData.abcLevel === 1 ? '一级' : selectDeviceData.abcLevel === 2 ? '二级' : '三级'" />
      <ListRow isBorder title="购买日期" :content="selectDeviceData.purchaseDate" />
      <ListRow isBorder title="保修截至日期" :content="selectDeviceData.warrantyDate" />
      <ListRow isBorder title="安装日期" :content="selectDeviceData.deviceDate" />
      <ListRow isBorder title="下次保养时间" :content="selectDeviceData.maintainNextDate" />
      <ListRow isBorder title="设备状态" :content="setStateType(selectDeviceData.deviceStatus)" />
      <ListRow isBorder title="状态持续时间" :content="selectDeviceData.statusDuration" />
      <ListRow isBorder title="保养周期(天)" :content="selectDeviceData.maintainDays" />
      <ListRow isBorder title="使用年限(天)" :content="selectDeviceData.useYear" />
      <ViewImage :data="returnImgs(selectDeviceData.installImg)" />
      <uni-list>
        <uni-list-item title="历史记录" showArrow clickable @click="onClickToDevHistory()"></uni-list-item>
      </uni-list>
    </view>
    <view class="flex-footer">
      <uni-row class="demo-uni-row">
        <uni-col :span="12">
          <view class="demo-uni-col dark">
            <button type="primary" @click="clickToPers('派单')">
              派单
            </button>
          </view>
        </uni-col>
        <uni-col :span="12">
          <view class="demo-uni-col dark">
            <button type="primary" @click="clickToPers('返回')">
              返回
            </button>
          </view>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>

<script lang="ts" setup>
import useInspectionStore from '@/store/useInspectionStore';
import ListRow from "@/component/ListRow.vue";
import ViewImage from '@/component/ViewImage.vue';
import { BASE_API } from "@/config/baseConfig";
import { reactive } from 'vue';
const state = reactive({});
const _uis = useInspectionStore();
const { selectDeviceData } = _uis;
const setStateType = (type: number) => {
  switch (type) {
    case 0:
      return '正常'
    case 1:
      return '故障/损坏'
    case 2:
      return '告警'
    case 3:
      return '待维修'
  }
}
const clickToPers = (type: string) => {
  if (type === '派单') {
    uni.navigateTo({
      url: '/pages/dispatch/dispatchAdd?existDev=1&isScan=1',
    });
  } else {
    uni.navigateBack()
  }
}
function onClickToDevHistory() {
  uni.navigateTo({
    url: `/pages/devHistory/devHistory?deviceId=${selectDeviceData.deviceId}&planType=2`,
  });
}
const returnImgs = (str: string) => {
  let arr: any = [];
  if (!str) return;
  str.split(",").forEach((item) => {
    item = item.replace(/^\./g, "");
    arr.push({ url: BASE_API + item, extname: "png", name: `${item}.png` });
  });
  return arr;
}
</script>
<style scoped lang="scss"></style>