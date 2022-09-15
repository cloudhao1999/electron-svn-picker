import fs from "fs";
import path from "path";

/**
 * @description 复制文件到指定目录
 * @param {*} source 源文件路径数组
 * @param {*} currentPath 存储文件的目录
 * @param {*} basePath 生成文件的目录
 * @param {*} projectName 项目名称
 * @param {*} svnPath svn路径
 */
export function copyFile(source: string[], basePath: string, currentPath:string, prefix: string, projectName: string, svnPath: string, callBackErr: any) {
  source.forEach((item) => {
    item = item.split("\r")[0];
    // 正则匹配中间带空格的文件
    const dest = path.resolve(currentPath, prefix + svnPath + item);
    let from = path.join(basePath, item);
    if (fs.existsSync(from)) {
      fs.cp(from, dest, { recursive: true }, (err) => {
        callBackErr(err, from, dest);
      });
    }
  });
}

/**
 * @description 写入文件
 * @param {String} filename 文件名称
 * @param {String} content 文件内容
 */
export function writeFile(filename, content) {
  fs.writeFile(filename, content, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}
