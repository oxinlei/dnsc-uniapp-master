<template>
  <uni-section class="bb-1 bt-1" type="line" :title="title" />
  <uni-file-picker v-model="data" readonly></uni-file-picker>
  <view v-if="!data.length || data[0]==''" class="no-img bb-1">
    <text>无上传图片</text>
  </view>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
const state = reactive({});

const props = defineProps({
  title: {
    type: String,
    default: "图片",
  },
  data: {
    type: Array,
    default: [],
  },
});
</script>
<style scoped lang="scss">
::v-deep .uni-file-picker__container {
  padding: 5px 12px;
}
.no-img {
  padding: 10px;
  font-size: 14px;
  color: rgba(51, 51, 51, 0.7);
}
</style>
