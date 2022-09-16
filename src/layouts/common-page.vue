<script lang="ts" setup>
import PageView from "./pages/index.vue";
import Menu from "./default/menu/index.vue";
</script>
<template>
  <el-container class="h-screen w-full font-sans">
    <Menu />
    <el-container direction="vertical">
      <PageView />
    </el-container>
  </el-container>
</template>

<style scoped></style>
