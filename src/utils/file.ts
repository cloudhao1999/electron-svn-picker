const path = window.require('path')
const fs = window.require('fs')

/**
 * @description 复制文件到指定目录
 * @param {*} source 源文件路径数组
 * @param {*} cwdPath 你本机项目所在目录
 * @param {*} newPath 存储new文件的目录
 * @param {*} prefix 项目前缀
 * @param {*} svnPath svn路径
 * @param {*} callBackErr 回调函数
 */
 export function copyFile(store: any, source: string[], cwdPath: string, newPath:string, prefix: string, svnPath: string, callBackErr?: any) {
    source.forEach((item) => {
      item = item.split("\r")[0];
      const options = store.get('options') as string;
      const { fileMinimum } = JSON.parse(options)
      debugger
      if (fileMinimum) {
        const svnPathArr = svnPath.split("/")
        svnPath = '/' + svnPathArr[svnPathArr.length - 2] + '/'
      }
      const dest = path.resolve(newPath, prefix + svnPath + item);
      let from = path.join(cwdPath,'./', item);
      if (fs.existsSync(from)) {
        fs.cp(from, dest, { recursive: true }, (err: any) => {});
      }
    });
  }