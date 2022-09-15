import shell from "shelljs";

/**
 * @description 获取svn更新记录
 * @param {String} basePath 项目全路径
 * @param {String} projectName 项目名称
 * @param {String} svnPath SVN路径前缀
 */
 export function getSvnEditPath(basePath: string, projectName?: string, svnPath?: string): any[] {
    shell.config.execPath = (shell.which('node').toString());
    const result = shell.exec(`svn status ${basePath}`, { silent: true });
    const stdRecord = result.stdout.split("\n");
    return stdRecord;
  }