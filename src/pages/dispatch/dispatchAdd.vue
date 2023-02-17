<template>
  <view class="container pb-50">
    <view class="wrap-box">
      <DispatchAddItem :is-edit="true" ref="addItemRef" />
      <!-- <UploadPicker />
      <ViewImage :data="state.imgs" /> -->
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
import useInspectionStore from '@/store/useInspectionStore';
import { onHide, onLoad, onShow } from '@dcloudio/uni-app';
import { reactive, ref, onBeforeUnmount, Ref } from 'vue';
import DispatchAddItem from './cmp/DispatchAddItem.vue';
import { IRepairPrams, useDispatch } from '@/hooks/useDispatch';
import { useUpload } from '@/hooks/useUpload';
const _uis = useInspectionStore();
const _ud = useDispatch();
const { selectDeviceData } = _uis;
const _uu = useUpload();
const state = reactive({});

const addItemRef = ref<InstanceType<typeof DispatchAddItem>>();
const returnUserId = (arr: any) => {
  return arr.map((o) => o.userId);
};
const clickSubmit = () => {
  addItemRef.value?.formRef
    .validate()
    .then(() => {
      const { state } = addItemRef.value!;
      let p: IRepairPrams = {
        orderImg: '',
        describe: state.formData.describe,
        orderName: state.formData.orderName,
        isSmsRemind: 0,
        noticeUids: returnUserId(state.noticeUids).toString(),
      };

      if (state.existDev) {
        p.deviceId = state.formData.deviceId;
        // 设备派单
        if (state.formData.repairType === 0) {
          // -- 正常维修
          _uu.upload(addItemRef.value?.uploadImgs).then((imgs: any) => {
            // p.examineUids = returnUserId(state.examineUids).toString();
            p.examineUids = state.formData.examineUids.toString();
            p.orderImg = imgs.url.toString();
            _ud.creatDevRepair(p).then(() => {
              uni.navigateBack();
            });
          });
        } else if (state.formData.repairType === 1) {
          // -- 简单维修
          _uu.upload(addItemRef.value?.uploadImgs).then((imgs: any) => {
            p.orderImg = imgs.url.toString();
            // p.planUids = returnUserId(state.formData.planUids).toString();
            p.planUids = state.formData.planUids.toString();
            _ud.creatSimpleDevRepair(p).then(() => {
              uni.navigateBack();
            });
          });
        }
      } else {
        // 非设备派单
        p.positionId = state.formData.positionId;
        p.orderName = p.orderName + '-人工'
        if (state.formData.repairType === 0) {
          // -- 正常维修
          _uu.upload(addItemRef.value?.uploadImgs).then((imgs: any) => {
            // p.examineUids = returnUserId(state.examineUids).toString();
            p.examineUids = state.formData.examineUids.toString();
            p.orderImg = imgs.url.toString();
            _ud.creatAboutRepair(p).then(() => {
              uni.navigateBack();
            });
          });
        } else if (state.formData.repairType === 1) {
          // -- 简单维修
          _uu.upload(addItemRef.value?.uploadImgs).then((imgs: any) => {
            p.orderImg = imgs.url.toString();
            // p.planUids = returnUserId(state.formData.planUids).toString();
            p.planUids = state.formData.planUids.toString();
            _ud.creatSimpleAboutRepair(p).then(() => {
              uni.navigateBack();
            });
          });
        }
      }
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped></style>
