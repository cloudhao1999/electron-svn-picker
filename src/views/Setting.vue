<script setup lang="ts">
import { ipcRenderer } from "electron";
import { FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { QuestionFilled } from "@element-plus/icons-vue";

type formDataType = {
  projectName: string;
  svnPath: string;
};


const ruleFormRef = ref<FormInstance>();
const theme = ref("light");
const Store = window.require("electron-store");
const store = new Store();
const formData = ref<formDataType>({
  projectName: "",
  svnPath: "",
});
const recordList = ref<formDataType[]>([]);
const rules = reactive<FormRules>({
  projectName: [
    { required: true, message: "项目名称不能为空", trigger: "blur" },
  ],
  svnPath: [{ required: true, message: "SVN路径不能为空", trigger: "blur" }],
});

const handleSaveRecord = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const index = recordList.value.findIndex((item: formDataType) => {
        return (
          item.projectName == formData.value.projectName.trim() &&
          item.svnPath == formData.value.svnPath.trim()
        );
      });
      if (index < 0) recordList.value.push(formData.value);
      try {
        saveRecord(JSON.stringify(recordList.value));
        getRecord();
      } catch (error) {}
    }
  });
};

function saveRecord(record: string) {
  store.set("record", record);
}

function saveOptions(options: string) {
  store.set("options", options);
}

const toggleDark = (themeStr: string) => {
  store.set("theme", themeStr);
  getTheme();
};

function deleteRecord(record: any) {
  recordList.value = recordList.value.filter((item) => item !== record);
  try {
    saveRecord(JSON.stringify(recordList.value));
    getRecord();
  } catch (error) {}
}

function getRecord() {
  const record = store.get("record");
  try {
    let argList = JSON.parse(record);
    if (Array.isArray(argList)) {
      recordList.value = argList;
    } else {
      recordList.value = [];
    }
  } catch (error) {}
}

function getTheme() {
  const themeStr = store.get("theme");
  theme.value = themeStr || "light";
  ipcRenderer.send("theme-change", theme.value);
}

onMounted(() => {
  getRecord();
  getTheme();
});
</script>

<template>
  <div>
    <p class="text-xl font-bold mt-5">设置</p>
    <div>
      <el-form
        class="mt-9"
        ref="ruleFormRef"
        :inline="true"
        :rules="rules"
        :model="formData"
      >
        <el-form-item prop="darkMode" label="主题">
          <el-select
            :model-value="theme"
            @change="toggleDark"
            placeholder="请选择"
          >
            <el-option label="浅色" value="light"></el-option>
            <el-option label="深色" value="dark"></el-option>
            <el-option label="跟随系统" value="auto"></el-option>
          </el-select>
        </el-form-item>
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
          <el-input
            v-model="formData.projectName"
            placeholder="请输入项目名称"
          />
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
          <el-input v-model="formData.svnPath" placeholder="请输入SVN路径" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveRecord(ruleFormRef)"
            >保存记录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="recordList">
        <el-table-column property="projectName" label="项目名称" />
        <el-table-column property="svnPath" label="SVN路径" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              @click="deleteRecord(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped></style>
