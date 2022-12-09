<template>
  <view class="wrap-box">
    <ListRow title="派单名称" :content="data.orderName" isBorder />
    <ListRow title="巡检类型" :content="assignType" isBorder />
    <ListRow
      title="开始时间"
      :content="moment(data.createTime).format('YYYY-MM-DD HH:mm')"
      isBorder
    />
    <ListRow title="处理时限" :content="completeTimeLimit" isBorder />
    <uni-list>
      <uni-list-item
        title="历史巡检记录"
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
        title="巡检人员"
        class="bb-1"
      >
        <ListRow isBorder title="抢单人员" :content="item.realName" />
        <ListRow
          v-for="(col, cIndex) in item.colleagueUser"
          isBorder
          :key="cIndex"
          title="同班人员"
          :content="col.colleagueName"
        />
        <ListRow
          v-for="(dev, dIndex) in item.maintenDevice"
          :key="dIndex"
          isBorder
          title="巡检设备"
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
                  扫码巡检
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
      <uni-col :span="24">
        <view v-if="state.isEnd === true" class="demo-uni-col dark">
          <button type="primary" @click="clickToPers('完成提交')">
            完成提交
          </button>
        </view>
      </uni-col>
      <uni-col v-if="state.isEnd === false" :span="24">
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
  IInspectionRes,
  useInspection,
} from '@/hooks/useInspection';
import ListRow from '@/component/ListRow.vue';
import { computed, reactive, ref } from 'vue';
import moment from 'moment';
import useInspectionStore from '@/store/useInspectionStore';
import { useScanCode } from '@/hooks/useScanCode';
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app';
import { IPersonnelRes, usePersonnel } from '@/hooks/usePersonnel';
import { useDebounceFn } from '@vueuse/core';

const _uis = useInspectionStore();
const _ui = useInspection();
const _up = usePersonnel();
const state = reactive({
  colleagueIds: '',
  isEnd: false as boolean,
  colleagueIdsData: [] as IPersonnelRes[],
  // 同班人员日志
  data: [] as IColleagueListRes[],
});
const props = defineProps<{
  data: IInspectionRes;
}>();
const orderId = ref('');
onLoad((opts) => {
  console.log(props.data)
  orderId.value = opts.id!;
  _up.getUserMaintenanceList({ maintenanceType: 0 }).then((res) => {
    state.colleagueIdsData = res as IPersonnelRes[];
  });
  _ui.getColleagueList(opts.id!).then((res) => {
    state.data = res as IColleagueListRes[];
  });
  uni.$on('selectPersonnelTBRY', (data) => {
    state.colleagueIds = data.data.map((item) => item.userId).toString();
    if (!state.colleagueIds) {
      uni.showModal({
        title: '请选择同班人员',
        showCancel: false,
      });
      return;
    }
    clickSubmit20(data.type);
  });
});
onShow(() => {
  _ui.isMaintenanceItemEnd(orderId.value!).then((res) => {
    state.isEnd = res as boolean;
  });
});
onUnload(() => {
  uni.$off('selectPersonnelTBRY');
});
const assignType = computed(() => {
  return props.data.assignType === 0
    ? '手工派单'
    : props.data.assignType === 1
    ? '抢单式内部运维'
    : '';
});
const completeTimeLimit = computed(() => {
  return props.data.completeTimeLimit + '小时';
});
const onClickToDevice = (pos: any) => {
  _uis.setData({ key: 'selectPositionData', value: pos });
  uni.navigateTo({
    url: `/pages/Inspection/InspectionDevice`,
  });
};
const onClickToScanningCode = () => {
  useScanCode({
    onlyFromCamera: true,
    success: async (res) => {
      _ui
        .scanInspectionQrcode({ erData: res, orderId: orderId.value })
        .then((r) => {
          _uis.setData({ key: 'selectDeviceData', value: r });
          uni.navigateTo({
            url: '/pages/Inspection/InspectionDeviceInfo?isQrcode=1',
          });
        });
    },
    fail(e) {
      uni.showToast({
        icon: 'none',
        title: '扫码失败',
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
  if (type === '完成提交') {
    _ui.applicationAccept(p).then(() => {
      uni.navigateBack();
    });
  } else if (type === '未完成提交') {
    _ui.notCompletedSave(p).then(() => {
      uni.navigateBack();
    });
  }
};
const clickSubmit30 = () => {
  _ui
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
