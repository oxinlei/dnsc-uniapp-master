<template>
  <view class="wrap-box" v-if="data.orderStatus === 0">
    <uni-forms
      class="p-10"
      ref="formRef0"
      :modelValue="state.formData0"
      :rules="state.rules0"
      label-width="100px"
      border
    >
      <uni-forms-item label="提交部门">
        <uni-data-select
          v-model="state.value"
          :localdata="state.departmentOld"
        ></uni-data-select>
      </uni-forms-item>
      <uni-forms-item
        label="选择班长"
        name="chargeUserId"
        required
        @click="clickToPers('选择班长')"
      >
        <uni-list :border="false">
          <uni-list-item showArrow>
            <template #footer>
              <view style="flex-wrap: wrap; display: flex">
                <view
                  class="tag"
                  v-for="(item, index) in state.chargeUserIds"
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
    </uni-forms>
  </view>

  <view class="wrap-box" v-if="data.orderStatus === 10">
    <uni-forms
      class="p-10"
      ref="formRef10"
      :modelValue="state.formData10"
      :rules="state.rules10"
      label-width="100px"
      border
    >
      <uni-forms-item label="完成时限" name="completeTimeLimit" required>
        <uni-number-box :min="1" v-model="state.formData10.completeTimeLimit" />
      </uni-forms-item>
      <uni-forms-item
        label="维修人员"
        name="planUserIds"
        required
        @click="clickToPers('维修人员')"
      >
        <uni-list :border="false">
          <uni-list-item showArrow>
            <template #footer>
              <view style="flex-wrap: wrap; display: flex">
                <view
                  class="tag"
                  v-for="(item, index) in state.planUserIds"
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
        label="水厂意见审核人"
        name="lastAcceptUserIds"
        required
        @click="clickToPers('水厂意见审核人')"
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
    </uni-forms>
  </view>
  <view class="wrap-box" v-if="data.orderStatus === 30">
    <uni-forms
      class="p-10"
      ref="formRef30"
      :modelValue="state.formData30"
      :rules="state.rules30"
      label-width="100px"
      border
    >
      <uni-forms-item label="验收评价" name="acceptScore">
        <uni-rate
          :touchable="false"
          :size="18"
          v-model="state.formData30.acceptScore"
        />
      </uni-forms-item>
      <uni-forms-item label="验收意见" name="acceptInfo">
        <uni-easyinput
          type="textarea"
          v-model="state.formData30.acceptInfo"
          placeholder="请输入验收意见"
        />
      </uni-forms-item>
    </uni-forms>
    <UploadPicker @change="changeUpload" />
  </view>
  <view class="wrap-box" v-if="data.orderStatus === 50">
    <uni-forms
      class="p-10"
      ref="formRef50"
      :modelValue="state.formData50"
      :rules="state.rules50"
      label-width="100px"
      border
    >
      <uni-forms-item label="水厂评价" name="lastAcceptScore">
        <uni-rate
          :touchable="false"
          :size="18"
          v-model="state.formData50.lastAcceptScore"
        />
      </uni-forms-item>
      <uni-forms-item label="水厂意见" name="lastAcceptInfo">
        <uni-easyinput
          type="textarea"
          v-model="state.formData50.lastAcceptInfo"
          placeholder="请输入水厂意见"
        />
      </uni-forms-item>
    </uni-forms>
    <UploadPicker @change="changeUpload" />
  </view>

  <view class="flex-footer" v-if="data.orderStatus === 0">
    <uni-row class="demo-uni-row">
      <uni-col :span="11">
        <view class="demo-uni-col dark">
          <button type="primary" @click="clickSubmit0">审核通过</button>
        </view>
      </uni-col>
      <uni-col :span="11" :offset="2">
        <view class="demo-uni-col dark">
          <button type="primary" @click="showDialog0">订单取消</button>
        </view>
      </uni-col>
    </uni-row>
  </view>
  <view class="flex-footer" v-if="data.orderStatus === 10">
    <uni-row class="demo-uni-row">
      <uni-col :span="24">
        <view class="demo-uni-col dark">
          <button type="primary" @click="clickSubmit10">派单</button>
        </view>
      </uni-col>
    </uni-row>
  </view>
  <view class="flex-footer" v-if="data.orderStatus === 30">
    <uni-row class="demo-uni-row">
      <uni-col :span="24">
        <view class="demo-uni-col dark">
          <button type="primary" @click="clickSubmit30">验收通过</button>
        </view>
      </uni-col>
    </uni-row>
  </view>
  <view class="flex-footer" v-if="data.orderStatus === 50">
    <uni-row class="demo-uni-row">
      <uni-col :span="11">
        <view class="demo-uni-col dark">
          <button type="primary" @click="clickSubmit50">审核通过</button>
        </view>
      </uni-col>
      <uni-col :span="11" :offset="2">
        <view class="demo-uni-col dark">
          <button type="primary" @click="showInputDialog">退回整改</button>
        </view>
      </uni-col>
    </uni-row>
  </view>

  <uni-popup ref="dialog0" type="dialog">
    <uni-popup-dialog
      type="error"
      cancelText="取消"
      confirmText="确定"
      title="是否取消订单"
      @confirm="clickCancel0"
      @close="hideDialog0"
    ></uni-popup-dialog>
  </uni-popup>

  <uni-popup ref="inputDialog" type="dialog">
    <uni-popup-dialog
      ref="inputClose"
      mode="input"
      title="提示"
      placeholder="请输入驳回原因"
      @confirm="clickConfim50"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script lang="ts" setup>
