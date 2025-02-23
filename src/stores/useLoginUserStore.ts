import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getLoginUserUsingGet} from "@/api/userController.ts";

export const useLoginUserStore = defineStore('loginUser', () => {
  //变量的初始值
  const loginUser = ref<API.LoginUserVO>({
    userName: '未登录',
  })

  //从后端接口获取登录的用户信息
  async function fetchLoginUser() {

    const res = await getLoginUserUsingGet();
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data;
    }
    // setTimeout(() => {
    //   loginUser.value = { userName: '测试用户', id: 1 }
    // }, 3000)
  }

  //改变变量的方法，接收外部传来的新值
  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }

  return { loginUser, setLoginUser, fetchLoginUser }
})
