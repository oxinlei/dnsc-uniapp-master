<template>
  <view class="container">
    <image class="logo" src="~@/static/LB2.jpg" />
    <view class="wrap-box">
      <uni-forms ref="fromRef" :rules="formRules" :modelValue="formData">
        <uni-forms-item label="账号:" name="userName">
          <uni-easyinput v-model="formData.userName" placeholder="请输入账号" />
        </uni-forms-item>
        <uni-forms-item label="密码:" name="userPwd">
          <uni-easyinput
            v-model="formData.userPwd"
            type="password"
            placeholder="请输入密码"
          />
        </uni-forms-item>
      </uni-forms>
      <van-button type="primary" size="large" @click="handerLogin()">提交</van-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Ref, ref, reactive } from 'vue';
import { useLoginForm } from '@/hooks/useLogin';

const { submit } = useLoginForm();

const formData = reactive({
  userName: '',
  userPwd: '',
  code: null,
});
const formRules = reactive({
  userName: {
    rules: [
      {
        required: true,
        errorMessage: '账号不能为空',
      },
    ],
  },
  userPwd: {
    rules: [
      {
        required: true,
        errorMessage: '密码不能为空',
      },
    ],
  },
});

const fromRef = ref<InstanceType<any>>();
const handerLogin = () => {
  submit(fromRef, formData);
};
</script>

<style lang="scss">
page {
  min-height: 100%;
  width: 100%;
  padding: 0;
  box-sizing: content-box;
  background-color: $uni-bg-color;
}

.logo {
  margin-bottom: 10px;
  width: 100%;
}

.wrap-box {
  width: calc(100% - 30px);
  margin: 0 auto;
}
</style>
