<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ipcRenderer } from "electron";
import {openFile} from "../utils/file";
import { ElTable } from "element-plus";

const projectFileList = ref([]);
const multipleSelection = ref<string[]>([]);
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

  const handleSelectionChange = (val: string[]) => {
  multipleSelection.value = val
}

onMounted(() => {
  ipcRenderer.on("open-file-reply", (event, arg) => {
    console.log("recordList", arg);
    projectFileList.value = arg.map((file: string) => {
      return {
        path: file
      }
    }).filter((file: {path: string}) => file.path !== '');
  });
});

</script>

<template>
  <el-button type="primary" @click="openFile">选择项目</el-button>
  <el-table
    ref="multipleTableRef"
    :data="projectFileList"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column property="path" label="路径" />
  </el-table>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
