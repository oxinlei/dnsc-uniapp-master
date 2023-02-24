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
      <view class="w">
        <uni-datetime-picker
          type="date"
          :end="Date.now()"
          :clear-icon="false"
          v-model="state.date"
          @change="changeDate"
        />
      </view>
    </view>
    <view class="grid-box">
      <view
        class="grid-item-box"
        v-for="(item, index) in state.gridData"
        :key="index"
      >
        <view
          class="image"
          :style="1 ? `background: url('${item.url}') no-repeat;` : ''"
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

const _uh = useHome();
const state = reactive({
  type: 2, //汇总类型  0：年汇总 1：月汇总 2：日汇总
  typeOps: [
    {
      value: 2,
      text: "日报",
    },
    {
      value: 1,
      text: "月报",
    },
  ],
  date: moment(new Date()).format("YYYY-MM-DD"),
  gridData: [
    {
      title: "总数",
      value: 1,
      url: "/static/imgs/Z/statistics-bg1.png",
    },
    {
      title: "及时率",
      value: 100,
      url: "/static/imgs/Z/statistics-bg2.png",
    },
    {
      title: "完成率",
      value: 100,
      url: "/static/imgs/Z/statistics-bg3.png",
    },
    {
      title: "超时",
      value: 1,
      url: "/static/imgs/Z/statistics-bg4.png",
    },
    {
      title: "巡查",
      value: 1,
      url: "/static/imgs/Z/statistics-bg5.png",
    },
    {
      title: "维保超时",
      value: 0,
      url: "/static/imgs/Z/statistics-bg6.png",
    },
  ],
});

onLoad(() => {
  getOrder();
});
function getOrder() {
  const d = state.type === 1 ? state.date.slice(0, 7) : state.date;
  const p = {
    type: state.type,
    date: d,
  };
  _uh.getOrderTimeSummary(p).then((res) => {
    const {
      total,
      timeliness,
      completeRate,
      overtimeTotal,
      inspectionTotal,
      maintainTotal,
    } = res as IOrderSummary;
    state.gridData[0].value = total;
    state.gridData[1].value = timeliness;
    state.gridData[2].value = completeRate;
    state.gridData[3].value = overtimeTotal;
    state.gridData[4].value = inspectionTotal;
    state.gridData[5].value = maintainTotal;
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
</script>

<style lang="scss" scoped>
.w {
  width: 49%;
}

.grid-box {
  display: flex;
  flex-wrap: wrap;
}

.image {
  width: 100%;
  height: 200rpx;
  background-size: 100% 200rpx !important;
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
  width: 33.3%;
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
