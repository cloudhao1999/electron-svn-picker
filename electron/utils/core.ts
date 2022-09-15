import cmd from 'node-cmd'

/**
 * @description 获取svn更新记录
 * @param {String} basePath 项目全路径
 * @param {String} projectName 项目名称
 * @param {String} svnPath SVN路径前缀
 */
export function getSvnEditPath(basePath: string) {
  const result = cmd.runSync(`svn status ${basePath}`)
  const stdRecord = result.data.split("\n");
  return stdRecord;
}

/**
 * @description 将svn提交记录拆分成键值对
 * @param {Array} selectRecords svn记录
 * @param {String} projectName 项目名称
 * @param {String} basePath 项目本地路径
 * @param {String} svnPath svn路径前缀
 */
export function splitRecord(selectRecords: Array<{ path: string }>, projectName?: string, basePath?: string, svnPath?: string) {
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

  const recordMap = {};
  const recordFileMap = {};
  selectRecords.forEach((item) => {
    const key = statusType[item.path[0]];
    const emptyKey = /\s/.test(key);
    const index = item.path.indexOf(basePath);
    const filePath = item.path.substring(index);
    const path = item.path.substring(index).replace(basePath, svnPath);
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
  return {
    fileStr,
    recordFileMap
  };
}