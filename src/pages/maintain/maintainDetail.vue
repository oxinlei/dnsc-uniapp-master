<template>
  <view class="container pb-50">
    <Tab :titleIndex="tabIndex" @change="changeTab">
      <template #content>
        <view v-show="tabIndex === 0">
          <view class="mt-10">
            <MaintainDetailItem ref="FavoriteRef" :data="state.data" />
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

<script setup lang="ts">
import { onLoad, onShow } from "@dcloudio/uni-app";
import {
  IMaintainRes,
  IMaintainLogRes,
  useMaintain,
} from "@/hooks/useMaintain";
import { onMounted, reactive, ref, provide, computed } from "vue";
import Tab from "@/component/Tab.vue";
import MaintainDetailItem from "./cmp/MaintainDetailItem.vue";
import moment from "moment";
import { ORDER_STATUS_VALUE } from "@/config/baseConfig";
import useMaintainStore from "@/store/useMaintainStore";

const _ums = useMaintainStore();
const { getOrderMaintain, getMaintenanceLogList } = useMaintain();
const state = reactive({
  data: {} as IMaintainRes,
  logData: [] as IMaintainLogRes[],
});
let _params = {} as { title: string; id: string };
const FavoriteRef = ref();
onShow(() => {
  getOrderMaintain(_params.id).then((res: any) => {
    _ums.setData({ key: "selectData", value: res.data });
    state.data = res.data as IMaintainRes;
    FavoriteRef.value.getFavoriteList(res)
  });
});
onLoad((opts) => {
  _params = opts as any;
  uni.setNavigationBarTitle({
    title: opts.title!,
  });

  getMaintenanceLogList(_params.id).then((res) => {
    state.logData = res as IMaintainLogRes[];
  });
});

const logCpd = computed(() => {
  return state.logData.map((item) => {
    return {
      title: ORDER_STATUS_VALUE(item.orderStatus),
      desc: `${item.realName}  ${moment(item.optionTime).format(
        "MM-DD HH:mm"
      )}`,
    };
  });
});

const tabIndex = ref(0);
provide("titleData", ["派单详情", "派单状态"]);

const changeTab = (index: number) => {
  tabIndex.value = index;
};
</script>

<style scoped lang="scss"></style>
