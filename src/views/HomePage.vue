<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ipcRenderer } from "electron";
import { copyFile } from "../utils/file";
import {
  ElTable,
  FormInstance,
  FormRules,
  ElMessage,
  ElSelect,
  ElOption,
} from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import { getSvnEditPath, splitRecord } from "@/utils/core";
import { convertObjToArray } from "@/utils/transform";

const projectFileList = ref<{ path: string }[]>([]);
const jsonFile = ref<string>("");
const basePath = ref<string>("")
const generateDisabled = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>();
const projectNameList = ref<string[]>([]);
const svnPathList = ref<string[]>([]);
const multipleSelection = ref<{path: string}[]>([]);
const globalRecordFileMap = ref({});
const Store = window.require("electron-store");
const remote = window.require('@electron/remote')

const store = new Store();
const formData = ref({
  projectName: "",
  svnPath: "",
});
const rules = reactive<FormRules>({
  projectName: [
    { required: true, message: "项目名称不能为空", trigger: "blur" },
  ],
  svnPath: [{ required: true, message: "SVN路径不能为空", trigger: "blur" }],
});

const handleSelectionChange = (val: {path: string}[]) => {
  multipleSelection.value = val;
};

const generateNewFold = () => {
  remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result: any) => {
    const filePath = result.filePaths[0]
    copyFile(store, convertObjToArray(globalRecordFileMap.value), basePath.value, filePath, "./new/", filePath)
    ElMessage({
        message: "文件生成成功！",
        type: "success",
      });
  })
};

const openFile = () => {
  remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result: any) => {
    basePath.value = result.filePaths[0]
    getSvnEditPath(basePath.value, (recordList: any) => {
      projectFileList.value = recordList
      .map((file: string) => {
        return {
          path: file,
        };
      })
      .filter((file: { path: string }) => file.path !== "");
    })
    
  })
}

const handleSplitRecord = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { fileStr, recordFileMap } = splitRecord(multipleSelection.value, formData.value.svnPath)
      globalRecordFileMap.value = recordFileMap
      jsonFile.value = fileStr;
      generateDisabled.value = true;
    }
  });
};

const getRecord = () => {
  const record = store.get("record");
  let argList = JSON.parse(record);
  if (Array.isArray(argList)) {
    projectNameList.value = argList.map((item: any) => item.projectName);
    svnPathList.value = argList.map((item: any) => item.svnPath);
  }
};

onMounted(() => {
  getRecord()

  ipcRenderer.on("open-file-reply", (event, arg) => {
    basePath.value = arg.filePath
    projectFileList.value = arg.recordList
      .map((file: string) => {
        return {
          path: file,
        };
      })
      .filter((file: { path: string }) => file.path !== "");
  });
});
</script>

<template>
  <el-form
    class="mt-9"
    ref="ruleFormRef"
    :inline="true"
    :rules="rules"
    :model="formData"
  >
    <el-form-item prop="projectName">
      <template #label>
        <div class="flex items-center">
          <span>项目名称</span>
          <el-tooltip
            effect="dark"
            content="本机项目的名称，不是服务器上的"
            placement="top"
          >
            <el-icon>
              <QuestionFilled color="#409eff" />
            </el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-select v-model="formData.projectName" placeholder="请选择项目名称">
        <el-option
          v-for="item in projectNameList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="svnPath">
      <template #label>
        <div class="flex items-center">
          <span>SVN路径</span>
          <el-tooltip
            effect="dark"
            content="服务器上的项目根路径，例如/web/front-analy-web/"
            placement="top"
          >
            <el-icon>
              <QuestionFilled color="#409eff" />
            </el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-select v-model="formData.svnPath" placeholder="请选择SVN路径">
        <el-option
          v-for="item in svnPathList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="openFile">1.选择项目</el-button>
      <el-button
        :disabled="multipleSelection.length === 0"
        type="primary"
        @click="handleSplitRecord(ruleFormRef)"
        >2.提取选中文件</el-button
      >
      <el-button
        :disabled="multipleSelection.length === 0 || !generateDisabled"
        type="primary"
        @click="generateNewFold"
        >3.生成new文件夹</el-button
      >
    </el-form-item>
  </el-form>
  <div style="padding: 0 25px">
    <el-form>
      <el-form-item label="输出目录">
        <el-input type="textarea" rows="8" v-model="jsonFile"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="projectFileList" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column property="path" label="路径" />
  </el-table>
</template>

<style scoped></style>
