<script lang="ts" setup>
import { ElMenu } from "element-plus";
import { Menu, Tools, InfoFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
function selectMenu(index: string) {
  router.push({
    name: index,
  });
}
</script>

<template>
  <el-aside width="80px" class="border-r">
    <div class="mt-8">
      <el-menu @select="selectMenu" :collapse="true" :default-active="'Dashboard'">
        <el-menu-item index="Dashboard">
          <el-icon style="width: 100%"><Menu /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="Setting">
          <el-icon style="width: 100%"><Tools /></el-icon>
          <template #title>设置</template>
        </el-menu-item>
        <el-menu-item index="About">
          <el-icon style="width: 100%"><InfoFilled /></el-icon>
          <template #title>关于</template>
        </el-menu-item>
      </el-menu>
    </div>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-menu--collapse {
  width: 100%;
}
.el-menu {
  border: none;
}
</style>
