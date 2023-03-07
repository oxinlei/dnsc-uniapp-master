<template>
  <uni-segmented-control
    :current="titleIndex"
    :values="titleData"
    @clickItem="onClickItem"
  />
  <view class="content">
    <slot name="content"></slot>
  </view>
</template>

<script setup lang="ts">
import { reactive, inject } from "vue";

const prpos = defineProps({
  titleIndex: Number,
});

const emit = defineEmits(["change"]);

const titleData = inject("titleData");
// const titleIndex = inject("titleIndex");

const onClickItem = ({ currentIndex }: { currentIndex: number }) => {
  emit("change", currentIndex);
};
</script>

<style scoped lang="scss">
.item {
  border-bottom: 1px solid $uni-border-color;
}
</style>
