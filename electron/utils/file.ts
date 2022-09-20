import fs from "fs";
import path from "path";
import { store } from "../main";

/**
 * @description 复制文件到指定目录
 * @param {*} source 源文件路径数组
 * @param {*} cwdPath 你本机项目所在目录
 * @param {*} newPath 存储new文件的目录
 * @param {*} prefix 项目前缀
 * @param {*} svnPath svn路径
 * @param {*} callBackErr 回调函数
 */
export function copyFile(source: string[], cwdPath: string, newPath:string, prefix: string, svnPath: string, callBackErr?: any) {
  source.forEach((item) => {
    item = item.split("\r")[0];
    const options = store.get('options') as string;
    const { fileMinimum } = JSON.parse(options)
    if (fileMinimum) {
      const svnPathArr = svnPath.split("/")
      svnPath = '/' + svnPathArr[svnPathArr.length - 2] + '/'
    }
    const dest = path.resolve(newPath, prefix + svnPath + item);
    let from = path.join(cwdPath,'./', item);
    if (fs.existsSync(from)) {
      fs.cp(from, dest, { recursive: true }, (err) => {});
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
  });
}
