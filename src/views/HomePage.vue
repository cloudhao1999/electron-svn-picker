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
  TableRefs
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
const tableRef=ref<TableRefs>();
const isCopyAdd=ref<Boolean>(false);
const isCopyMod=ref<Boolean>(false);
const isCopyDel=ref<Boolean>(false);
const store = new Store();
const formData = ref({
  projectName: "",
  svnPath: "",
});
const active = ref(0);
const rules = reactive<FormRules>({
  projectName: [
    { required: true, message: "项目名称不能为空", trigger: "blur" },
  ],
  svnPath: [{ required: true, message: "SVN路径不能为空", trigger: "blur" }],
});

const nextStep = async() => {
  if (active.value===0){
    await ruleFormRef.value?.validate((valid) => {
      if (valid) active.value++
    })
  } 
};

function handleCopy(t:number) {debugger;
  if(jsonFile.value==""){
    ElMessage({
        message: "请先提取选中目录！",
        type: "warning",
    });
    return;
  }
  let str="";
  try {
    const fileStr=JSON.parse(jsonFile.value);
    console.log(fileStr);
    if (t===0) {
      fileStr['修改'].map((s:string)=>{
        str+=s+'\n'
      })
    }else if (t===1) {
      fileStr['新增'].map((s:string)=>{
        str+=s+'\n'
      })
    }else if (t===2) {
      fileStr['删除'].map((s:string)=>{
        str+=s+'\n'
      })
    } 
    const input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value=str;
    input.select();
    document.execCommand('copy');//执行复制事件
    ElMessage({
          message: "已复制",
          type: "success",
      });
    document.body.removeChild(input);
  } catch (error) {
    console.log(error);
    
  }

}; 
function handleRow(row:{ path: string }) {
  tableRef.value?.toggleRowSelection(row);
}
function clear() {
  tableRef.value?.clearSelection();
  jsonFile.value="";
}
const handleSelectionChange = (val: {path: string}[]) => {
  multipleSelection.value = val;
};

const generateNewFold = () => {
  remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result: any) => {
    const filePath = result.filePaths[0]
    copyFile(store, convertObjToArray(globalRecordFileMap.value), basePath.value, filePath, "./new/", formData.value.svnPath)
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
      .filter((file: { path: string }) => file.path !== "" && /^[A-Z] /.test(file.path));
    })
    
  }).catch((e:any)=>{})
}

const handleSplitRecord = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  return await formEl.validate((valid, fields) => {
    if (valid) {debugger;
      const { fileStr, recordFileMap } = splitRecord(multipleSelection.value, formData.value.svnPath)
      globalRecordFileMap.value = recordFileMap
      jsonFile.value = fileStr;
      generateDisabled.value = true;
      try {
        const fileStrObj=JSON.parse(fileStr);
        isCopyMod.value=fileStrObj["修改"] && fileStrObj["修改"].length>0;
        isCopyAdd.value=fileStrObj["新增"] && fileStrObj["新增"].length>0;
        isCopyDel.value=fileStrObj["删除"] && fileStrObj["删除"].length>0;
      }catch(e){}
    }
  });
};

const getRecord = () => {
  const record = store.get("record");
  try {
    let argList = JSON.parse(record);
    if (Array.isArray(argList)) {
      projectNameList.value = argList.map((item: any) => item.projectName);
      svnPathList.value = argList.map((item: any) => item.svnPath);
    }
  } catch (error) {
    console.log(error);
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
    class="mt-9 mb-9"
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
    <!-- <el-form-item>
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
    </el-form-item> -->
  </el-form>
  <div class="mb-5">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="选择项目" />
      <el-step title="提取选中文件" />
      <el-step title="生成new文件夹" />
    </el-steps>
  </div>
 
  <div v-if="active===0" >
    <div class="step-btn">
        <el-button type="primary" @click="openFile">选择项目</el-button>
        <el-button :disabled="projectFileList.length===0" @click="nextStep">下一步</el-button>
    </div>
    <div style="textAlign:center;margin-top: 100px;">
      本地项目地址：{{basePath}}
    </div>
    
  </div>

  <div style="padding: 0 25px" v-if="active===1">
     <div class="step-btn">
      <el-button-group>
        <el-button @click="active--">上一步</el-button>
        <el-button @click="active++">下一步</el-button>
      </el-button-group>
    </div>
    <el-table  ref="tableRef" :data="projectFileList" @selection-change="handleSelectionChange" @row-click="handleRow">
      <el-table-column type="selection" width="55" />
      <el-table-column property="path" label="路径" />
    </el-table>
    <div class="mt-5 mb-5">
      <el-button type="primary" @click="handleSplitRecord(ruleFormRef)" :disabled=" multipleSelection.length===0" >提取目录</el-button>
      <el-button-group class="ml-3 mr-3" type="primary" >
        <el-button plain @click="handleCopy(0)" :disabled="multipleSelection.length===0 || !isCopyMod">复制修改路径</el-button>
        <el-button plain @click="handleCopy(1)" :disabled="multipleSelection.length===0 || !isCopyAdd">复制新增路径</el-button>
        <el-button plain @click="handleCopy(2)" :disabled="multipleSelection.length===0 || !isCopyDel">复制删除路径</el-button>
      </el-button-group>
      <el-button @click="clear" :disabled="multipleSelection.length===0">一键清空</el-button>
    </div>
    <el-form>
      <el-form-item label="输出目录">
        <el-input type="textarea" rows="8" v-model="jsonFile"></el-input>
      </el-form-item>
    </el-form>
  </div>

  <div v-if="active===2" class="step-btn">
    <el-button type="primary" @click="generateNewFold">生成new文件</el-button>
    <el-button @click="active--">返回上一步</el-button>
  </div>
</template>

<style scoped>
  .step-btn{
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
</style>
