import shell from "shelljs";
import { copyFile, writeFile } from "./file.mjs";
import { convertObjToArray } from "./transform.mjs";
import inquirer from "inquirer";

/**
 * @description 将svn提交记录拆分成键值对
 * @param {Array} record svn记录
 * @param {String} projectName 项目名称
 * @param {String} basePath 项目本地路径
 * @param {String} svnPath svn路径前缀
 */
function splitRecord(record, projectName, basePath, svnPath) {
  const statusType = {
    // " ": "无修改",
    A: "新增",
    C: "冲突",
    D: "删除",
    I: "忽略",
    M: "修改",
    R: "替换",
    X: "未纳入版本控制的目录,被外部引用的目录所创建",
    // "?": "未纳入版本控制",
    "!": "该项目已遗失(被非 svn 命令删除)或不完整",
    "~": "版本控制下的项目与其它类型的项目重名"
  };
  const choice = [
    {
      type: "checkbox",
      name: "fileList",
      message: "请选择需要提交的项目",
      choices: record
    }
  ];
  inquirer.prompt(choice).then((answers) => {
    const recordMap = {};
    const recordFileMap = {};
    answers.fileList?.forEach((item) => {
      const key = statusType[item[0]];
      const emptyKey = /\s/.test(key);
      const index = item.indexOf(basePath);
      const filePath = item.substring(index);
      const path = item.substring(index).replace(basePath, svnPath);
      if (!emptyKey && path) {
        if (recordMap[key]) {
          recordMap[key].push(path);
          recordFileMap[key].push(filePath);
        } else {
          recordMap[key] = [path];
          recordFileMap[key] = [filePath];
        }
      }
    });

    // 删除不需要输出的json输出
    ["", "undefined"].forEach((key) => delete recordFileMap[key]);
    // 删除不需要的拷贝的文件路径
    ["删除", "忽略", "", "undefined"].forEach((key) => delete recordFileMap[key]);

    // 生成修改新增记录到文件中
    const fileStr = JSON.stringify(recordMap, null, 2).replace(/\\\\/g, "/").replace(/\\r/g, "");
    writeFile("record.json", fileStr);
    // 复制文件到指定目录
    copyFile(convertObjToArray(recordFileMap), "./new/", projectName, svnPath);
  });
}

/**
 * @description 获取svn更新记录
 * @param {String} basePath 项目全路径
 * @param {String} projectName 项目名称
 * @param {String} svnPath SVN路径前缀
 */
export function getSvnEditPath(basePath, projectName, svnPath) {
  const result = shell.exec(`svn status ${basePath}`, { silent: true });
  const stdRecord = result.stdout.split("\n");
  if (Array.isArray(stdRecord)) {
    splitRecord(stdRecord, projectName, basePath, svnPath);
  }
}
