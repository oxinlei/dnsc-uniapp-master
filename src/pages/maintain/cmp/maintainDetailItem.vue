<template>
  <view class="wrap-box">
    <ListRow title="派单名称" :content="data.orderName" isBorder />
    <ListRow title="派单类型" :content="assignType" isBorder />
    <ListRow
      title="开始时间"
      :content="moment(data.createTime).format('YYYY-MM-DD HH:mm')"
      isBorder
    />
    <ListRow title="处理时限" :content="completeTimeLimit" isBorder />
    <uni-list>
      <uni-list-item
        title="历史保养记录"
        showArrow
        clickable
        @click="onClickToDevHistory()"
      >
      </uni-list-item>
    </uni-list>
    <uni-collapse accordion>
      <uni-collapse-item
        v-for="(item, index) in state.data"
        :key="index"
        :name="index"
        title="保养人员"
        class="bb-1"
      >
        <ListRow isBorder title="抢单人员" :content="item.realName" />
        <ListRow
          v-for="(col, cIndex) in item.colleague"
          isBorder
          :key="cIndex"
          title="同班人员"
          :content="col.realName"
        />
        <ListRow
          v-for="(dev, dIndex) in item.deviceList"
          :key="dIndex"
          isBorder
          title="保养设备"
          :content="dev.deviceName"
        />
      </uni-collapse-item>
    </uni-collapse>
  </view>
  <view class="wrap-box">
    <uni-collapse accordion>
      <uni-collapse-item
        v-for="(order, oIndex) in data.orderItem"
        :key="oIndex"
        :name="oIndex"
        :title="order.areaName"
        thumb="/static/imgs/A/icon-1.png"
      >
        <uni-list>
          <uni-list-item
            v-for="(position, pIndex) in order.positionList"
            :key="pIndex"
            thumb="/static/imgs/A/icon-2.png"
            :title="'所在位置：' + position.positionName"
            showArrow
            clickable
            @click="onClickToDevice(position.deviceList)"
          >
            <template v-slot:footer>
              <view
                v-if="data.orderStatus === 20 && data.isOption === 1"
                class="tag"
              >
                <button
                  class="mini-btn"
                  type="primary"
                  size="mini"
                  @click.stop="onClickToScanningCode"
                >
                  扫码保养
                </button>
              </view>
            </template>
          </uni-list-item>
        </uni-list>
      </uni-collapse-item>
    </uni-collapse>
  </view>

  <view
    class="flex-footer"
    v-if="data.orderStatus === 20 && data.isOption === 1"
  >
    <uni-row class="demo-uni-row">
      <uni-col :span="11">
        <view class="demo-uni-col dark">
          <button type="primary" @click="clickToPers('完成提交')">
            完成提交
          </button>
        </view>
      </uni-col>
      <uni-col :span="11" :offset="2">
        <view class="demo-uni-col dark">
          <button type="primary" @click="clickToPers('未完成提交')">
            未完成提交
          </button>
        </view>
      </uni-col>
    </uni-row>
  </view>
  <view
    class="flex-footer"
    v-if="data.orderStatus === 30 && data.isOption === 1"
  >
    <uni-row class="demo-uni-row">
      <uni-col :span="24">
        <view class="demo-uni-col dark">
          <button type="primary" @click="clickSubmit30">审核通过</button>
        </view>
      </uni-col>
    </uni-row>
  </view>
</template>

<script lang="ts" setup>
import {
  IColleagueListRes,
  IMaintainRes,
  useMaintain,
} from "@/hooks/useMaintain";
import ListRow from "@/component/ListRow.vue";
import { computed, reactive, ref } from "vue";
import moment from "moment";
import useMaintainStore from "@/store/useMaintainStore";
import { useScanCode } from "@/hooks/useScanCode";
import { onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import { IPersonnelRes, usePersonnel } from "@/hooks/usePersonnel";

const _ums = useMaintainStore();
const _um = useMaintain();
const _up = usePersonnel();
const state = reactive({
  colleagueIds: "",
  colleagueIdsData: [] as IPersonnelRes[],
  // 同班人员日志
  data: [] as IColleagueListRes[],
});
const props = defineProps<{
  data: IMaintainRes;
}>();
const orderId = ref("");
onLoad((opts) => {
  orderId.value = opts.id!;
  _up.getUserMaintenanceList({ maintenanceType: 1 }).then((res) => {
    state.colleagueIdsData = res as IPersonnelRes[];
  });
  _um.getColleagueList(opts.id!).then((res) => {
    state.data = res as IColleagueListRes[];
  });
  uni.$on("selectPersonnelTBRY", (data) => {
    state.colleagueIds = data.data.map((item) => item.userId).toString();
    if (!state.colleagueIds) {
      uni.showModal({
        title: "请选择同班人员",
        showCancel: false,
      });
      return;
    }
    clickSubmit20(data.type);
  });
});

onShow(() => {});
onUnload(() => {
  uni.$off("selectPersonnelTBRY");
});
const assignType = computed(() => {
  return props.data.assignType === 0
    ? "手工派单"
    : props.data.assignType === 1
    ? "计划派单"
    : "";
});
const completeTimeLimit = computed(() => {
  return props.data.completeTimeLimit + "小时";
});
const onClickToDevice = (pos: any) => {
  _ums.setData({ key: "selectPositionData", value: pos });
  uni.navigateTo({
    url: `/pages/maintain/maintainDevice`,
  });
};
const onClickToScanningCode = () => {
  useScanCode({
    onlyFromCamera: true,
    success: async (res) => {
      console.log("扫码成功--", res);
      _um
        .scanMaintainQrcode({ erData: res, orderId: orderId.value })
        .then((r) => {
          _ums.setData({ key: "selectDeviceData", value: r });
          uni.navigateTo({
            url: "/pages/maintain/maintainDeviceInfo",
          });
        });
    },
    fail(e) {
      uni.showToast({
        icon: "none",
        title: "扫码失败",
      });
    },
  });
};
const clickToPers = (type) => {
  uni.navigateTo({
    url: `/pages/selectPersonnel/SelectPersonnel?data=${JSON.stringify(
      state.colleagueIdsData
    )}&title=选择同班人员&type=${type}`,
  });
};
const clickSubmit20 = (type) => {
  const p = {
    orderId: orderId.value,
    colleagueIds: state.colleagueIds,
  };
  if (type === "完成提交") {
    _um.applicationAccept(p).then(() => {
      uni.navigateBack();
    });
  } else if (type === "未完成提交") {
    _um.notCompletedSave(p).then(() => {
      uni.navigateBack();
    });
  }
};
const clickSubmit30 = () => {
  _um
    .acceptanceOrder({
      orderId: orderId.value,
    })
    .then(() => {
      uni.navigateBack();
    });
};
function onClickToDevHistory() {
  uni.navigateTo({
    url: `/pages/devHistory/devHistory?deviceId=${props.data.orderItem[0].positionList[0].deviceList[0].deviceId}&planType=0`,
  });
}
</script>
<style scoped lang="scss">
.tag {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .uni-collapse-item__title-box {
  padding: 0 12px;
}
</style>
