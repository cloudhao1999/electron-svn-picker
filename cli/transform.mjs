/**
 * @description 将对象转换为路径数组
 * @param {*} obj 变更对象
 * @returns 路径数组
 */
export function convertObjToArray(obj) {
  const arr = [];
  for (const key in obj) {
    arr.push(...obj[key]);
  }
  return arr;
}
