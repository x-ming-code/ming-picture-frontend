<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo"/>
            <div class="title">智能云图库</div>
          </div>
        </RouterLink>
      </a-col>

      <!--      给菜单绑定点击事件 实现页面跳转 -->
      <a-col flex="auto">
        <a-menu
            v-model:selectedKeys="current"
            mode="horizontal"
            :items="items"
            @click="doMenuClick"
        />
      </a-col>
      <a-col flex="120px">
        <div class="picture-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-space style="display: flex; flex-wrap: wrap">
              <a-dropdown :placement="'bottom'" :arrow="{ pointAtCenter: true }">
                <ASpace>
                  <a-avatar :src="loginUserStore.loginUser.userAvatar"/>
                  {{ loginUserStore.loginUser.userName ?? '无名' }}
                </ASpace>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="userProfile">
                      <router-link :to="`/userProfile/${loginUserStore.loginUser.id}`">
                        <UserOutlined/>
                        个人信息
                      </router-link>
                    </a-menu-item>

                    <a-menu-item>
                      <router-link to="/my_space">
                        <UserOutlined/>
                        我的空间
                      </router-link>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;" @click="logout">
                        <LogoutOutlined/>
                        退出登录</a>
                    </a-menu-item>

                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </div>
          <div v-else>
            <a-button type="primary" href="/picture/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import {computed, h, ref} from 'vue'
import {HomeOutlined, LogoutOutlined, UserOutlined} from '@ant-design/icons-vue'
import {MenuProps, message} from 'ant-design-vue'
import {useRouter} from 'vue-router'
import {useLoginUserStore} from '@/stores/useLoginUserStore.ts'
import {userLogoutUsingPost} from "@/api/userController.ts";
import UserFeedback from "@/pages/UserFeedback.vue";

//获取用户登录信息
const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()

const router = useRouter()
// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

//退出登录
const logout = async () => {
  const res = await userLogoutUsingPost();
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: "未登录"
    })
    message.success("退出登录成功")
    router.push({
      path: "/picture/login"
    })
  } else {
    message.error("退出登录失败" + res.data.message)
  }
}

// 路由跳转事件
const doMenuClick = ({key}: { key: string }) => {
  router.push({
    path: key,
  })
}

const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/add_picture',
    label: '创建图片',
    title: '创建图片',
  },
  {
    key: '/userFeedback',
    label: '建议反馈',
  },
  {
    key: '/admin/pictureManage',
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/admin/spaceManage',
    label: '空间管理',
    title: '空间管理',
  },


  // {
  //   key: 'others',
  //   label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
  //   title: '编程导航',
  // },
]

// 过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    if (menu.key.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== "admin") {
        return false
      }
    }
    return true
  })
}

// 展示在菜单的路由数组
const items = computed<MenuProps['items']>(() => filterMenus(originItems))
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 40px;
}
</style>
