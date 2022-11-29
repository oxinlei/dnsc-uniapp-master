<template>
  <view class="container">
    <SelectBar :data="selectPositionData" @change="search" field="deviceName" />
    <view class="wrap-box mt-10">
      <uni-list>
        <uni-list-item
          v-for="(dev, index) in state.searchData"
          :key="index"
          :title="'设备名称：' + dev.deviceName"
          showArrow
          clickable
          @click="onClickToDevDetail(dev)"
        >
          <template v-slot:footer>
            <view>
              <view class="tag">
                <uni-tag v-if="dev.completeStatus === 0" text="未巡检" />
                <uni-tag
                  v-if="dev.completeStatus === 1"
                  text="已巡检"
                  type="primary"
                />
                <uni-tag
                  v-if="dev.completeStatus === 2"
                  text="已巡检"
                  type="error"
                />
              </view>
            </view>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { onMounted, provide, reactive } from "vue";
import useInspectionStore from "@/store/useInspectionStore";
import { storeToRefs } from "pinia";
import SelectBar from "@/component/SelectBar.vue";

const _uis = useInspectionStore();
const { selectPositionData } = _uis;

const state = reactive({
  searchValue: "",
  searchData: selectPositionData as any[],
});
onMounted(() => {
  console.log(selectPositionData);
});

const search = (val: undefined | any[]) => {
  console.log(val);
  if (val === undefined) {
    state.searchData = selectPositionData;
  } else {
    state.searchData = val;
  }
};
const onClickToDevDetail = (dev: any) => {
  _uis.setData({ key: "selectDeviceData", value: dev });
  uni.navigateTo({
    url: `/pages/Inspection/InspectionDeviceInfo`,
  });
};
</script>
<style scoped lang="scss">
.tag {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
::v-deep .uni-searchbar {
  padding: 0;
}
</style>
