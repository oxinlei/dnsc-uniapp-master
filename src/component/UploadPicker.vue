<template>
  <view class="wrap">
    <view class="title bb-1 bt-1">
      <uni-section type="line" :title="title"></uni-section>
    </view>
    <view class="content">
      <view v-if="isUpload" class="item">
        <view class="add" @click="selectImg">
          <uni-icons type="plusempty" size="100" color="#f2f2f2" />
        </view>
        <view
          v-for="(img, index) in _uu.state.imgs"
          :key="index"
          class="list"
          @click="clickEnlargeImg(img.path)"
        >
          <view @click.stop="delImg(index)" class="del">
            <uni-icons type="close" size="30" color="red" />
          </view>
          <image :src="img.path" class="img" />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useUpload } from "@/hooks/useUpload";
const _uu = useUpload();

const props = defineProps({
  title: {
    type: String,
    default: "图片上传",
  },
  border: {
    type: Boolean,
    default: true,
  },
  isUpload: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["change"]);
const delImg = (index: number) => {
  _uu.delteImg(index);
  emit("change", _uu.state.imgs);
};
const selectImg = () => {
  uni.chooseImage({
    // count: 6, //默认9
    // sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
    sizeType: ["original"],
    // sourceType: ["album"], //从相册选择
    success: function (res: any) {
      _uu.addImg(res.tempFiles);
      emit("change", _uu.state.imgs);
      // _uu.upload();
    },
  });
};
const clickEnlargeImg = (src: string) => {
  uni.previewImage({
    current: 0,
    urls: [src],
  });
};
</script>
<style scoped lang="scss">
.wrap {
}
.content {
  padding: 10px;
}
.item {
  display: flex;
  flex-wrap: wrap;
  .add,
  .list {
    margin-left: 2%;
    border: 1px solid $uni-border-color;
    width: 30%;
    height: 100px;
    overflow: hidden;
    position: relative;
    margin-bottom: 10px;
  }

  .list {
    .img {
      width: 100%;
      height: 100px;
    }
    .del {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 9;
    }
  }
}
.title {
}
</style>
