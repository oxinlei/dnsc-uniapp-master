<template>
  <view class="box" :class="isBorder ? 'bb-1' : ''">
    <text class="t1">{{ title }}</text>
    <slot name="content">
      <text class="t1 t2">{{ content }}</text>
    </slot>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string | number;
  content: any;
  isBorder?: boolean;
}>();
</script>
<style scoped lang="scss">
.box {
  display: flex;
  justify-content: space-between;
  padding: 12px 10px;
  align-items: center;
}
.t1 {
  font-size: 14px;
  color: rgb(51, 51, 51);
  margin-right: 10px;
  min-width: 60px;
  min-height: 35px;
  display: flex;
  align-items: center;
}
.t2 {
  font-size: 14px;
  color: rgb(51, 51, 51, 0.7);
  flex: 1;
  display: flex;
  justify-content: flex-end;
  overflow: auto;
  word-break: break-all;
}
</style>
