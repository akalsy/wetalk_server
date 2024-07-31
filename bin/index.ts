/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2023-10-09 22:57:19
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-07-31 10:50:06
 * @FilePath: /wetalk_server/bin/index.ts
 * @Description: Description
 */
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

const script = process.argv[2];
if (!script) {
    console.log(chalk.green('没有任何事发生~'));
    process.exit(0);
}

const file = path.resolve(__dirname, `scripts/${script}.ts`);
if (!fs.existsSync(file)) {
    console.log(chalk.red(`[${script}] 脚本不存在`));
}

// @ts-ignore
import(file).then((module) => {
    module.default();
});
