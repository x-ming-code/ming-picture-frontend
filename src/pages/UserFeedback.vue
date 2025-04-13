<template>
  <a-card title="意见反馈" :bordered="false" class="feedback-form" align="middle">
    <a-form :model="formData" @finish="handleSubmit">
      <!-- 反馈类型（单选模式） -->
      <a-form-item
        label="反馈类型"
        name="feedbackType"
        :rules="[{ required: true, message: '请选择反馈类型' }]"
      >
        <a-radio-group
          v-model:value="formData.feedbackType"
          class="radio-group"
        >
          <a-radio value="0">使用体验</a-radio>
          <a-radio value="1">功能建议</a-radio>
          <a-radio value="2">BUG错误</a-radio>
          <a-radio value="3">其他</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 反馈内容 -->
      <a-form-item
        label="反馈内容"
        name="content"
        :rules="[{ required: true, message: '请填写反馈内容' }]"
      >
        <a-textarea
          v-model:value="formData.content"
          placeholder="请详细描述您的问题或建议..."
          :rows="4"
          show-count
          :maxlength="500"
          class="full-width-input"
        />
      </a-form-item>

      <!-- 联系方式 -->
      <a-form-item
        label="联系方式"
        name="qq"
        :rules="[
    { required: true, message: '请填写QQ号码' },
    {
      pattern: /^[1-9]\d{4,10}$/,
      message: '请输入5-11位数字且不以0开头的QQ号码'
    }
  ]"
      >
        <a-input
          v-model:value="formData.qq"
          placeholder="请输入QQ号码"
          class="full-width-input"
          @input="handleQQInput"
        >
          <template #prefix>
            <span style="color: #1890ff">QQ</span>
          </template>
        </a-input>
      </a-form-item>

      <!-- 提交按钮 -->
      <a-form-item>
        <a-row justify="center">
          <a-col>
            <a-button
              type="primary"
              html-type="submit"
              :loading="submitting"
            >
              提交反馈
            </a-button>
          </a-col>
        </a-row>
      </a-form-item>

      <!-- 反馈提示 -->
      <div class="tips">
        <p>反馈提示：</p>
        <ul>
          <li>请尽量详细描述问题，包括操作步骤和预期结果</li>
          <li>如果是功能建议，请说明您的使用场景</li>
        </ul>
      </div>
    </a-form>
  </a-card>
</template>

<script setup>
import {ref} from 'vue';
import {message} from 'ant-design-vue';
import {userFeedbackUsingPost} from "@/api/userController.js";

// const formData = ref<API.UserFeedbackRequest>({
//   feedbackType: 0, // 改为单选类型
//   content: '',
//   qq: ''
// })
const handleQQInput = (e) => {
  // 过滤非数字字符
  formData.value.qq = e.target.value.replace(/[^\d]/g, '');

  // 自动去除前导0（可选）
  if (formData.value.qq.startsWith('0')) {
    formData.value.qq = formData.value.qq.replace(/^0+/, '');
  }
};
const formData = ref({
  feedbackType: 0, // 改为单选类型
  content: '',
  qq: ''
});

const submitting = ref(false);

const handleSubmit = async () => {
  try {
    submitting.value = true;
    console.log(formData.value)
    const res = await userFeedbackUsingPost(formData.value);
    if (res.data.code===0){
      message.success('反馈提交成功！');
      formData.value = {feedbackType: 0, content: '', qq: ''};
    }else {
      message.error('反馈失败，' + res.data.message)
    }

  } catch (error) {
    message.error('提交失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.feedback-form {
  max-width: 800px;
  margin: 20px auto;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
  0 6px 16px 0 rgba(0, 0, 0, 0.08),
  0 9px 28px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px; /* 可选圆角 */
  transition: box-shadow 0.3s; /* 添加过渡效果 */
}

/* 如果需要悬停效果 */
.feedback-form:hover {
  box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08),
  0 9px 28px 0 rgba(0, 0, 0, 0.05),
  0 12px 48px 16px rgba(0, 0, 0, 0.03);
}

/* 水平排列单选框 */
.radio-group {
  display: flex;
  gap: 30px; /* 控制选项间距 */
}

/* 统一输入框宽度 */
:deep(.full-width-input) {
  width: 100%;
}

/* 调整Ant Design默认样式 */
:deep(.ant-input-affix-wrapper) {
  width: 100%;
}

.tips {
  margin-top: 24px;
  color: #666;
  font-size: 12px;
  background-color: #f8f8f8;
  padding-bottom: 10px;
  padding-top: 10px;
}

.tips ul {
  padding-left: 20px;
  margin: 8px 0;
}

.tips li {
  line-height: 2.3;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .radio-group {
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style>
