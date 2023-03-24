<template>
  <view class="content">
    <view class="wrap-box">
      <uni-list>
        <uni-list-item v-for="(item, index) in state.data" :key="index" showArrow clickable :title="moment(item.completeTime).format('YYYY-MM-DD HH:mm')" @click="clickItem(item)" />
      </uni-list>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useDevHistory } from "@/hooks/useDevHistory";
import { useRepair, IRepairRes } from "@/hooks/useRepair";
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from "vue";
import useInspectionStore from "@/store/useInspectionStore";
import { useInspection, IInspectionRes } from "@/hooks/useInspection";
import { useMaintain, IMaintainRes } from "@/hooks/useMaintain";
import moment from "moment";
const { getOrderHistroyPageList } = useRepair();
const { getOrderInspection } = useInspection();
const { getOrderMaintain } = useMaintain();
const state = reactive({
  data: [] as any[],
  type: "",
});
const _uis = useInspectionStore();
const _ud = useDevHistory();
onLoad((opts) => {
  if (opts.planType === "2") {
    state.type = "维修";
    _ud
      .getOrderDeviceList(parseInt(opts.planType!), parseInt(opts.deviceId!))
      .then((res) => {
        state.data = res as IRepairRes[];
      });
  } else if (opts.planType === "0") {
    state.type = "巡检";
    _ud
      .getOrderDeviceList(parseInt(opts.planType!), parseInt(opts.deviceId!))
      .then((res) => {
        state.data = res as IRepairRes[];
      });
  } else if (opts.planType === "1") {
    state.type = "保养";
    _ud
      .getOrderDeviceList(parseInt(opts.planType!), parseInt(opts.deviceId!))
      .then((res) => {
        state.data = res as IRepairRes[];
      });
  }
});
function clickItem(item: any) {
  if (state.type === '维修') {
    getOrderHistroyPageList({ orderStatus: item.orderStatus, field: 'orderCode', key: item.orderId }).then((res) => {
      let dataList = res as IRepairRes[];
      uni.navigateTo({
        url: `/pages/devHistory/devHistoryDetail?data=${JSON.stringify(
          dataList[0]
        )}`,
      });
    });
  } else if (state.type === '巡检') {
    getOrderInspection(item.orderId).then((res: any) => {
      let dataList = res.data as IInspectionRes[];
      uni.navigateTo({
        url: `/pages/devHistory/devHistoryPolling?data=${JSON.stringify(
          dataList
        )}&planType=${state.type}`,
      });
    });
  } else if (state.type === '保养') {
    getOrderMaintain(item.orderId).then((res: any) => {
      let dataList = res.data as IMaintainRes[];
      uni.navigateTo({
        url: `/pages/devHistory/devHistoryPolling?data=${JSON.stringify(
          dataList
        )}&planType=${state.type}`,
      });
    });
  }
}
</script>
<style scoped lang="scss">
.box {
  padding: 5px 10px;
}
</style>
