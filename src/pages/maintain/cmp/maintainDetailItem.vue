<template>
  <view class="wrap-box">
    <ListRow title="派单编号" :content="data.id" isBorder />
    <ListRow title="派单名称" :content="data.orderName" isBorder />
    <ListRow title="派单类型" :content="assignType" isBorder />
    <ListRow
      title="派单时间"
      :content="moment(data.createTime).format('YYYY-MM-DD HH:mm')"
      isBorder
    />
    <ListRow title="处理时限" :content="completeTimeLimit" isBorder />
    <ViewImage :data="returnImgs(data.orderImg)" />
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
    <uni-segmented-control
      :current="state.titleIndex"
      :values="state.titleData"
      @clickItem="onClickItem"
     />
  </view>
  <view class="wrap-box">
    <uni-collapse accordion>
      <view v-if="data.orderStatus === 20 && data.isOption === 1" class="tag">
        <button class="mini-btn" type="primary" size="mini" @click.stop="onClickToScanningCode">扫码保养</button>
      </view>
      <uni-collapse-item
        v-for="(order, oIndex) in state.commonData"
        :key="oIndex"
        :name="oIndex"
        :title="order.areaName"
        :open="true"
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
          />
        </uni-list>
      </uni-collapse-item>
    </uni-collapse>
  </view>

  <view
    class="flex-footer"
    v-if="data.orderStatus === 20 && data.isOption === 1"
  >
    <uni-row class="demo-uni-row">
      <uni-col v-if="state.isEnd === true" :span="24">
        <view class="demo-uni-col dark">
          <van-button type="primary" size="normal" @click="clickToPers('完成提交')">完成提交</van-button>
        </view>
      </uni-col>
      <uni-col v-if="state.isEnd === false" :span="24">
        <view class="demo-uni-col dark">
          <van-button type="primary" size="normal" @click="clickToPers('未完成提交')">未完成提交</van-button>
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
  <uni-popup ref="dialogSave" type="dialog">
    <uni-popup-dialog
      type="error"
      cancelText="取消"
      confirmText="确定"
      title="提示"
      content="本次保养未完成,您确定提交另一人执行？"
      @confirm="clickCancel"
      @close="hideDialog"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script lang="ts" setup>
