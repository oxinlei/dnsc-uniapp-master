<template>
  <view class="content" :class="{ active: active }">
    <image
      class="logo"
      :class="{ active: active }"
      src="~@/static/imgs/A/dispatch-bg.png"
      mode="cover"
    ></image>
    <view class="tabbar-box-wrap">
      <view class="tabbar-box">
        <view class="tabbar-box-item" @click="clickScanCode">
          <image
            class="box-image"
            src="~@/static/imgs/A/icon-5.png"
            mode="aspectFit"
          ></image>
          <text class="explain">扫码登记</text>
        </view>
        <view
          class="tabbar-box-item"
          @click="goToPage('/pages/outIn/outInAdd?isScan=0')"
        >
          <image
            class="box-image"
            src="~@/static/imgs/A/icon-4.png"
            mode="aspectFit"
          ></image>
          <text class="explain">人工登记</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useScanCode } from '@/hooks/useScanCode';
import { onHide, onShow } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';
import { useOutIn } from '@/hooks/useOutIn';
import useOutInStore from '@/store/useOutInStore';
const _uo = useOutIn();
const _uos = useOutInStore();
const state = reactive({});
const active = ref(false);
onShow(() => {
  active.value = true;
});
onHide(() => {
  active.value = false;
});

const goToPage = (url: string) => {
  _uos.setData({ key: 'selectDeviceData', value: [] });
  uni.navigateTo({
    url,
  });
};
const clickScanCode = () => {
  useScanCode({
    onlyFromCamera: true,
    success: async (res: any) => {
      _uo.scanQrcode({ erData: res }).then((r: any) => {
        _uos.setData({ key: 'selectDeviceData', value: r.data });
        uni.navigateTo({
          url: `/pages/outIn/outInAdd?isScan=1`,
        });
      });
    },
    fail(e) {
      uni.showToast({
        icon: 'none',
        title: '扫码失败',
      });
    },
  });
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% + 20px);
  margin-left: -10px;
  margin-top: -10px;
  /* #ifdef H5 */
  height: calc(100vh - var(--window-bottom) - var(--window-top) - 10px);
  /* #endif */
  /* #ifndef H5 */
  height: calc(100vh - 10px);
  /* #endif */
  transition: opacity 0.3s;
  background: #999;
  opacity: 0;
  &.active {
    opacity: 1;
  }
  .logo {
    position: relative;
    margin-top: 0;
    width: 100%;
    height: calc(100% + 20px);
    // height: 200upx;
    // z-index: -1;
    opacity: 0;
    transition: opacity 0.3s;
    &.active {
      opacity: 1;
    }
  }
}
.tabbar-box-wrap {
  position: absolute;
  width: 100%;
  padding: 50upx;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  .tabbar-box {
    position: relative;
    display: flex;
    width: 100%;
    background: #fff;
    border-radius: 20upx;
    padding: 15upx 20upx;
    box-sizing: border-box;
    z-index: 2;
    box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.1);
    // &:after {
    //   content: "";
    //   position: absolute;
    //   bottom: -16upx;
    //   left: 0;
    //   right: 0;
    //   margin: auto;
    //   width: 50upx;
    //   height: 50upx;
    //   transform: rotate(45deg);
    //   background: #fff;
    //   z-index: 1;
    //   box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.1);
    //   border-radius: 2px;
    // }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 20upx;
      z-index: 2;
    }
    .tabbar-box-item {
      // position: relative;
      width: 100%;
      z-index: 3;
      margin: 10upx;
      color: $uni-color-subtitle;
      text-align: center;
      font-size: $uni-font-size-base;
      .box-image {
        width: 100%;
        height: $uni-img-size-lg;
      }
    }
  }
}
</style>
