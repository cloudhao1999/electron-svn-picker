const path = window.require('path')
const { exec } = window.require('child_process')
const fixPath = window.require('fix-path')

/**
 * @description 获取svn更新记录
 * @param {String} basePath 项目全路径
 * @param {String} projectName 项目名称
 * @param {String} svnPath SVN路径前缀
 */
export function getSvnEditPath(basePath: string, callBack?: any) {
  // 修复 Mac OS上的环境变量异常
  fixPath()
  const workerProcess = exec(`svn status .`, { cwd: path.resolve(basePath, './') })
  let datas = ''
  workerProcess.stderr.on('data', function(data: any) {
    callBack(data)
  });
  workerProcess.stdout.on('data', function(data: any) {
    datas += data
    callBack(datas.split('\n'))
  });
}

/**
 * @description 将svn提交记录拆分成键值对
 * @param {Array} selectRecords svn记录
 * @param {String} projectName 项目名称
 * @param {String} basePath 项目本地路径
 * @param {String} svnPath svn路径前缀
 */
 export function splitRecord(selectRecords: Array<{ path: string }>, svnPath?: string) {
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
    } as any;
  
    const recordMap: any = {};
    const recordFileMap: any = {};
    selectRecords.forEach((item) => {
      const key = statusType[item.path[0]];
      const emptyKey = /\s/.test(key);
      // 正则匹配中间带空格的文件
      const filePath = item.path.replace(/\s+/, '$').split('$')[1];
      const jsonPath = path.join(svnPath, filePath)
      if (!emptyKey && jsonPath) {
        if (recordMap[key]) {
          recordMap[key].push(jsonPath);
          recordFileMap[key].push(filePath);
        } else {
          recordMap[key] = [jsonPath];
          recordFileMap[key] = [filePath];
        }
      }
    });
  
    // 删除不需要输出的json输出
    ["", "undefined"].forEach((key) => delete recordFileMap[key]);
    // 删除不需要的拷贝的文件路径
    ["忽略", "", "undefined"].forEach((key) => delete recordFileMap[key]);
  
    // 生成修改新增记录到文件中
    const fileStr = JSON.stringify(recordMap, null, 2).replace(/\\\\/g, "/").replace(/\\r/g, "");
    return {
      fileStr,
      recordFileMap
    };
  }
