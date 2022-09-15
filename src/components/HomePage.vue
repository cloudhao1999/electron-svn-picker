<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ipcRenderer } from "electron";
import { openFile } from "../utils/file";
import { ElTable } from "element-plus";

const projectFileList = ref([]);
const jsonFile = ref("");
const multipleSelection = ref<string[]>([]);
const projectName = ref<string>("")
const svnPath = ref<string>("/web/")
const multipleTableRef = ref<InstanceType<typeof ElTable>>();

const handleSelectionChange = (val: string[]) => {
  multipleSelection.value = val;
};

const splitRecord = () => {
  ipcRenderer.send('split-record', {
    list: JSON.stringify(multipleSelection.value),
    projectName: projectName.value,
    svnPath: svnPath.value
  })
}

onMounted(() => {
  ipcRenderer.on("open-file-reply", (event, arg) => {
    console.log("recordList", arg);
    projectFileList.value = arg
      .map((file: string) => {
        return {
          path: file,
        };
      })
      .filter((file: { path: string }) => file.path !== "");
  });

  ipcRenderer.on('split-record-reply', (event, arg) => {
    jsonFile.value = arg
  })
});
</script>

<template>
  项目名称：<el-input v-model="projectName"></el-input>
  SVN路径：<el-input v-model="svnPath"></el-input>
  输出目录：<el-input type="textarea" :value="jsonFile"></el-input>
  <el-button type="primary" @click="openFile">选择项目</el-button>
  <el-table
    ref="multipleTableRef"
    :data="projectFileList"
    height="400px"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column property="path" label="路径" />
  </el-table>
  <el-button type="primary" @click="splitRecord">提取选中文件</el-button>
</template>

<style scoped></style>
