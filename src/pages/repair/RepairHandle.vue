<template>
  <view class="container pb-50">
    <view class="wrap-box">
      <ListRow
        isBorder
        v-if="state.data.lastAcceptInfo"
        title="驳回人员"
        :content="
          state.data.lastAcceptUser[state.data.lastAcceptUser.length - 1]
            .realName
        "
      />
      <ListRow
        isBorder
        v-if="state.data.lastAcceptInfo"
        title="退回整改"
        :content="state.data.lastAcceptInfo"
      />
      <ListRow
        isBorder
        title="派单类型"
        :content="state.data.repairType === 0 ? '正常维修' : '简单维修'"
      />
      <ListRow
        isBorder
        title="派单人员"
        :content="state.data.planUser[0].realName"
      />
      <ListRow
        isBorder
        title="所在位置"
        :content="`${state.data.orderItem[0].areaName} - ${state.data.orderItem[0].positionList[0].positionName}`"
      />

      <uni-forms
        class="p-10"
        ref="formRef"
        :modelValue="state.formData"
        :rules="state.rules"
        label-width="100px"
        border
      >
        <uni-forms-item
          label="验收人员"
          name="acceptUserIds"
          required
          @click="clickToPers('验收人员')"
        >
          <uni-list :border="false">
            <uni-list-item showArrow>
              <template #footer>
                <view style="flex-wrap: wrap; display: flex">
                  <view
                    class="tag"
                    v-for="(item, index) in state.acceptUserIds"
                    :key="index"
                  >
                    <uni-tag
                      :inverted="true"
                      :text="item.realName"
                      type="primary"
                      class="tag"
                    />
                  </view>
                </view>
              </template>
            </uni-list-item>
          </uni-list>
        </uni-forms-item>

        <uni-forms-item
          v-if="state.data.repairType === 1"
          label="水厂领导"
          name="lastAcceptUserIds"
          required
          @click="clickToPers('水厂领导')"
        >
          <uni-list :border="false">
            <uni-list-item showArrow>
              <template #footer>
                <view style="flex-wrap: wrap; display: flex">
                  <view
                    class="tag"
                    v-for="(item, index) in state.lastAcceptUserIds"
                    :key="index"
                  >
                    <uni-tag
                      :inverted="true"
                      :text="item.realName"
                      type="primary"
                      class="tag"
                    />
                  </view>
                </view>
              </template>
            </uni-list-item>
          </uni-list>
        </uni-forms-item>
        <uni-forms-item label="维修级别" name="engineerLevel">
          <uni-data-select
            :clear="false"
            v-model="state.formData.engineerLevel"
            :localdata="engineerLevelOpts"
          ></uni-data-select>
        </uni-forms-item>

        <uni-forms-item name="isMove" label="是否移动">
          <uni-data-checkbox
            v-model="state.formData.isMove"
            :localdata="[
              { text: '否', value: 0 },
              { text: '是', value: 1 },
            ]"
          />
        </uni-forms-item>

        <uni-forms-item
          v-show="state.formData.isMove === 1"
          label="财务人员"
          name="financeUserId"
          @click="clickToPers('财务人员')"
        >
          <uni-list :border="false">
            <uni-list-item showArrow>
              <template #footer>
                <view style="flex-wrap: wrap; display: flex">
                  <view
                    class="tag"
                    v-for="(item, index) in state.financeUserId"
                    :key="index"
                  >
                    <uni-tag
                      :inverted="true"
                      :text="item.realName"
                      type="primary"
                      class="tag"
                    />
                  </view>
                </view>
              </template>
            </uni-list-item>
          </uni-list>
        </uni-forms-item>

        <uni-forms-item name="feedbackInfo" required label="处理措施">
          <uni-easyinput
            type="textarea"
            v-model="state.formData.feedbackInfo"
            placeholder="请输入处理措施"
          />
        </uni-forms-item>
      </uni-forms>
      <UploadPicker @change="changeUpload" />
    </view>
  </view>
  <view class="flex-footer">
    <uni-row class="demo-uni-row">
      <uni-col :span="24">
        <view class="demo-uni-col dark">
          <button type="primary" @click="clickSubmit">提交</button>
        </view>
      </uni-col>
    </uni-row>
  </view>
</template>

<script lang="ts" setup>
import { reactive, Ref, ref } from 'vue';
import ListRow from '@/component/ListRow.vue';
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app';
import { IRepairRes, useRepair } from '@/hooks/useRepair';
import { IPersonnelRes } from '@/hooks/usePersonnel';
import { usePersonnel } from '@/hooks/usePersonnel';
import UploadPicker from '@/component/UploadPicker.vue';
import { updateLocale } from 'moment';
import { IImgs, useUpload } from '@/hooks/useUpload';

