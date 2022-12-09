<script setup lang="ts">
import { onLaunch, onShow, onHide, onLoad } from '@dcloudio/uni-app';
import { useHome } from '@/hooks/useHome';
import useHomeStore from '@/store/useHomeStore';

const _uh = useHome();
const _uhs = useHomeStore();

onLaunch(() => {});

uni.onTabBarMidButtonTap(() => {
  uni.navigateTo({
    url: '/pages/dispatch/dispatch',
  });
});
</script>
<style lang="scss">
@import '/src/static/font/iconfont.css';
@import '/src/static/css/public.css';

page {
  min-height: calc(100% - 20px);
  width: calc(100% - 20px);
  padding: 10px;
  box-sizing: content-box;
  background-color: $uni-bg-color-grey;
}
.uni-collapse,
.uni-list,
.uni-list-item,
.uni-collapse-item__title-box,
.uni-section {
  background-color: rgba($color: #fff, $alpha: 0) !important;
}

.uni-list-item__container {
  padding: 12px 10px !important;
}
.uni-list-item__content-title {
  min-height: 35px;
  line-height: 35px;
}
.uni-collapse-item__title-box {
  padding: 0 10px !important;
}
// .uni-tabbar .uni-tabbar__item:nth-child(4) .uni-tabbar__icon {
//   top: -18px;
//   left: -8px;
// }
.uni-forms-item__label {
  height: auto !important;
  min-height: 36px;
}
</style>
