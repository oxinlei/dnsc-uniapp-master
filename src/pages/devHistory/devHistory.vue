<template>
  <view class="container">
    <uni-card
      v-for="(item, index) in state.data"
      :key="index"
      :title="item.orderName"
      margin="0 0 10px 0"
      padding="0"
    >
      <ListRow
        isBorder
        :title="`${state.type}人员`"
        :content="item.completeUserName"
      />
      <ListRow isBorder title="订单编号" :content="item.orderId" />
      <ListRow
        isBorder
        title="完成时间"
        :content="moment(item.completeTime).format('MM-DD HH:mm')"
      />
      <uni-collapse accordion>
        <uni-collapse-item :title="`${state.type}内容`">
          <uni-list>
            <uni-list-item
              v-for="(order, oIndex) in item.feedbackData"
              :key="oIndex"
              thumb="/static/imgs/A/icon-2.png"
              :title="order.itemTitle"
              clickable
            />
          </uni-list>
        </uni-collapse-item>
      </uni-collapse>
    </uni-card>
  </view>
</template>

<script lang="ts" setup>
import { useDevHistory } from "@/hooks/useDevHistory";
import { IRepairRes } from "@/hooks/useRepair";
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from "vue";
import moment from "moment";
import ListRow from "@/component/ListRow.vue";

const state = reactive({
  data: [] as any[],
  type: "",
});

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
</script>
<style scoped lang="scss">
.box {
  padding: 5px 10px;
}
</style>
