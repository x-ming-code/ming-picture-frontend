<!-- components/SlideVerify.vue -->
<template>
  <a-modal
      v-model:visible="visible"
      title="安全验证"
      :footer="null"
      :closable="false"
      :maskClosable="false"
      width="400px"
  >
    <slide-verify
        ref="slider"
        :accuracy="3"
        slider-text="向右滑动完成验证"
        @success="onVerifySuccess"
        @fail="onVerifyFail"
    ></slide-verify>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue';
import SlideVerify from 'vue3-slide-verify';

const visible = ref(false);
const slider = ref(null);

const show = () => {
  visible.value = true;
  slider.value?.reset();
};

const emit = defineEmits(['success', 'fail']);

const onVerifySuccess = (data) => {
  emit('success', data);
  visible.value = false;
};

const onVerifyFail = () => {
  emit('fail');
  slider.value?.reset();
};

defineExpose({ show });
</script>
