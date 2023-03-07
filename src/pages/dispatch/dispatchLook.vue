<template>
  <view class="content">
    <view class="wrap-box">
      <ListRow isBorder title="设备编号" :content="selectDeviceData.deviceNo" />
      <ListRow isBorder title="设备名称" :content="selectDeviceData.deviceName" />
      <ListRow isBorder title="功能位置" :content="selectDeviceData.areaName + '-' + selectDeviceData.positionName" />
      <ListRow isBorder title="设备规格" :content="selectDeviceData.modelSpec" />
      <ListRow isBorder title="设备分类" :content="selectDeviceData.className" />
      <ListRow isBorder title="设备型号" :content="selectDeviceData.models" />
      <ListRow isBorder title="ABC分类" :content="selectDeviceData.abcLevel === 1 ? 'A' : selectDeviceData.abcLevel === 2 ? 'B' : 'C'" />
      <ListRow isBorder title="分组名称" :content="selectDeviceData.groupName" />
      <ListRow isBorder title="运用类型" :content="selectDeviceData.typeName" />
      <ListRow isBorder title="购买日期" :content="selectDeviceData.purchaseDate" />
      <ListRow isBorder title="安装日期" :content="selectDeviceData.deviceDate" />
      <ListRow isBorder title="设备状态" :content="setStateType(selectDeviceData.deviceStatus)" />
      <ListRow isBorder title="保修截至日期" :content="selectDeviceData.warrantyDate" />
      <ListRow isBorder title="上次保养时间" :content="selectDeviceData.maintainLastData" />
      <ListRow isBorder title="下次保养时间" :content="selectDeviceData.maintainNextDate" />
      <ListRow isBorder title="状态持续时间" :content="selectDeviceData.runTimer" />
      <ListRow isBorder title="保养周期(天)" :content="selectDeviceData.maintainDays" />
      <ListRow isBorder title="使用年限(月)" :content="selectDeviceData.useYear" />
      <ListRow isBorder title="制造商" :content="selectDeviceData.manufacturer" />
      <ListRow isBorder title="保修期" :content="selectDeviceData.warranty + selectDeviceData.warrantyUnit" />
      <ViewImage :data="returnImgs(selectDeviceData.installImg)" />
      <uni-list>
        <uni-list-item title="历史巡检记录" showArrow clickable @click="onClickToDevHistory(0)"></uni-list-item>
      </uni-list>
      <uni-list>
        <uni-list-item title="历史保养记录" showArrow clickable @click="onClickToDevHistory(1)"></uni-list-item>
      </uni-list>
      <uni-list>
        <uni-list-item title="历史维修记录" showArrow clickable @click="onClickToDevHistory(2)"></uni-list-item>
      </uni-list>
      <uni-list>
        <uni-list-item title="设备文档列表" showArrow clickable @click="onClickWordList()"></uni-list-item>
      </uni-list>
    </view>
    <view v-if="state.isShowButton == 1" class="flex-footer">
      <uni-row class="demo-uni-row">
        <uni-col :span="11">
          <view class="demo-uni-col dark">
            <van-button type="primary" size="normal" @click="clickToPers('派单')">派单</van-button>
          </view>
        </uni-col>
        <uni-col :span="11">
          <view class="demo-uni-col dark">
            <van-button type="primary" size="normal" @click="clickToPers('返回')">返回</van-button>
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
import { onLoad } from "@dcloudio/uni-app";
const state = reactive({
  isShowButton: 0 as number
});
const _uis = useInspectionStore();
const { selectDeviceData } = _uis;
onLoad((opts: any) => {
  state.isShowButton = opts.isShowButton
});
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
function onClickToDevHistory(type: number) {
  if (type === 0) {
    uni.navigateTo({
      url: `/pages/devHistory/devHistory?deviceId=${selectDeviceData.deviceId}&planType=0`,
    });
  } else if (type === 1) {
    uni.navigateTo({
      url: `/pages/devHistory/devHistory?deviceId=${selectDeviceData.deviceId}&planType=1`,
    });
  } else {
    uni.navigateTo({
      url: `/pages/devHistory/devHistory?deviceId=${selectDeviceData.deviceId}&planType=2`,
    });
  }
}
function onClickWordList() {
  uni.navigateTo({
    url: `/pages/dispatch/wordList?classId=${selectDeviceData.classId}`,
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
<style scoped lang="scss">
.content{
  padding-bottom: 40px;
}
.demo-uni-row{
  display: flex;
  justify-content: space-between;
}
::v-deep .van-button{
  width: 100%;
}
</style>