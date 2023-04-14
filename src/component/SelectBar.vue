<template>
  <view class="wrap">
    <uni-search-bar
      v-model="searchValue"
      placeholder="搜索栏"
      @confirm="search"
      clearButton="none"
      @cancel="cancel"
    />
  </view>
</template>

<script lang="ts" setup>
import { inject, reactive, ref } from "vue";

const emit = defineEmits(["change"]);
const searchValue = ref("");

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
});

const search = () => {
  if (searchValue.value.replace(/\s+/g, "") === "") {
    emit("change", undefined);
    return;
  }
  const d = props.data.filter((item: any) => {
    return item[props.field].includes(searchValue.value);
  });
  emit("change", d);
};
const cancel = () => {
  searchValue.value = "";
  emit("change", undefined);
};
</script>
<style scoped lang="scss">
::v-deep .uni-searchbar{
  padding-left: 0;
  padding-right: 0;
}
</style>
