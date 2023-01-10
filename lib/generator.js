import ora from "ora";
import path from "path";
import chalk from "chalk";
import downloadGitRepo from "download-git-repo"; // 不支持 Promise

export default class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
  }

  // 下载远程模板
  download() {
    const spinner = ora("waiting download template"); // 加载提示信息
    spinner.start(); // 加载动画

    return new Promise((resolve, reject) => {
      const requestUrl = `AnterWang/peace-template-vue3-vite-ts`;
      console.log(requestUrl);

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
    this.download().then(() => {
      console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
      console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
    });
  }
}
