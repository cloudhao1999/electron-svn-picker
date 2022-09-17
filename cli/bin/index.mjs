#! /usr/bin/env node
import e from "shelljs";
import s from "fs";
import t from "path";
import n from "inquirer";
function o(e, o, r, i) {
  const c = {
      A: "新增",
      C: "冲突",
      D: "删除",
      I: "忽略",
      M: "修改",
      R: "替换",
      X: "未纳入版本控制的目录,被外部引用的目录所创建",
      "!": "该项目已遗失(被非 svn 命令删除)或不完整",
      "~": "版本控制下的项目与其它类型的项目重名"
    },
    a = [{ type: "checkbox", name: "fileList", message: "请选择需要提交的项目", choices: e }];
  n.prompt(a).then((e) => {
    const n = {},
      a = {};
    e.fileList?.forEach((e) => {
      const s = c[e[0]],
        t = /\s/.test(s),
        o = e.indexOf(r),
        l = e.substring(o),
        p = e.substring(o).replace(r, i);
      !t && p && (n[s] ? (n[s].push(p), a[s].push(l)) : ((n[s] = [p]), (a[s] = [l])));
    }),
      ["", "undefined"].forEach((e) => delete a[e]),
      ["删除", "忽略", "", "undefined"].forEach((e) => delete a[e]);
    const l = JSON.stringify(n, null, 2).replace(/\\\\/g, "/").replace(/\\r/g, "");
    var p, f;
    (p = "record.json"),
      (f = l),
      s.writeFile(p, f, (e) => {
        if (e) throw e;
        console.log("The file has been saved!");
      }),
      (function (e, n, o, r) {
        e.forEach((e) => {
          const i = (e = e.split("\r")[0]).split(o),
            c = t.resolve(process.cwd(), n + r + i[1]);
          s.existsSync(e) &&
            s.cp(e, c, { recursive: !0 }, (s) => {
              console.log(s, e, c);
            });
        });
      })(
        (function (e) {
          const s = [];
          for (const t in e) s.push(...e[t]);
          return s;
        })(a),
        "./new/",
        o,
        i
      );
  });
}
console.log(
  (function () {
    const e = process.platform;
    return "darwin" === e ? "mac" : "win32" === e ? "windows" : void 0;
  })()
),
  n
    .prompt([
      { type: "input", message: "请输入项目名称:", name: "projectName" },
      { type: "input", message: "请输入项目本地路径:", name: "fullPath" },
      { type: "input", message: "请输入项目SVN路径:", name: "svnPath" }
    ])
    .then((s) => {
      console.log(s),
        s.projectName &&
          s.fullPath &&
          s.svnPath &&
          (function (s, t, n) {
            const r = e.exec(`svn status ${s}`, { silent: !0 }).stdout.split("\n");
            Array.isArray(r) && o(r, t, s, n);
          })(s.fullPath, s.projectName, s.svnPath);
    });
