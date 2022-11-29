<template>
  <view class="container pb-50">
    <view class="wrap-box">
      <uni-forms
        class="p-10"
        ref="formRef"
        :modelValue="state.formData"
        :rules="state.rules"
        label-width="100px"
        border
      >
        <uni-forms-item label="当前登录密码" name="oldPassWord">
          <uni-easyinput
            type="text"
            v-model="state.formData.oldPassWord"
            placeholder="请输入当前登录密码"
          />
        </uni-forms-item>
        <uni-forms-item label="新的登录密码" name="newPassWord">
          <uni-easyinput
            required
            type="text"
            v-model="state.formData.newPassWord"
            placeholder="请输入新密码"
          />
        </uni-forms-item>
      </uni-forms>
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
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { usePersonnel } from '@/hooks/usePersonnel';
import { useUserStore } from '@/store/useUserStore';
const state = reactive({
  formData: {
    oldPassWord: '',
    newPassWord: '',
  },
  rules: {
    oldPassWord: {
      rules: [
        {
          required: true,
          errorMessage: '请输入当前登录密码',
        },
      ],
    },
    newPassWord: {
      rules: [
        {
          required: true,
          errorMessage: '请输入新的登录密码',
        },
      ],
    },
  },
});

const _up = usePersonnel();
const _uss = useUserStore();

const formRef = ref() as any;
const clickSubmit = () => {
  formRef.value.validate().then(() => {
    const params = {
      ...state.formData,
      userId: _uss.data.userId,
    };
    _up.editUserPassWord(params).then(() => {
      uni.navigateBack();
    });
  });
};
</script>
<style scoped lang="scss"></style>
