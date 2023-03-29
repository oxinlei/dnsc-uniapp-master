<template>
  <view class="wrap-box">
    <view class="title">
      <view class="w">
        <uni-data-select
          v-model="state.type"
          :localdata="state.typeOps"
          :clear="false"
          @change="changeType"
        >
        </uni-data-select>
      </view>
      <!-- <view class="w">
        <uni-datetime-picker
          type="date"
          :end="Date.now()"
          :clear-icon="false"
          v-model="state.date"
          @change="changeDate"
        />
      </view> -->
    </view>
    <view class="grid-box">
      <view
        class="grid-item-box"
        v-for="(item, index) in state.gridData"
        :key="index"
        @click="gridClick(item.id)"
      >
        <view
          class="image"
          :style="`background: url('${item.url}') no-repeat;`"
        >
          <text class="text">{{ item.value }}</text>
          <text class="text">{{ item.title }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { IOrderSummary, useHome } from "@/hooks/useHome";
import { onLoad } from "@dcloudio/uni-app";
import moment from "moment";
import { reactive } from "vue";
import useHomeStore from '@/store/useHomeStore';
const _hs = useHomeStore();
const _uh = useHome();
const state = reactive({
  type: 2, //汇总类型  0：年汇总 1：月汇总 2：日汇总
  typeOps: [
    {
      value: 2,
      text: "日汇总",
    }
  ],
  date: moment(new Date()).format("YYYY-MM-DD"),
  gridData: [
    {
      id: 1,
      title: "总数",
      value: 1,
      url: "../../static/imgs/Z/bg1.png",
    },
    {
      id: 2,
      title: "服务分",
      value: 100,
      url: "../../static/imgs/Z/bg2.png",
    },
    {
      id: 3,
      title: "巡检超时",
      value: 1,
      url: "../../static/imgs/Z/bg3.png",
    },
    {
      id: 4,
      title: "维修超时",
      value: 0,
      url: "../../static/imgs/Z/bg4.png",
    },
  ],
});

onLoad(() => {
  getOrder();
});
function getOrder() {
  const d = state.type === 1 ? state.date.slice(0, 7) : state.type === 0 ? state.date.slice(0, 4) : state.date;
  const p = {
    type: state.type,
    date: d,
  };
  _uh.getOrderTimeSummary(p).then((res) => {
    const {
      total,
      serviceScore,
      mainOvertime,
      repairOvertime
    } = res as IOrderSummary;
    state.gridData[0].value = total;
    state.gridData[1].value = serviceScore;
    state.gridData[2].value = mainOvertime;
    state.gridData[3].value = repairOvertime;
    _hs.setData({ key: 'overTime', value: mainOvertime });
  });
}
const changeType = (r: number) => {
  state.type = r;
  getOrder();
};
const changeDate = (r: string) => {
  state.date = r;
  getOrder();
};
const gridClick = (id: number) => {
  if (id === 3 || id === 4){
    uni.navigateTo({
      url: `/pages/home/overTime?id=${id}`,
    });
  }
};
</script>

<style lang="scss" scoped>
.w {
  width: 100%;
}

.grid-box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.image {
  width: 100%;
  height: 178rpx;
  background-size: 100% 178rpx !important;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.text {
  font-size: 18px;
  color: white;
}

.grid-item-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 49.8%;
}
.grid-item-box:nth-child(1),.grid-item-box:nth-child(2){
  margin-bottom: 1.5px;
}
.grid-item-box:nth-child(3){
  border-bottom-left-radius: 10px;
}
.grid-item-box:nth-child(4){
  border-bottom-right-radius: 10px;
}
.title {
  padding: 5px;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
