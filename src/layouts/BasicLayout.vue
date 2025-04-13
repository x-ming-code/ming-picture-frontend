<!--全局通用布局-->
<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader/>
      </a-layout-header>
      <a-layout>
        <GlobalSider class="sider"/>
        <a-layout-content class="content">
          <router-view/>
        </a-layout-content>
      </a-layout>

      <a-layout-footer class="footer">

        <a href='https://beian.miit.gov.cn/' target="_blank">
          备案号：豫ICP备2023021013号
        </a>
        <p class="disclaimer">
<!--          网站声明：本站所有壁纸资源仅供学习与参考，禁止商用，壁纸资源来源于网络和壁纸投稿，图片版权归原创作者所有，禁止用于商业用途，若有侵权问题敬请告知我们，我们会尽快处理。-->
          网站声明：本站图片资源均来源于网络，版权归属原作者。仅提供个人非商业使用，严禁二次商用或非法传播。若涉及侵权，敬请告知我们删除。网站不对图片合法性负责，使用风险由用户自行承担。访问即视为同意本声明。
        </p>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from "@/components/GlobalSider.vue";
</script>

<style scoped>
#basicLayout {
}
.footer {
  text-align: center;
  padding: 20px 0;
}

.disclaimer {
  margin-top:5px ;
  margin-bottom:-2px ;
  color: #8c8c8c; /* 浅灰色 */
  font-size: 10px;
}

a {
  color: #1890ff; /* 蓝色链接 */
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
#basicLayout .header {
  padding-inline: 20px;
  color: unset;
  background: white;
  margin-bottom: 1px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 30px;
  padding: 28px;
}


#basicLayout .sider {
  background: #fff;
  padding-top: 20px;
  border-right: 0.5px solid #eee;
}

#basicLayout :deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}


</style>
