<template>
  <view class="header">
    <uni-icons type="person-filled" size="80" color="#fff"></uni-icons>
    <text class="name">{{ state.data.realName }}</text>
  </view>
  <view class="wrap-box mt-10">
    <uni-list>
      <uni-list-item title="用户账号" :rightText="state.data.userName" />
      <uni-list-item title="部门" :rightText="state.data.departmentName" />
      <uni-list-item title="职位" :rightText="state.data.positionName" />
      <uni-list-item
        title="修改密码"
        showArrow
        :clickable="true"
        @click="clickGoPassword"
      />
      <uni-list-item
        showArrow
        title="退出登录"
        :clickable="true"
        @click="showDialog"
      />
    </uni-list>
  </view>

  <uni-popup ref="alertDialog" type="dialog">
    <uni-popup-dialog
      type="error"
      cancelText="取消"
      confirmText="确定"
      title="是否退出登录"
      @confirm="outLogin"
      @close="hideDialog"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script setup lang="ts">
import useHomeStore from '@/store/useHomeStore';
import { useUserStore } from '@/store/useUserStore';
import { reactive, Ref, ref } from 'vue';
const _uus = useUserStore();
const _uhs = useHomeStore();

const state = reactive({
  data: _uus.data as any,
});
const alertDialog = ref<InstanceType<any>>();
const showDialog = () => {
  alertDialog.value.open();
};
const hideDialog = () => {
  alertDialog.value.open();
};
const outLogin = () => {
  _uhs.setData({ key: 'tabIndex', value: 0 })
  uni.reLaunch({
    url: '/pages/login/login',
  });
};

const clickGoPassword = () => {
  uni.navigateTo({
    url: '/pages/mine/password',
  });
};
</script>

<style lang="scss">
.header {
  background-color: #2196f3;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  display: flex;
  width: calc(100% + 20px);
  margin-left: -10px;
  margin-top: -10px;
  padding: 30px;
  .name {
    font-size: 22px;
    font-weight: bold;
    color: #fff;
  }
}
</style>
