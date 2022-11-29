<template>
  <view class="container">
    <!-- 未完成 派单状态 -->
    <Tab :titleIndex="tabIndex" @change="changeTab">
      <template #content>
        <view v-show="tabIndex === 0">
          <view class="mt-10 pb-50">
            <RepairDetailItem :data="state.data" />
            <RepairDetailEdit :data="state.data" v-if="state.data.isOption" />
          </view>
        </view>
        <view class="wrap-box mt-10" v-show="tabIndex === 1">
          <uni-steps
            :options="logCpd"
            active-color="#007AFF"
            :active="logCpd.length - 1"
            direction="column"
          />
        </view>
      </template>
    </Tab>
  </view>
</template>

<script lang="ts" setup>
import { IRepairRes } from "@/hooks/useRepair";
import Tab from "@/component/Tab.vue";
import { onLoad } from "@dcloudio/uni-app";
import { computed, provide, reactive, ref } from "vue";
import RepairDetailItem from "./cmp/RepairDetailItem.vue";
import RepairDetailEdit from "./cmp/RepairDetailEdit.vue";

import moment from "moment";
import { ORDER_STATUS_VALUE_WX } from "@/config/baseConfig";
import { useRepair } from "@/hooks/useRepair";
const { getMaintenanceLogList } = useRepair();
const state = reactive({
  data: {} as IRepairRes,
  logData: [] as any,
});
const tabIndex = ref(0);
provide("titleData", ["派单详情", "派单状态"]);
onLoad((opts) => {
  state.data = JSON.parse(opts.data!);
  uni.setNavigationBarTitle({
    title: opts.title!,
  });
  getMaintenanceLogList(state.data.id).then((res) => {
    state.logData = res;
  });
});
const changeTab = (index: number) => {
  tabIndex.value = index;
};

const logCpd = computed(() => {
  return state.logData.map((item) => {
    return {
      title: ORDER_STATUS_VALUE_WX(item.orderStatus),
      desc: `${item.realName}  ${moment(item.optionTime).format(
        "MM-DD HH:mm"
      )}`,
    };
  });
});
</script>
<style scoped lang="scss"></style>
