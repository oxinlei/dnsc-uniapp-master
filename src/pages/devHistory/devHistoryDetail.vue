<template>
  <view class="container">
    <view class="wrap-box">
      <ListRow isBorder title="派单名称" :content="state.data.orderName" />
      <ListRow isBorder title="派单编号" :content="state.data.id" />
      <ListRow isBorder title="设备名称" :content="state.data.orderItem[0].positionList[0].deviceList[0].deviceName" />
      <ListRow isBorder title="所在位置" :content="state.data.orderItem[0].areaName + '-' + state.data.orderItem[0].positionList[0].positionName" />
      <ListRow isBorder title="完成时限" :content="state.data.completeTimeLimit" />
      <ListRow isBorder title="故障描述" :content="state.data.orderDescribe" />
      <ListRow isBorder title="处理措施" :content="state.data.feedbackInfo" />
      <ListRow isBorder title="派单人员" content="">
        <template #content>
          <view style="flex-wrap: wrap; display: flex">
            <view
              class="tag"
              v-for="(item, index) in state.data.planUser"
              :key="index"
            >
              <uni-tag
                :inverted="true"
                :text="item.userType === 1 ? item.realName : ''"
                type="primary"
                class="tag"
              />
            </view>
          </view>
        </template>
      </ListRow>
      <ListRow isBorder title="派单时间" :content="moment(state.data.timeOne).format('YYYY-MM-DD HH:mm')" />
      <ListRow isBorder title="审核人员" content="">
        <template #content>
          <view style="flex-wrap: wrap; display: flex">
            <view
              class="tag"
              v-for="(item, index) in state.data.planUser"
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
      <ListRow isBorder title="审核时间" :content="moment(state.data.timeTwo).format('YYYY-MM-DD HH:mm')"/>
      <ListRow isBorder title="审核班长" content="">
        <template #content>
          <view style="flex-wrap: wrap; display: flex">
            <view
              class="tag"
              v-for="(item, index) in state.data.planUser"
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
      <ListRow isBorder title="班长审核时间" :content="moment(state.data.timeFour).format('YYYY-MM-DD HH:mm')"/>
      <ListRow isBorder title="维修人员" content="">
        <template #content>
          <view style="flex-wrap: wrap; display: flex">
            <view
              class="tag"
              v-for="(item, index) in state.data.planUser"
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
      <ListRow isBorder title="维修时间" :content="moment(state.data.timeFive).format('YYYY-MM-DD HH:mm')"/>
      <ListRow isBorder title="验收人员" content="">
        <template #content>
          <view style="flex-wrap: wrap; display: flex">
            <view
              class="tag"
              v-for="(item, index) in state.data.planUser"
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
      <ListRow isBorder title="验收时间" :content="moment(state.data.timeSix).format('YYYY-MM-DD HH:mm')"/>
      <ListRow isBorder title="水厂意见审核人员" content="">
        <template #content>
          <view style="flex-wrap: wrap; display: flex">
            <view
              class="tag"
              v-for="(item, index) in state.data.planUser"
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
      <ListRow isBorder title="水厂意见审核时间" :content="moment(state.data.timeEait).format('YYYY-MM-DD HH:mm')"/>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from "vue";
import moment from "moment";
import ListRow from "@/component/ListRow.vue";

const state = reactive({
  data: [] as any
});
onLoad((opts) => {
  state.data = JSON.parse(opts.data!);
  state.data.acceptances.forEach((e:any) => {
    if (e.acceptanceType === 0) {
      state.data.feedbackInfo = e.acceptanceInfo
      state.data.feedbackImg = e.acceptanceImgs
    } else if (e.acceptanceType === 1) {
      state.data.acceptInfo = e.acceptanceInfo
      state.data.acceptScore = e.acceptScore
      state.data.acceptImg = e.acceptanceImgs
    } else if (e.acceptanceType === 3) {
      state.data.lastAcceptInfo = e.acceptanceInfo
      state.data.lastAcceptScore = e.acceptScore
      state.data.lastAcceptImg = e.acceptanceImgs
    }
    state.data.maintenanceUser.forEach((item: any) => {
      if (item.userType === 1) {
        state.data.timeOne = item.maintenanceDate
      } else if (item.userType === 2) {
        state.data.timeTwo = item.maintenanceDate
      } else if (item.userType === 4) {
        state.data.timeFour = item.maintenanceDate
      } else if (item.userType === 5) {
        state.data.timeFive = item.maintenanceDate
      } else if (item.userType === 6) {
        state.data.timeSix = item.maintenanceDate
      } else if (item.userType === 8) {
        state.data.timeEait = item.maintenanceDate
      }
    })
  });
})
</script>
<style scoped lang="scss">
.box {
  padding: 5px 10px;
}
</style>
