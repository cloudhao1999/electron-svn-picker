/**
 * @description 获取平台信息
 * @returns 平台信息
 */
export function getPlatform() {
  const platform = process.platform;
  if (platform === "darwin") {
    return "mac";
  } else if (platform === "win32") {
    return "windows";
  }
}
