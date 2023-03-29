<template>
  <uni-card
    v-for="(item, index) in data"
    :key="index"
    v-show="item.planType === 2"
    :title="item.orderName"
    margin="0 0 10px 0"
    padding="0"
    @click="clickToDetail(item)"
  >
    <template #title>
      <view class="title">
        <text class="name">{{ item.orderName }}</text>
        <button
          v-if="
            (item.orderStatus === 0 && item.isOption === 1) ||
            (item.orderStatus === 10 && item.isOption === 1) ||
            (item.orderStatus === 30 && item.isOption === 1) ||
            (item.orderStatus === 50 && item.isOption === 1)
          "
          class="mini-btn"
          type="primary"
          size="mini"
          @click="clickToDetail(item)"
        >
          审核
        </button>
        <button
          v-if="
            (item.orderStatus === 20 && item.isOption === 1) ||
            (item.orderStatus === 22 && item.isOption === 1) ||
            (item.orderStatus === 23 && item.isOption === 1)
          "
          class="mini-btn"
          type="primary"
          size="mini"
          @click="clickToHandle(item)"
        >
        维修
        </button>
      </view>
    </template>
    <view class="box">
      <view class="left-msg">
        <text class="msg">修</text>
      </view>
      <view class="right-msg">
        <text>
          派单时间：{{ moment(item.createTime).format("MM-DD HH:mm") }}
        </text>
        <!-- <text v-if="!isExamine"> 派单名称：{{ item.orderName }} </text> -->
        <text v-if="(item.orderItem[0].positionList[0].deviceList.length > 0)"> 设备名称：{{ item.orderItem[0].positionList[0].deviceList[0].deviceName }} </text>
        <text>
          所在位置：{{ item.orderItem[0].areaName }} -
          {{ item.orderItem[0].positionList[0].positionName }}
        </text>
        <text> 派单人员：{{ item.planUser[0].realName }} </text>
      </view>
    </view>
  </uni-card>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted } from "vue";
import moment from "moment";
import { IRepairRes } from "@/hooks/useRepair";

const props = defineProps({
  data: {
    type: Array as () => IRepairRes[],
    default: [],
  },
  // 是否审核跳转过来的
  isExamine: {
    type: Boolean,
    default: false,
  },
});

const clickToDetail = (item: IRepairRes) => {
  uni.navigateTo({
    url: `/pages/repair/RepairDetail?title=${
      item.orderName
    }&data=${JSON.stringify(item)}`,
  });
};
const clickToHandle = (item: IRepairRes) => {
  uni.navigateTo({
    url: `/pages/repair/RepairHandle?title=${
      item.orderName
    }&data=${JSON.stringify(item)}`,
  });
};
</script>
<style scoped lang="scss">
.title {
  display: flex;
  border-bottom: 1px #ebeef5 solid;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  overflow: hidden;
  .name {
    flex: 1;
  }
}

.box {
  display: flex;
  padding: 10px;
}
.left-msg {
  margin-right: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .msg {
    color: red;
    font-size: 32px;
  }
}
.right-msg {
  display: flex;
  flex-direction: column;
}
</style>
