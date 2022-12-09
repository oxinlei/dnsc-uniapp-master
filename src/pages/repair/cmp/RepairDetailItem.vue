<template>
  <view class="wrap-box">
    <ListRow isBorder title="派单类型" :content="data.repairType === 0 ? '正常维修' : '简单维修'" />
    <ListRow isBorder title="派单名称" :content="data.orderName" />
    <ListRow isBorder title="派单编号" :content="data.id" />
    <ListRow v-if="(data.orderItem[0].positionList[0].deviceList.length > 0)" isBorder title="设备名称" :content="data.orderItem[0].positionList[0].deviceList[0].deviceName" />
    <ListRow isBorder title="提交部门" content="设备部" />
    <ListRow v-if="(data.orderItem[0].positionList[0].deviceList.length > 0)" isBorder title="设备id" :content="data.orderItem[0].positionList[0].deviceList[0].deviceNo" />
    <ListRow v-if="(data.orderItem[0].positionList[0].deviceList.length > 0)" isBorder title="设备型号" :content="data.orderItem[0].positionList[0].deviceList[0].models" />
    <ListRow
      isBorder
      title="所在位置"
      :content="`${data.orderItem[0].areaName} - ${data.orderItem[0].positionList[0].positionName}`"
    />
    <uni-list>
      <uni-list-item
        title="历史维修记录"
        showArrow
        clickable
        @click="onClickToDevHistory()"
      >
      </uni-list-item>
    </uni-list>
    <ListRow isBorder v-if="data.repairType === 0" title="审核人员" content="">
      <template #content>
        <view style="flex-wrap: wrap; display: flex">
          <view
            class="tag"
            v-for="(item, index) in data.planUser"
            :key="index"
          >
            <uni-tag
              :inverted="true"
              :text="item.userType === 2 ? item.realName : ''"
              type="primary"
              class="tag"
            />
          </view>
        </view>
      </template>
    </ListRow>

    <ListRow isBorder v-if="data.repairType === 1" title="维修人员" content="">
      <template #content>
        <view style="flex-wrap: wrap; display: flex">
          <view class="tag" v-for="(item, index) in data.planUser" :key="index">
            <uni-tag
              :inverted="true"
              :text="item.userType === 5 ? item.realName : ''"
              type="primary"
              class="tag"
            />
          </view>
        </view>
      </template>
    </ListRow>
    <ListRow isBorder title="通知人员" content="">
      <template #content>
        <view style="flex-wrap: wrap; display: flex">
          <view
            class="tag"
            v-for="(item, index) in data.planUser"
            :key="index"
          >
            <uni-tag
              :inverted="true"
              :text="item.userType === 3 ? item.realName : ''"
              type="primary"
              class="tag"
            />
          </view>
        </view>
      </template>
    </ListRow>

    <ListRow
      isBorder
      title="短信提醒"
      :content="data.isSmsRemind === 0 ? '否' : '是'"
    />

    <ListRow title="故障描述" :content="data.orderDescribe" />
    <ViewImage :data="returnImgs(data.orderImg)" />
  </view>
  <view class="wrap-box" v-if="data.orderStatus !== 0">
    <view v-if="data.orderStatus >= 10 && data.repairType === 0">
      <ListRow isBorder title="审核班长" content="右侧文字">
        <template #content>
          <view style="flex-wrap: wrap; display: flex">
            <view
              class="tag"
              v-for="(item, index) in data.planUser"
              :key="index"
            >
              <uni-tag
                :inverted="true"
                :text="item.userType === 4 ? item.realName : ''"
                type="primary"
                class="tag"
              />
            </view>
          </view>
        </template>
      </ListRow>
    </view>
    <view v-if="data.orderStatus >= 20 && data.repairType === 0">
      <ListRow
        isBorder
        title="完成时限(小时)"
        :content="data.completeTimeLimit + '小时'"
      />
      <ListRow isBorder title="维修人员" content="">
        <template #content>
          <view style="flex-wrap: wrap; display: flex">
            <view
              class="tag"
              v-for="(item, index) in data.planUser"
              :key="index"
            >
              <uni-tag
                :inverted="true"
                :text="item.userType === 5 ? item.realName : ''"
                type="primary"
                class="tag"
              />
            </view>
          </view>
        </template>
      </ListRow>
      <ListRow isBorder title="水厂意见审核人" content="">
        <template #content>
          <view style="flex-wrap: wrap; display: flex">
            <view
              class="tag"
              v-for="(item, index) in data.planUser"
              :key="index"
            >
              <uni-tag
                :inverted="true"
                :text="item.userType === 8 ? item.realName : ''"
                type="primary"
                class="tag"
              />
            </view>
          </view>
        </template>
      </ListRow>
    </view>
    <view v-if="data.orderStatus >= 30">
      <ListRow isBorder title="验收人员" content="">
        <template #content>
          <view style="flex-wrap: wrap; display: flex">
            <view
              class="tag"
              v-for="(item, index) in data.planUser"
              :key="index"
            >
              <uni-tag
                :inverted="true"
                :text="item.userType === 6 ? item.realName : ''"
                type="primary"
                class="tag"
              />
            </view>
          </view>
        </template>
      </ListRow>
      <ListRow isBorder title="维修级别" :content="data.engineerLevel + '级'" />
      <ListRow isBorder title="处理措施" :content="data.feedbackInfo" />
      <ViewImage :data="returnImgs(data.feedbackImg)" />
    </view>
    <view v-if="data.orderStatus >= 50">
      <ListRow isBorder title="验收评价" content="">
        <template #content>
          <uni-rate size="18" :value="data.acceptScore" />
        </template>
      </ListRow>
      <ListRow isBorder title="验收意见" :content="data.acceptInfo" />
      <ListRow isBorder title="处理措施" :content="data.feedbackInfo" />
      <ViewImage :data="returnImgs(data.acceptImg)" />
    </view>
    <view v-if="data.orderStatus >= 100">
      <ListRow isBorder title="水厂评价" content="">
        <template #content>
          <uni-rate size="18" :value="data.lastAcceptScore" />
        </template>
      </ListRow>
      <ListRow isBorder title="水厂意见" :content="data.lastAcceptInfo" />
      <ListRow isBorder title="处理措施" :content="data.feedbackInfo" />
      <ViewImage :data="returnImgs(data.lastAcceptImg)" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import useInspectionStore from "@/store/useInspectionStore";
import { onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import { computed, reactive, ref } from "vue";
import { IPersonnelRes, usePersonnel } from "@/hooks/usePersonnel";
import { ILayeredListRes, useDispatch } from "@/hooks/useDispatch";
import UploadPicker from "@/component/UploadPicker.vue";
import ViewImage from "@/component/ViewImage.vue";
import { storeToRefs } from "pinia";
import { BASE_API } from "@/config/baseConfig";
import ListRow from "@/component/ListRow.vue";

const _up = usePersonnel();
const _ud = useDispatch();
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});
const _uis = useInspectionStore();
const { selectDeviceData } = storeToRefs(_uis);
const state = reactive({
  formData: {},
  rules: {},
});

onLoad((opts) => {});
onShow(() => {});

const returnImgs = (str: string) => {
  let arr: any = [];
  if (!str) return;
  str.split(",").forEach((item) => {
    item = item.replace(/^\./g, "");
    arr.push({ url: BASE_API + item, extname: "png", name: `${item}.png` });
  });
  return arr;
};
function onClickToDevHistory() {
  uni.navigateTo({
    url: `/pages/devHistory/devHistory?deviceId=${props.data.orderItem[0].deviceId}&planType=2`,
  });
}
</script>
<style scoped lang="scss">
.tag {
  margin-right: 5px;
  margin-bottom: 10px;
}
</style>
