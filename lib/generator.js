import ora from "ora";
import path from "path";
import chalk from "chalk";
import downloadGitRepo from "download-git-repo"; // 不支持 Promise
import inquirer from "inquirer";
import { TEMPLATES } from "../enums.js"

export default class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
  }

  // 选择模版
  async chooseTemplate() {
    // 获取模版名
    const templateList = Object.keys(TEMPLATES)

    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: templateList,
      message: 'Please choose a template to create project'
    })

    return repo;
  }

  // 下载远程模板
  download(template) {
    const spinner = ora("waiting download template"); // 加载提示信息
    spinner.start(); // 加载动画

    return new Promise((resolve, reject) => {
      const requestUrl = TEMPLATES[template];

      const traget = path.resolve(process.cwd(), this.targetDir) // 创建位置
      downloadGitRepo(requestUrl, traget, function (error) {
        if (error) {
          spinner.fail("Error: Request failed, refetch ...");
          reject();
        } else {
          spinner.succeed();
          resolve();
        }
      });
    });
  }

  // 核心创建逻辑
  async create() {
    const repo = await this.chooseTemplate()

    this.download(repo).then(() => {
      console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
      console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
    });
  }
}
