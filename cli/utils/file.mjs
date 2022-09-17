import fs from "fs";
import path from "path";

/**
 * @description 复制文件到指定目录
 * @param {*} source 源文件路径数组
 * @param {*} basePath 生成文件的目录
 * @param {*} projectName 项目名称
 */
export function copyFile(source, basePath, projectName, svnPath) {
  source.forEach((item) => {
    item = item.split("\r")[0];
    const lastIndex = item.split(projectName);
    const dest = path.resolve(process.cwd(), basePath + svnPath + lastIndex[1]);
    if (fs.existsSync(item)) {
      fs.cp(item, dest, { recursive: true }, (err) => {
        console.log(err, item, dest);
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
