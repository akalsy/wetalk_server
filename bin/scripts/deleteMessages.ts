/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2024-07-18 15:14:29
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-07-31 10:46:53
 * @FilePath: /wetalk_server/bin/scripts/deleteMessages.ts
 * @Description: Description
 */
import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import { promisify } from 'util';
import chalk from 'chalk';
import initMongoDB from '../../database/mongoose/initMongoDB';
import Message from '../../database/mongoose/models/message';
import History from '../../database/mongoose/models/history';

export async function deleteMessages() {
    const shouldDeleteAllMessages = await inquirer.prompt({
        type: 'confirm',
        name: 'result',
        message: 'Confirm to delete all messages?',
    });
    if (!shouldDeleteAllMessages.result) {
        return;
    }

    await initMongoDB();

    const deleteResult = await Message.deleteMany({});
    console.log('Delete result:', deleteResult);

    const deleteHistoryResult = await History.deleteMany({});
    console.log('Delete history result:', deleteHistoryResult);

    const shouldDeleteAllFiles = await inquirer.prompt({
        type: 'confirm',
        name: 'result',
        message: 'Confirm to delete all message files(Except OSS files)?',
    });
    if (!shouldDeleteAllFiles.result) {
        return;
    }

    const files = await promisify(fs.readdir)(
        path.resolve(__dirname, '../../server/public/'),
    );
    const iamgesAndFiles = files.filter(
        (filename) =>
            filename.startsWith('ImageMessage_') ||
            filename.startsWith('FileMessage_'),
    );
    const unlinkAsync = promisify(fs.unlink);
    await Promise.all(
        iamgesAndFiles.map((file) =>
            unlinkAsync(path.resolve(__dirname, '../../server/public/', file)),
        ),
    );
    console.log('Delete files:', chalk.green(iamgesAndFiles.length.toString()));
    console.log(chalk.red(iamgesAndFiles.join('\n')));

    console.log(chalk.green('Successfully deleted all messages'));
}

async function run() {
    await deleteMessages();
    process.exit(0);
}
export default run;
