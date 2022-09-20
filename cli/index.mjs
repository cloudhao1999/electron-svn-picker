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

inquirer.prompt(promptList).then((answers) => {
    if (answers.projectName && answers.fullPath && answers.svnPath) {
        getSvnEditPath(answers.fullPath, answers.projectName, answers.svnPath);
    }
});
