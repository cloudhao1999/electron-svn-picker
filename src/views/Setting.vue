<script setup lang="ts">
import { ipcRenderer } from "electron";
import { FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { QuestionFilled } from "@element-plus/icons-vue";

const ruleFormRef = ref<FormInstance>();
const formData = ref({
  projectName: "",
  svnPath: "",
});
const recordList = ref<any[]>([]);
const rules = reactive<FormRules>({
  projectName: [
    { required: true, message: "项目名称不能为空", trigger: "blur" },
  ],
  svnPath: [{ required: true, message: "SVN路径不能为空", trigger: "blur" }],
});
const saveRecord = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      recordList.value.push(formData.value);
      ipcRenderer.send("save-record", JSON.stringify(recordList.value));
    } else {
      console.log("error submit!", fields);
    }
  });
};
function deleteRecord(record: any) {
  recordList.value = recordList.value.filter((item) => item !== record);
  ipcRenderer.send("save-record", JSON.stringify(recordList.value));
}

onMounted(() => {
  ipcRenderer.send("get-record");

  ipcRenderer.on("save-record-reply", (event, arg) => {
    ipcRenderer.send("get-record");
  });

  ipcRenderer.on("get-record-reply", (event, arg) => {
    let argList = JSON.parse(arg);
    if (Array.isArray(argList)) {
      recordList.value = argList;
    } else {
      recordList.value = [];
    }
  });
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
          <el-button type="primary" @click="saveRecord(ruleFormRef)">保存记录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="recordList" height="400px">
        <el-table-column property="projectName" label="项目名称" />
        <el-table-column property="svnPath" label="SVN路径" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button type="danger" size="small" @click="deleteRecord(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped></style>
