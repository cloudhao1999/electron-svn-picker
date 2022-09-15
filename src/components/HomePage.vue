<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ipcRenderer } from "electron";
import { openFile } from "../utils/file";
import { ElTable, FormInstance, FormRules, ElMessage } from "element-plus";

const projectFileList = ref([]);
const jsonFile = ref("");
const ruleFormRef = ref<FormInstance>();
const multipleSelection = ref<string[]>([]);
const formData = ref({
  projectName: "front-analy-web",
  svnPath: "/web/",
});
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const rules = reactive<FormRules>({
  projectName: [
    { required: true, message: "项目名称不能为空", trigger: "blur" },
  ],
  svnPath: [{ required: true, message: "SVN路径不能为空", trigger: "blur" }],
});

const handleSelectionChange = (val: string[]) => {
  multipleSelection.value = val;
};

const generateNewFold = () => {
  ipcRenderer.send("gen-fold", {
    jsonFile: jsonFile.value,
    svnPath: formData.value.svnPath,
  });
};

const splitRecord = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      ipcRenderer.send("split-record", {
        list: JSON.stringify(multipleSelection.value),
        projectName: formData.value.projectName,
        svnPath: formData.value.svnPath,
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

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

  ipcRenderer.on("split-record-reply", (event, arg) => {
    jsonFile.value = arg;
  });

  ipcRenderer.on("gen-fold-reply", (event, arg) => {
    if (arg.success) {
      ElMessage({
        message: '文件生成成功！',
        type: 'success',
      })
    }
  });

  ipcRenderer.on("gen-fold-err", (event, arg) => {
    console.log('arg',arg)
  });
});
</script>

<template>
  <el-form ref="ruleFormRef" :inline="true" :rules="rules" :model="formData">
    <el-form-item label="项目名称" prop="projectName">
      <el-input v-model="formData.projectName" placeholder="请输入项目名称" />
    </el-form-item>
    <el-form-item label="SVN路径" prop="svnPath">
      <el-input v-model="formData.svnPath" placeholder="请输入SVN路径" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="openFile">1.选择项目</el-button>
      <el-button
        :disabled="multipleSelection.length === 0"
        type="primary"
        @click="splitRecord(ruleFormRef)"
        >2.提取选中文件</el-button
      >
      <el-button
        :disabled="multipleSelection.length === 0"
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
  <el-table
    ref="multipleTableRef"
    :data="projectFileList"
    height="400px"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column property="path" label="路径" />
  </el-table>
</template>

<style scoped></style>
