<template>
  <view>
    <uni-forms
      class="p-10"
      ref="formRef"
      :modelValue="state.formData"
      :rules="state.rules"
      label-width="100px"
      border
    >
      <uni-forms-item
        v-if="props.isEdit"
        label="派单类型"
        name="repairType"
        :required="isEdit"
      >
        <uni-data-select
          :clear="false"
          v-model="state.formData.repairType"
          :localdata="state.repairTypeOpts"
        ></uni-data-select>
      </uni-forms-item>
      <uni-forms-item v-if="!props.isEdit" label="派单类型" name="repairType">
        <uni-easyinput
          type="text"
          :value="
            state.formData.repairType === 0
              ? state.repairTypeOpts[0].text
              : state.repairTypeOpts[1].text
          "
          placeholder="请输派单类型"
          :disabled="!isEdit"
        />
      </uni-forms-item>
      <uni-forms-item label="派单名称" name="orderName" :required="isEdit">
        <uni-easyinput
          type="text"
          v-model="state.formData.orderName"
          placeholder="请输入派单名称"
          :disabled="!isEdit"
        />
      </uni-forms-item>

      <uni-forms-item v-if="isExistDev" label="设备名称" name="deviceNo">
        <uni-easyinput
          type="text"
          v-model="state.formData.deviceName"
          :disabled="true"
          placeholder="请输入设备名称"
        />
      </uni-forms-item>
      <uni-forms-item v-if="isExistDev" label="设备编号" name="deviceNo">
        <uni-easyinput
          type="text"
          v-model="state.formData.deviceNo"
          :disabled="true"
          placeholder="请输入设备编号"
        />
      </uni-forms-item>
      <uni-forms-item v-if="isExistDev" label="设备型号" name="models">
        <uni-easyinput
          type="text"
          v-model="state.formData.models"
          placeholder="请输入设备型号"
          :disabled="true"
        />
      </uni-forms-item>
      <uni-forms-item
        label="所在位置"
        name="positionId"
        :required="isEdit"
      >
        <uni-data-picker
          placeholder="请选择位置"
          popup-title="请选择位置"
          :localdata="state.positionOptsComputed"
          v-model="state.formData.positionId"
        >
        </uni-data-picker>
      </uni-forms-item>
      <uni-forms-item
        v-if="state.formData.repairType === 0"
        label="审核人员"
        name="examineUids"
        :required="isEdit"
        @click="clickToPers('审核人员')"
      >
        <uni-list :border="false">
          <uni-list-item showArrow>
            <template #footer>
              <view style="flex-wrap: wrap; display: flex">
                <view
                  class="tag"
                  v-for="(item, index) in state.examineUids"
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
        v-if="state.formData.repairType === 1"
        label="维修人员"
        name="planUids"
        :required="isEdit"
        @click="clickToPers('维修人员')"
      >
        <uni-list :border="false">
          <uni-list-item showArrow>
            <template #footer>
              <view style="flex-wrap: wrap; display: flex">
                <view
                  class="tag"
                  v-for="(item, index) in state.planUids"
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
        label="通知人员"
        name="noticeUids"
        @click="clickToPers('通知人员')"
      >
        <uni-list :border="false">
          <uni-list-item showArrow>
            <template #footer>
              <view style="flex-wrap: wrap; display: flex">
                <view
                  class="tag"
                  v-for="(item, index) in state.noticeUids"
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
      <!-- <uni-forms-item name="isSmsRemind" label="短信提醒" :required="isEdit">
        <uni-data-checkbox
          v-model="state.formData.isSmsRemind"
          :localdata="[
            { text: '否', value: 0, disable: !isEdit },
            { text: '是', value: 1, disable: !isEdit },
          ]"
        />
      </uni-forms-item> -->
      <uni-forms-item name="describe" label="故障描述" :required="isEdit">
        <uni-easyinput
          type="textarea"
          v-model="state.formData.describe"
          placeholder="请输入故障描述"
          :disabled="!isEdit"
        />
      </uni-forms-item>
    </uni-forms>
    <UploadPicker v-if="isEdit" @change="changeUpload" title="现场照片" />
    <ViewImage v-if="!isEdit" :data="state.imgs" />
  </view>
</template>

<script lang="ts" setup>
import useInspectionStore from '@/store/useInspectionStore';
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app';
import { computed, onBeforeUnmount, reactive, Ref, ref } from 'vue';
import { IPersonnelRes, usePersonnel } from '@/hooks/usePersonnel';
import { ILayeredListRes, useDispatch, ILayeredListResData } from '@/hooks/useDispatch';
import UploadPicker from '@/component/UploadPicker.vue';
import ViewImage from '@/component/ViewImage.vue';
import { storeToRefs } from 'pinia';

const _up = usePersonnel();
const _ud = useDispatch();
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: {},
  },
});
const _uis = useInspectionStore();
const { selectDeviceData } = storeToRefs(_uis);

