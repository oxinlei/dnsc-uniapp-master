<template>
  <view>
    <uni-forms class="p-10" ref="formRef" :modelValue="state.formData" :rules="state.rules" label-width="100px" border>
      <uni-forms-item v-if="isScan==='0'" label="物料类型">
        <uni-data-select :clear="false" v-model="state.repairType" :localdata="state.repairTypeOpts" @change="suppliesChange" />
      </uni-forms-item>
      <uni-forms-item v-if="isScan==='0'" label="物料名称" name="materialId" :required="true">
        <uni-data-select :clear="false" v-model="state.formData.materialId" :localdata="state.supplies" @change="suppliesDev" />
      </uni-forms-item>
      <uni-forms-item v-if="isScan==='1'" label="物料名称">
        <uni-easyinput type="text" v-model="state.formData.materialName" :disabled="true" />
      </uni-forms-item>
      <uni-forms-item label="库存量">
        <view style="display: flex;">
          <uni-easyinput type="number" v-model="state.formData.stockNum" :disabled="true" />
          <button style="margin-left: 12px;font-size: 16px;" type="warn" size="mini" @click="clickSubmit">异常</button>
        </view>
      </uni-forms-item>
      <uni-forms-item label="操作类型" name="optionType" :required="true">
        <uni-data-select :clear="false" v-model="state.formData.optionType" :localdata="state.optionTypeList" />
      </uni-forms-item>
      <uni-forms-item label="数量" name="optionNumber" :required="true">
        <uni-easyinput type="number" v-model="state.formData.optionNumber" />
      </uni-forms-item>
      <uni-forms-item name="describes" label="备注">
        <uni-easyinput type="textarea" v-model="state.formData.describes" placeholder="请输入备注" />
      </uni-forms-item>
    </uni-forms>
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog ref="inputClose" mode="input" title="请输入正确库存量" value=""
        placeholder="请输入正确库存量" @confirm="dialogInputConfirm"></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import useOutInStore from '@/store/useOutInStore';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { computed, onBeforeUnmount, reactive, Ref, ref } from 'vue';
import { useOutIn } from '@/hooks/useOutIn';
import { storeToRefs } from 'pinia';
const _uo = useOutIn();
const _uos = useOutInStore();
const { selectDeviceData } = storeToRefs(_uos);

let existDev = ref(false);
let isScan = ref('');
const isExistDev = computed(() => {
  return !existDev.value;
});
const state = reactive({
  existDev: false,
  repairType: 'A4',
  repairTypeOpts: [
    { value: 'A4', text: '备品备件' },
    { value: 'A5', text: '物料' },
    { value: 'A6', text: '办公用品' }
  ],
  optionTypeList: [
    { value: 1, text: '入库' },
    { value: 2, text: '出库' }
  ],
  supplies: [] as any,
  suppliesDate: [] as any,
  formData: {
    materialId: '',
    describes: '',
    ...selectDeviceData.value,
  },
  rules: {
    materialId: {
      rules: [
        {
          required: true,
          errorMessage: '请选择物料名称',
        },
      ],
    },
    optionType: {
      rules: [
        {
          required: true,
          errorMessage: '请选择操作类型',
        },
      ],
    },
    optionNumber: {
      rules: [
        {
          required: true,
          errorMessage: '请输入出入库数量',
        },
      ],
    }
  },
});

const initData = () => {
  _uo.getMaterialList( state.repairType).then((res: any) => {
    state.supplies = []
    state.suppliesDate = res
    res.forEach((item: any) => {
      let obj = {
        text: item.materialName,
        value: item.materialId
      };
      state.supplies.push(obj)
    });
  });
};
const suppliesChange = (e: string) => {
  state.repairType = e
  initData();
}
const suppliesDev = (e: string) =>{
  state.suppliesDate.forEach((item: any) => {
    if (item.materialId == e ) {
      state.formData.stockNum = item.stockNum
    }
  });
}
onLoad((opts) => {
  isScan.value = opts.isScan!;
  initData();
});
onShow(() => {});
const alertDialog = ref<InstanceType<any>>();
const clickSubmit = () => {
  alertDialog.value.open();
};
const dialogInputConfirm = (val: string) => {
  _uo.checkStock({ materialId: state.formData.materialId, num: parseInt(val) }).then((res: any) => {
    alertDialog.value.close();
    state.formData.stockNum = val
  });
}
onBeforeUnmount(() => {
  if (isScan.value) {
    _uos.setData({
      key: 'selectDeviceData',
      value: {},
    });
  }
});
const formRef = ref<InstanceType<any>>(null);
defineExpose({
  formRef,
  state
});
</script>
<style scoped lang="scss">
::v-deep .uni-list-item__container {
  overflow: inherit;
}
::v-deep .uni-list-item__container {
  padding: 0;
}
</style>
