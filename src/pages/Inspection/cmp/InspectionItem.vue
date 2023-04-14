<template>
  <uni-card
    v-for="(item, index) in data"
    v-show="item.planType === 0"
    :key="index"
    :title="item.orderName"
    margin="0 0 10px 0"
    padding="0"
    @click="clickToDetail(item)"
  >
    <template #title>
      <view class="title">
        <text class="name">{{ item.orderName }}</text>
        <button
          v-if="item.isOption === 1 && (item.orderStatus === 0 || item.orderStatus === 8 )"
          class="mini-btn"
          type="primary"
          size="mini"
          @click="clickOrder(item)"
        >
          抢单
        </button>
        <button
          v-if="item.isOption === 1 && item.orderStatus === 20"
          class="mini-btn"
          type="primary"
          size="mini"
          @click="clickToDetail(item)"
        >
          执行
        </button>
        <button
          v-if="
          (item.isOption === 1 && item.orderStatus === 30) ||
          (isExamine && item.orderStatus === 30)
          "
          class="mini-btn"
          type="primary"
          size="mini"
          @click="clickToDetail(item)"
        >
          验收
        </button>
      </view>
    </template>
    <view class="box">
      <view class="left-msg">
        <text class="msg">巡</text>
      </view>
      <view class="right-msg">
        <text>
          派单时间：{{ moment(item.createTime).format("MM-DD HH:mm") }}
        </text>
        <text> 处理时限： {{ item.completeTimeLimit }}小时 </text>
        <text>
          巡检类型：
          {{
            item.assignType === 0
              ? "手工派单"
              : item.assignType === 1
              ? "抢单式内部运维"
              : "告警手工派单"
          }}
        </text>
      </view>
    </view>
  </uni-card>
</template>

<script lang="ts" setup>
import moment from "moment";
import useInspectionStore from "@/store/useInspectionStore";
import { useInspection, IInspectionRes } from "@/hooks/useInspection";
const props = defineProps({
  data: {
    type: Array as () => IInspectionRes[],
    default: [],
  },
  // 是否审核跳转过来的
  isExamine: {
    type: Boolean,
    default: false,
  },
});
const _ui = useInspection();
const _uis = useInspectionStore();
const clickToDetail = (item: IInspectionRes) => {
  uni.navigateTo({
    url: `/pages/Inspection/InspectionDetail?title=${item.orderName}&id=${item.id}`,
  });
};
const clickOrder = (item: IInspectionRes) => {
  _ui.grabbingMaintain({ orderId: item.id }).then(() => {
    uni.navigateTo({
      url: `/pages/Inspection/InspectionDetail?title=${item.orderName}&id=${item.id}`,
    });
  });
};
</script>
<style scoped lang="scss">
.title {
  display: flex;
  border-bottom: 1px #ebeef5 solid;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  overflow: hidden;
  .name {
    flex: 1;
  }
}

.box {
  display: flex;
  padding: 10px;
}
.left-msg {
  margin-right: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .msg {
    color: red;
    font-size: 32px;
  }
}
.right-msg {
  display: flex;
  flex-direction: column;
}
</style>