import useInspectionStore from '@/store/useInspectionStore';
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app';
import { computed, reactive, Ref, ref } from 'vue';
import { IPersonnelRes, usePersonnel } from '@/hooks/usePersonnel';
import UploadPicker from '@/component/UploadPicker.vue';
import { storeToRefs } from 'pinia';
import { useRepair, IRepairRes } from '@/hooks/useRepair';
import { IImgs, useUpload } from '@/hooks/useUpload';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const _uis = useInspectionStore();
const _uu = useUpload();
const _ur = useRepair();
const _up = usePersonnel();

const { selectDeviceData } = storeToRefs(_uis);
const state = reactive({
  value: 0 as number,
  departmentOld: [
    { value: 0, text: "设备部" },
    { value: 1, text: "生产部" },
    { value: 2, text: "计量中心" },
  ],
  formData0: {
    orderId: props.data.id,
    chargeUserIds: undefined as undefined | number,
  },
  formData10: {
    orderId: props.data.id,
    completeTimeLimit: 1,
    planUserIds: undefined,
    lastAcceptUserIds: undefined,
  },
  formData30: {
    orderId: props.data.id,
    acceptInfo: '',
    acceptImg: '',
    acceptScore: 4,
  },
  formData50: {
    orderId: props.data.id,
    lastAcceptScore: 4,
    lastAcceptImg: '',
    lastAcceptInfo: '',
  },
  formDataTH50: {
    orderId: props.data.id,
    lastRejectionInfo: '',
  },
  rules0: {
    chargeUserIds: {
      rules: [
        {
          required: true,
          errorMessage: '请选择班长',
        },
      ],
    },
  },
  rules10: {
    completeTimeLimit: {
      rules: [
        {
          required: true,
          errorMessage: '请输入完成时限',
        },
      ],
    },
    planUserIds: {
      rules: [
        {
          required: true,
          errorMessage: '请选择维修人员',
        },
      ],
    },
    lastAcceptUserIds: {
      rules: [
        {
          required: true,
          errorMessage: '请选择水厂意见审核人',
        },
      ],
    },
  },
  rules30: {},
  rules50: {},
  chargeUserIds: [] as IPersonnelRes[],
  chargeUserData: [] as IPersonnelRes[],
  lastAcceptUserIds: [] as IPersonnelRes[],
  lastAcceptUserData: [] as IPersonnelRes[],
  planUserIds: [] as IPersonnelRes[],
  planUserData: [] as IPersonnelRes[],
});
onLoad((opts) => {
  init();
  uni.$on('selectPersonnel', (data) => {
    switch (data.title) {
      case '选择班长':
        state.chargeUserIds = data.data;
        state.formData0.chargeUserIds = data.data[0]?.userId;
        break;
      case '水厂意见审核人':
        state.lastAcceptUserIds = data.data;
        const us1 = data.data.map((item) => item.userId);
        state.formData10.lastAcceptUserIds = us1.toString();
        break;
      case '维修人员':
        state.planUserIds = data.data;
        const us2 = data.data.map((item) => item.userId);
        state.formData10.planUserIds = us2.toString();
        break;
    }
  });
});
onShow(() => {});
onUnload(() => {
  uni.$off('selectPersonnel');
});
async function init() {
  state.chargeUserData = (await _up.getUserMaintenanceList({
    maintenanceType: 7,
    departmentId:''
  })) as IPersonnelRes[];

  state.planUserData = (await _up.getUserMaintenanceList({
    maintenanceType: 2,
    departmentId:''
  })) as IPersonnelRes[];

  state.lastAcceptUserData = (await _up.getUserMaintenanceList({
    maintenanceType: 5,
    departmentId:''
  })) as IPersonnelRes[];
}
const clickToPers = (type: string) => {
  if (type === '选择班长') {
    uni.navigateTo({
      url: `/pages/selectPersonnel/SelectPersonnel?data=${JSON.stringify(
        state.chargeUserData
      )}&title=${type}&single=1`,
    });
  } else if (type === '水厂意见审核人') {
    uni.navigateTo({
      url: `/pages/selectPersonnel/SelectPersonnel?data=${JSON.stringify(
        state.lastAcceptUserData
      )}&title=${type}`,
    });
  } else if (type === '维修人员') {
    uni.navigateTo({
      url: `/pages/selectPersonnel/SelectPersonnel?data=${JSON.stringify(
        state.planUserData
      )}&title=${type}`,
    });
  }
};
const formRef0: Ref = ref();
const clickSubmit0 = () => {
  _ur.validate(formRef0).then(() => {
    _ur.reviewOrder(state.formData0).then(() => {
      uni.navigateBack();
    });
  });
};
const clickCancel0 = () => {
  const p = {
    orderId: state.formData0.orderId,
  };
  _ur.closeOrder(p).then(() => {
    uni.navigateBack();
  });
};
const formRef10: Ref = ref();
const clickSubmit10 = () => {
  _ur.validate(formRef10).then(() => {
    _ur.assignOrder(state.formData10).then(() => {
      uni.navigateBack();
    });
  });
};
const dialog0: Ref = ref();
const showDialog0 = () => {
  dialog0.value.open();
};
const hideDialog0 = () => {
  dialog0.value.close();
};
let uploadImgs: IImgs[] = [];
const changeUpload = (imgs: any) => {
  uploadImgs = imgs;
};
const formRef30: Ref = ref();
const clickSubmit30 = () => {
  _ur.validate(formRef30).then(() => {
    _uu.upload(uploadImgs).then((imgs: any) => {
      state.formData30.acceptImg = imgs.url.toString();
      _ur.acceptanceOrder(state.formData30).then((res) => {
        uni.navigateBack();
      });
    });
  });
};
const formRef50: Ref = ref();
const clickSubmit50 = () => {
  _ur.validate(formRef50).then(() => {
    _uu.upload(uploadImgs).then((imgs: any) => {
      state.formData50.lastAcceptImg = imgs.url.toString();
      _ur.lastAcceptanceOrder(state.formData50).then((res) => {
        uni.navigateBack();
      });
    });
  });
};
const inputDialog: Ref = ref();
const showInputDialog = () => {
  inputDialog.value.open();
};
const clickConfim50 = (val) => {
  if (!val) {
    uni.showToast({
      title: '请输入驳回原因',
      icon: 'none',
    });
    return;
  }
  state.formDataTH50.lastRejectionInfo = val;
  _ur.lastRejectionOrder(state.formDataTH50).then((res) => {
    uni.navigateBack();
  });
};
</script>
<style scoped lang="scss">
::v-deep .uni-list-item__container {
  overflow: inherit;
}
::v-deep .uni-list-item__container {
  padding: 0;
}
::v-deep .uni-numbox {
  justify-content: end;
}
.tag {
  margin-right: 5px;
  margin-bottom: 10px;
}
</style>
