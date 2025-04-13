<!--
<template>
  <div id="userLoginPage">
    <h2 class="title">智能云图库 - 用户登录</h2>
    <div class="desc">企业级智能协同素材库</div>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit">
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item
          name="userPassword"
          :rules="[
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码不能小于 8 位' },
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
      </a-form-item>
      <div class="tips">
        没有账号？
        <RouterLink to="/picture/register">去注册</RouterLink>
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import {reactive} from "vue";
import {useRouter} from "vue-router";
import {useLoginUserStore} from "@/stores/useLoginUserStore.ts";
import {userLoginUsingPost} from "@/api/userController.ts";
import {message} from "ant-design-vue";

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const router = useRouter() //实现路由跳转
const loginUserStore = useLoginUserStore() //用于存储用户登录汰

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost(values)
  // 登录成功，把登录态保存到全局状态中
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    router.push({
      path: '/',
      replace: true,
    })
  } else {
    message.error('登录失败，' + res.data.message)
  }
}



</script>

<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 16px;
}

.tips {
  margin-bottom: 16px;
  color: #bbb;
  font-size: 13px;
  text-align: right;
}

</style>
-->

<template>
  <div id="userLoginPage">
    <h2 class="title">智能云图库 - 用户登录</h2>
    <div class="desc">企业级智能协同素材库</div>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit">
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号"/>
      </a-form-item>

      <a-form-item
          name="userPassword"
          :rules="[
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码不能小于 8 位' }
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码"/>
      </a-form-item>

      <a-form-item name="captchaCode" :rules="[{ required: true, message: '请输入验证码' }]">
        <div style="display: flex; gap: 10px; align-items: center">
          <a-input
              v-model:value="formState.captchaCode"
              placeholder="验证码"
              style="flex: 1"
          />
          <img
              :src="captchaImg"
              alt="验证码"
              style="height: 38px; cursor: pointer"
              @click="loadCaptcha"
          />
        </div>
      </a-form-item>

      <div class="tips">
        没有账号？
        <RouterLink to="/picture/register">去注册</RouterLink>
      </div>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useLoginUserStore} from '@/stores/useLoginUserStore';
import {getCaptchaUsingGet, userLoginUsingPost} from '@/api/userController';
import {message} from 'ant-design-vue';

const router = useRouter();
const loginUserStore = useLoginUserStore();

const formState = reactive({
  userAccount: '',
  userPassword: '',
  captchaCode: '',
  captchaKey: '', // 存储后端返回的验证码 ID
});

const captchaImg = ref('');

// 加载验证码图片
const loadCaptcha = async () => {
  const res = await getCaptchaUsingGet(); // 调用接口获取 base64 图片和 uuid
  if (res.data.code === 0) {
    captchaImg.value = res.data.data.img;
    console.log( captchaImg.value)
    formState.captchaKey = res.data.data.captchaKey;

  } else {
    message.error('获取验证码失败');
  }
};
// 提交表单
const handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost({
    ...values,
    captchaKey: formState.captchaKey,
  });

  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser();
    message.success('登录成功');
    router.push({path: '/', replace: true});
  } else {
    message.error('登录失败，' + res.data.message);
    loadCaptcha(); // 登录失败时刷新验证码
  }
};

onMounted(() => {
  loadCaptcha(); // 页面加载时初始化验证码
});
</script>

<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 16px;
}

.tips {
  margin-bottom: 16px;
  color: #bbb;
  font-size: 13px;
  text-align: right;
}
</style>