let existDev = ref(false);
let isScan = ref(false);
const isExistDev = computed(() => {
  return !existDev.value;
});
const state = reactive({
  existDev: false,
  positionOpts: [] as ILayeredListRes[],
  repairTypeOpts: [
    { value: 0, text: '正常维修' },
    { value: 1, text: '简单维修' },
  ],
  // 审核人员
  examineUids: [] as IPersonnelRes[],
  examineUidsData: [] as IPersonnelRes[],
  // 财务人员
  noticeUids: [] as IPersonnelRes[],
  noticeUidsData: [] as IPersonnelRes[],
  // 维修人员
  planUids: [] as IPersonnelRes[],
  planUidsData: [] as IPersonnelRes[],
  positionOptsComputed: [] as ILayeredListResData[],
  formData: {
    repairType: 0,
    ...selectDeviceData.value,
    ...props.data,
  },
  rules: {
    repairType: {
      rules: [
        {
          required: true,
          errorMessage: '请选择派单类型',
        },
      ],
    },
    orderName: {
      rules: [
        {
          required: true,
          errorMessage: '请输入派单名称',
        },
      ],
    },
    positionId: {
      rules: [
        {
          required: true,
          errorMessage: '请输选择所在位置',
        },
      ],
    },
    examineUids: {
      rules: [
        {
          required: true,
          errorMessage: '请选择审核人员',
        },
      ],
    },
    planUids: {
      rules: [
        {
          required: true,
          errorMessage: '请选择维修人员',
        },
      ],
    },
    isSmsRemind: {
      rules: [
        {
          required: true,
          errorMessage: '请选择短信提醒',
        },
      ],
    },
    describe: {
      rules: [
        {
          required: true,
          errorMessage: '请输入故障描述',
        },
      ],
    },
  },
});

const initData = () => {
  // 审核人员
  _up.getUserMaintenanceList({ maintenanceType: 3, departmentId:'' }).then((res) => {
    state.examineUidsData = res as IPersonnelRes[];
  });
  // 通知人员
  // _up.getUserMaintenanceList({ maintenanceType: 6 }).then((res) => {
  //   state.noticeUidsData = res as IPersonnelRes[];
  // });
  _up.getUserList().then((res) => {
    state.noticeUidsData = res as IPersonnelRes[];
  });
  // 维修人员
  _up.getUserMaintenanceList({ maintenanceType: 2, departmentId:''}).then((res) => {
    state.planUidsData = res as IPersonnelRes[];
  });
  // 设备所在位置
  _ud.getLayeredList().then((res) => {
    state.positionOpts = res as ILayeredListRes[];
    positionOptsComputedData()
  });
};
onLoad((opts) => {
  existDev.value = !opts.existDev!;
  isScan.value = !opts.existDev!;
  state.formData.orderName = !existDev.value
    ? selectDeviceData.value.deviceName + '-维修派单'
    : '';
  state.existDev = !existDev.value;
  initData();
  uni.$on('selectPersonnel', (data) => {
    selectPersonnelType(data);
  });
});
onShow(() => {});
onUnload(() => {
  uni.$off('selectPersonnel');
});

onBeforeUnmount(() => {
  if (isScan.value) {
    _uis.setData({
      key: 'selectDeviceData',
      value: {},
    });
  }
});
const positionOptsComputedData = () => {
  const tmp = [] as any;
  state.positionOpts.forEach((item) => {
    let obj = {
      text: item.areaName,
      value: item.areaId,
      children: [] as any,
    };
    item.positionList.forEach((o: any, i: number) => {
      obj.children[i] = {
        text: o.positionName,
        value: o.positionId,
      };
    });
    tmp.push(obj);
  });
  state.positionOptsComputed = tmp
  state.formData.positionId = selectDeviceData.value.positionId === undefined ? tmp[0].children[0].value : selectDeviceData.value.positionId
  // return tmp;
};
const selectPersonnelType = (
  data: {
    title: string;
    data?: IPersonnelRes[];
  },
  deliver = false
) => {
  switch (data.title) {
    case '审核人员':
      if (deliver) {
        return state.examineUidsData;
      }
      state.examineUids = data.data!;
      state.formData.examineUids = data.data!.map((item) => item.userId);
      break;
    case '维修人员':
      if (deliver) {
        return state.planUidsData;
      }
      state.planUids = data.data!;
      state.formData.planUids = data.data!.map((item) => item.userId);
      break;
    case '通知人员':
      if (deliver) {
        return state.noticeUidsData;
      }
      state.noticeUids = data.data!;
      state.formData.noticeUids = data.data!.map((item) => item.userId);
      break;
    default:
      return 0;
  }
};
let uploadImgs = ref([]);
const changeUpload = (imgs: any) => {
  uploadImgs.value = imgs;
};
const clickToPers = (type: string) => {
  if (!props.isEdit) return;
  const d = {
    title: type,
  };
  const res = selectPersonnelType(d, true);

  uni.navigateTo({
    url: `/pages/selectPersonnel/SelectPersonnel?data=${JSON.stringify(
      res
    )}&title=${type}`,
  });
};
const formRef = ref<InstanceType<any>>(null);

defineExpose({
  formRef,
  state,
  uploadImgs,
});
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