import {
  IColleagueListRes,
  IMaintainRes,
  useMaintain,
} from "@/hooks/useMaintain";
import ListRow from "@/component/ListRow.vue";
import { computed, reactive, Ref, ref  } from "vue";
import moment from "moment";
import ViewImage from '@/component/ViewImage.vue';
import { BASE_API } from "@/config/baseConfig";
import useMaintainStore from "@/store/useMaintainStore";
import { useScanCode } from "@/hooks/useScanCode";
import { onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import { IPersonnelRes, usePersonnel } from "@/hooks/usePersonnel";
import { useDebounceFn } from '@vueuse/core';
import useScanStore from '@/store/useScanStore';
const _ums = useMaintainStore();
const _um = useMaintain();
const _up = usePersonnel();
const _uss = useScanStore();
const state = reactive({
  titleIndex: 0 as Number,
  titleData: [] as any,
  commonData: [] as any,
  finishedItem: [] as any,
  notFinishedItem: [] as any,
  faultDevList: [] as any,
  optionDevList: [] as any,
  colleagueIds: "",
  isEnd: false as boolean,
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
  _up.getUserMaintenanceList({ maintenanceType: 1, departmentId:'' }).then((res) => {
    state.colleagueIdsData = res as IPersonnelRes[];
  });
  _um.getColleagueList(opts.id!).then((res) => {
    state.data = res as IColleagueListRes[];
  });
  uni.$on("selectPersonnelTBRY", (data) => {
    state.colleagueIds = data.data.map((item) => item.userId).toString();
    if (!state.colleagueIds) {
      uni.showModal({
        title: "提示",
        content: '请选择同班人员',
        showCancel: false,
      });
      return;
    }
    clickSubmit20(data.type);
  });
});

onShow(() => {
  _um.isMaintenanceItemEnd(orderId.value!).then((res) => {
    state.isEnd = res as boolean;
  });
});
onUnload(() => {
  uni.$off("selectPersonnelTBRY");
});
const assignType = computed(() => {
  return props.data.assignType === 0
    ? "手工派单"
    : props.data.assignType === 1
    ? "抢单式内部运维"
    : "";
});
const completeTimeLimit = computed(() => {
  return props.data.completeTimeLimit + "小时";
});
const onClickToDevice = (pos: any) => {
  _ums.setData({ key: "selectPositionData", value: pos });
  uni.navigateTo({
    url: `/pages/maintain/maintainDevice?orderStatus=${props.data.orderStatus}&isOption=${props.data.isOption}&orderId=${orderId.value}`,
  });
};
const onClickToScanningCode = () => {
  useScanCode({
    onlyFromCamera: true,
    success: async (res) => {
      _um
        .scanMaintainQrcode({ erData: res, orderId: orderId.value })
        .then((r: any) => {
          if (r.length >= 1) {
            _uss.setData({ key: 'data', value: r });
            uni.navigateTo({
              url: '/pages/Inspection/scanList',
            });
          } else {
            _ums.setData({ key: 'selectDeviceData', value: r });
            uni.navigateTo({
              url: '/pages/maintain/maintainDeviceInfo?isQrcode=1',
            });
          }
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
const dialogSave: Ref = ref();
const clickToPers = (type: string) => {
  if (type === '未完成提交') {
    dialogSave.value.open();
  } else {
    uni.navigateTo({
      url: `/pages/selectPersonnel/SelectPersonnel?data=${JSON.stringify(
        state.colleagueIdsData
      )}&title=选择同班人员&type=${type}`,
    });
  }
};
const hideDialog = () => {
  dialogSave.value.close();
};
const clickCancel = () => {
  uni.navigateTo({
    url: `/pages/selectPersonnel/SelectPersonnel?data=${JSON.stringify(
      state.colleagueIdsData
    )}&title=选择同班人员&type=${'未完成提交'}`,
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
const returnImgs = (str: string) => {
  let arr: any = [];
  if (!str) return;
  str.split(",").forEach((item) => {
    item = item.replace(/^\./g, "");
    arr.push({ url: BASE_API + item, extname: "png", name: `${item}.png` });
  });
  return arr;
}
function onClickToDevHistory() {
  uni.navigateTo({
    url: `/pages/devHistory/devHistory?deviceId=${props.data.orderItem[0].positionList[0].deviceList[0].deviceId}&planType=1`,
  });
}
const onClickItem = ({ currentIndex }: { currentIndex: number }) => {
  state.titleIndex = currentIndex
  onClickItemIndex(currentIndex, props.data.orderStatus)
};
function onClickItemIndex (currentIndex: Number, orderStatus: Number) {
  if (orderStatus === 20 ) {
   if (currentIndex === 0) {
    state.commonData = state.notFinishedItem
   } else {
    state.commonData = state.finishedItem
   }
 } 
 else if (orderStatus === 30 || orderStatus === 100) {
  if (currentIndex === 0) {
    state.commonData = state.faultDevList
   } else {
    state.commonData = state.optionDevList
   }
 }
}
function getFavoriteList (data: any) {
  state.finishedItem = data.finishedItem
  state.notFinishedItem = data.notFinishedItem
  state.faultDevList = data.faultDevList
  state.optionDevList = data.optionDevList
  state.titleData = data.data.orderStatus === 20 ? ['待保养', '已保养'] : ['异常设备', '正常设备']
  onClickItemIndex(state.titleIndex, data.data.orderStatus)
}
defineExpose({
getFavoriteList
});
</script>
<style scoped lang="scss">
.tag {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 16rpx;
  right: 92rpx;
}
::v-deep .uni-collapse-item__title-box {
  padding: 0 12px;
}
::v-deep .van-button{
  width: 100%;
}
::v-deep .uni-collapse{
  position: relative;
}
::v-deep .uni-button:after{
  top: 0;
}
</style>
