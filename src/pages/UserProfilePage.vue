<template>
  <div id="userProfilePage">
    <a-card title="个人中心" :bordered="false" style="max-width: 800px; margin: auto">
      <a-space direction="vertical" size="large" style="width: 100%">
        <!-- 用户头像 -->
        <div style="text-align: center">
          <a-upload
              :show-upload-list="false"
              :custom-request="handleAvatarUpload"
          >
            <a-avatar :src="userInfo?.userAvatar" size="large" style="cursor: pointer">
              <!-- 头像图标 -->
            </a-avatar>
            <div style="margin-top: 8px; color: #1677ff; cursor: pointer;">点击更换头像</div>
          </a-upload>
        </div>

        <!-- 用户基本信息 -->
        <a-descriptions bordered :column="1" size="middle">
          <a-descriptions-item label="用户ID">
            {{ userInfo.id }}
          </a-descriptions-item>
          <a-descriptions-item label="账号">
            {{ userInfo.userAccount }}
          </a-descriptions-item>
          <a-descriptions-item label="用户角色">
            {{ userInfo.userRole === 'admin' ? '管理员' : '普通用户' }}
          </a-descriptions-item>
          <!-- 用户昵称 -->
          <a-descriptions-item label="用户昵称">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span v-if="!isEditing.userName">{{ userInfo.userName }}</span>
              <div v-else>
                <a-input
                    v-model:value="userInfo.userName"
                    @blur="handleBlurUserName"
                />
              </div>
              <a-button
                  v-if="!isEditing.userName"
                  type="link"
                  @click="isEditing.userName = true"
                  style="margin-left: auto;"
              >
                修改
              </a-button>
            </div>
          </a-descriptions-item>
          <!-- 用户简介 -->
          <a-descriptions-item label="用户简介">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span v-if="!isEditing.userProfile">{{ userInfo.userProfile ? userInfo.userProfile : "暂无" }}</span>
              <div v-else>
                <a-textarea
                    v-model:value="userInfo.userProfile"
                    auto-size
                    @blur="handleBlurUserProfile"
                    placeholder="介绍一下你自己吧~"
                />
              </div>
              <a-button
                  v-if="!isEditing.userProfile"
                  type="link"
                  @click="isEditing.userProfile = true"
                  style="margin-left: auto;"
              >
                修改
              </a-button>
            </div>
          </a-descriptions-item>

          <a-descriptions-item label="注册时间">
            {{ dayjs(userInfo.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </a-descriptions-item>

        </a-descriptions>
        <a-descriptions-item>
          <p class="hint">注意：基本信息一个月内只能修改四次。</p>
        </a-descriptions-item>

        <!-- 修改密码 -->
        <a-button type="primary" @click="showPwdModal = true">修改密码</a-button>
      </a-space>
    </a-card>

    <!-- 修改密码弹窗 -->
    <a-modal
        v-model:open="showPwdModal"
        title="修改密码"
        ok-text="确认"
        cancel-text="取消"
        @ok="handleChangePassword"
    >
      <a-form :model="pwdForm">
        <a-form-item label="旧密码">
          <a-input-password v-model:value="pwdForm.oldPassword"/>
        </a-form-item>
        <a-form-item label="新密码">
          <a-input-password v-model:value="pwdForm.newPassword"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted, watch} from 'vue'
import dayjs from 'dayjs'
import {message} from 'ant-design-vue'
import {
  getUserVoByIdUsingGet,
  updateUserInfoUsingPost,
  uploadAvatarUsingPost,
  uploadPasswordUsingPost, userLogoutUsingPost
} from '@/api/userController.ts'
import {useLoginUserStore} from "@/stores/useLoginUserStore.ts";
import router from "@/router";


const props = defineProps<{
  userId: string
}>()
const userInfo = reactive({
  id: '',
  userAccount: '',
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
  createTime: '',
})

// 编辑状态控制
const isEditing = ref({
  userName: false,
  userProfile: false
})

//加载用户信息函数
const fetchUserInfo = async () => {
  const res = await getUserVoByIdUsingGet({id: props.userId})
  if (res.data.code === 0) {
    Object.assign(userInfo, res.data.data)
  } else {
    message.error('获取用户信息失败：' + res.data.message)
  }
}

onMounted(() => {
  fetchUserInfo()
})

watch(() => props.userId, fetchUserInfo)

const showPwdModal = ref(false)
const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
})
/**
 * 上传图片
 * @param file
 */
const handleAvatarUpload = async ({file}: any) => {
  // 确保调用时传递正确的参数
  const res = await uploadAvatarUsingPost({}, file)  // 传递空对象和文件

  if (res.data.code === 0 && res.data.data) {
    userInfo.userAvatar = res.data.data  // 更新头像
    message.success("上传成功")

  } else {
    message.error(res.data.message || '上传失败')  // 错误处理
  }
}

// 更新用户信息的请求函数
const updateUserInfo = async () => {
  const res = await updateUserInfoUsingPost(userInfo)
  if (res.data.code === 0) {
    message.success('信息更新成功！')
  } else {
    message.error('信息更新失败：' + res.data.message)
  }
}

// 用户昵称失去焦点时调用更新
const handleBlurUserName = () => {
  isEditing.value.userName = false
  updateUserInfo()
}

// 用户简介失去焦点时调用更新
const handleBlurUserProfile = () => {
  isEditing.value.userProfile = false
  updateUserInfo()
}

const handleChangePassword = async () => {
  if (!pwdForm.oldPassword || !pwdForm.newPassword) {
    message.error('请填写完整的密码信息');
    return;
  }
  const response = await uploadPasswordUsingPost({
    oldPassword: pwdForm.oldPassword,
    newPassword: pwdForm.newPassword
  });

  if (response.data.code === 0) {
    showPwdModal.value = false;
    logout();
    message.success('密码修改成功，请重新登陆');
  } else {
    message.error(response.data.message);
  }
};

//获取用户登录信息
const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()
const logout = async () => {
  const res = await userLogoutUsingPost();
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: "未登录"
    })
    // message.success("修改成功请重新登录")
    router.push({
      path: "/picture/login"
    })
  } else {
    message.error("退出登录失败" + res.data.message)
  }
}
</script>

<style scoped>
#userProfilePage {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
.hint {
  margin: 0px;
  padding: 0px;
  text-align: center;
  color: #8c8c8c; /* 浅灰色 */
}
</style>