const _ur = useRepair();
const _up = usePersonnel();
const _uu = useUpload();
const state = reactive({
  data: {} as IRepairRes,
  formData: {
    orderId: '',
    acceptUserIds: '',
    financeUserId: 0,
    engineerLevel: 5,
    isMove: 0,
    feedbackInfo: '',
    feedbackImg: '',
    lastAcceptUserIds: '',
  },
  rules: {
    acceptUserIds: {
      rules: [
        {
          required: true,
          errorMessage: '请选择验收人员',
        },
      ],
    },
    lastAcceptUserIds: {
      rules: [
        {
          required: true,
          errorMessage: '请选择水厂领导',
        },
      ],
    },
  },
  acceptUserIds: [] as IPersonnelRes[],
  acceptUserIdsData: [] as IPersonnelRes[],
  financeUserId: [] as IPersonnelRes[],
  financeUserIdData: [] as IPersonnelRes[],
  lastAcceptUserIds: [] as IPersonnelRes[],
  lastAcceptUserIdsData: [] as IPersonnelRes[],
});
const engineerLevelOpts = [
  { value: 1, text: '1级' },
  { value: 2, text: '2级' },
  { value: 3, text: '3级' },
  { value: 4, text: '4级' },
  { value: 5, text: '5级' },
];
onLoad((opts) => {
  state.data = JSON.parse(opts.data!);
  uni.setNavigationBarTitle({
    title: opts.title!,
  });
  _up
    .getUserMaintenanceList({
      maintenanceType: 6,
      departmentId:''
    })
    .then((res) => {
      state.financeUserIdData = res as IPersonnelRes[];
    });
  _up
    .getUserMaintenanceList({
      maintenanceType: 4,
      departmentId:''
    })
    .then((res) => {
      state.acceptUserIdsData = res as IPersonnelRes[];
    });
  _up
    .getUserMaintenanceList({
      maintenanceType: 5,
      departmentId:''
    })
    .then((res) => {
      state.lastAcceptUserIdsData = res as IPersonnelRes[];
    });
  uni.$on('selectPersonnel', (data) => {
    switch (data.title) {
      case '验收人员':
        state.acceptUserIds = data.data;
        state.formData.acceptUserIds = data.data
          .map((item) => item.userId)
          .toString();
        break;
      case '财务人员':
        state.financeUserId = data.data;
        state.formData.financeUserId = data.data[0]?.userId;
        break;
      case '水厂领导':
        state.lastAcceptUserIds = data.data;
        state.formData.lastAcceptUserIds = data.data
          .map((item) => item.userId)
          .toString();
        break;
    }
  });
});

onShow(() => {});
onUnload(() => {
  uni.$off('selectPersonnel');
});

const clickToPers = (type: string) => {
  if (type === '验收人员' || type === '水厂领导') {
    uni.navigateTo({
      url: `/pages/selectPersonnel/SelectPersonnel?data=${JSON.stringify(
        state.acceptUserIdsData
      )}&title=${type}`,
    });
  } else if (type === '财务人员') {
    uni.navigateTo({
      url: `/pages/selectPersonnel/SelectPersonnel?data=${JSON.stringify(
        state.financeUserIdData
      )}&title=${type}&single=1`,
    });
  }
};
let uploadImgs = [] as IImgs[];
const changeUpload = (imgs: any) => {
  uploadImgs = imgs;
};
const formRef: Ref = ref();
const clickSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      state.formData.orderId = state.data.id;
      state.formData.financeUserId = state.formData.financeUserId
        ? state.formData.financeUserId
        : 0;
      if (uploadImgs.length) {
        _uu.upload(uploadImgs).then((imgs: any) => {
          state.formData.feedbackImg = imgs.url.toString();
          _ur.applicationAccept(state.formData).then((res) => {
            uni.navigateBack();
          });
        });
      } else {
        state.formData.feedbackImg = '';
        _ur.applicationAccept(state.formData).then((res) => {
          uni.navigateBack();
        });
      }
    })
    .catch((err) => {});
};
</script>
<style scoped lang="scss">
::v-deep .uni-list-item__container {
  overflow: inherit;
}
::v-deep .uni-list-item__container {
  padding: 0;
}
.tag {
  margin-right: 5px;
  margin-bottom: 10px;
}
</style>
