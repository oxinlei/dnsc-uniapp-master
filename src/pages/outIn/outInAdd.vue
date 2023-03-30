<template>
  <view class="container pb-50">
    <view class="wrap-box">
      <OutInAddItem ref="addItemRef" />
    </view>

    <view class="flex-footer">
      <uni-row class="demo-uni-row">
        <uni-col :span="24">
          <view class="demo-uni-col dark">
            <van-button type="primary" size="large" @click="clickSubmit">提交</van-button>
          </view>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>

<script setup lang="ts">
import useOutInStore from '@/store/useOutInStore';
import { ref } from 'vue';
import OutInAddItem from './cmp/outInAddItem.vue';
import { useOutIn } from '@/hooks/useOutIn';
import { useUpload } from '@/hooks/useUpload';
const _uos = useOutInStore();
const _uo = useOutIn();
const { selectDeviceData } = _uos;
const _uu = useUpload();

const addItemRef = ref<InstanceType<typeof OutInAddItem>>();
const returnUserId = (arr: any) => {
  return arr.map((o) => o.userId);
};
const clickSubmit = () => {
  addItemRef.value?.formRef
    .validate()
    .then(() => {
      const { state } = addItemRef.value!;
      let p: any = {
        materialId: state.formData.materialId,
        describes: state.formData.describes,
        optionType: state.formData.optionType,
        optionNumber: state.formData.optionNumber
      };
      _uo.addStock(p).then((res: any) => {
        uni.navigateBack();
      });
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped></style>
