<template>
  <view class="container">
    <uni-card v-for="(item, oIndex) in state.dataList" :key="oIndex" :title="state.data.orderName" margin="0 0 10px 0" padding="0">
      <ListRow isBorder title="订单编号" :content="state.data.id" />
      <ListRow isBorder title="完成时间" :content="moment(state.data.updateTime).format('MM-DD HH:mm')" />
      <ListRow isBorder title="设备名称" :content="item.deviceName" />
      <ListRow isBorder title="所在位置" :content="item.areaName + '-' + item.positionName" />
      <uni-collapse accordion>
        <uni-collapse-item :title="`${state.planType}内容`">
          <uni-list @click="feedbackData(item)">
            <uni-list-item
              v-for="(order, oIndex) in item.feedbackData"
              :key="oIndex"
              thumb="/static/imgs/A/icon-2.png"
              :title="order.itemTitle"
            />
          </uni-list>
        </uni-collapse-item>
      </uni-collapse>
    </uni-card>
  </view>
</template>

<script lang="ts" setup>
import { useDevHistory } from "@/hooks/useDevHistory";
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from "vue";
import useInspectionStore from "@/store/useInspectionStore";
import moment from "moment";
import ListRow from "@/component/ListRow.vue";

const state = reactive({
  data: [] as any,
  dataList: [] as any[],
  planType: '' as string
});
const _uis = useInspectionStore();
const _ud = useDevHistory();
onLoad((opts: any) => {
  state.dataList = []
  state.planType = opts.planType!;
  state.data = JSON.parse(opts.data!);
  state.data.orderItem.forEach((e: any) => {
    e.positionList.forEach((item: any) => {
      item.deviceList.forEach((k: any) => {
        state.dataList.push(k)
     })
   })
  })
});
const feedbackData = (item: any) => {
  _uis.setData({ key: "selectDeviceData", value: item });
  uni.navigateTo({
    url: `/pages/Inspection/InspectionDeviceInfo`,
  });
};
</script>
<style scoped lang="scss">
.box {
  padding: 5px 10px;
}
</style>
