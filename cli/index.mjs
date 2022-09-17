import { getSvnEditPath } from "./utils/core.mjs";
import { getPlatform } from "./utils/platform.mjs";
import inquirer from "inquirer";

const promptList = [{
        type: "input",
        message: "请输入项目名称:",
        name: "projectName"
    },
    {
        type: "input",
        message: "请输入项目本地路径:",
        name: "fullPath"
    },
    {
        type: "input",
        message: "请输入项目SVN路径:",
        name: "svnPath"
    }
];

console.log(getPlatform());
inquirer.prompt(promptList).then((answers) => {
    console.log(answers); // 返回的结果
    if (answers.projectName && answers.fullPath && answers.svnPath) {
        getSvnEditPath(answers.fullPath, answers.projectName, answers.svnPath);
    }
});
// getSvnEditPath("E:\\vueProj\\ruleProj2022", "ruleProj2022", "rule/unified-rule-platform/rule-mng-web");
