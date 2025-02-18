<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header>Header</a-layout-header>
      <a-layout-content>Content</a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://www.ming-code.work" target="_blank">
         XXXXXXXXXXXXX
        </a>
      </a-layout-footer>

    </a-layout>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#basicLayout {
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

</style>
