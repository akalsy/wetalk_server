/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2023-10-09 22:57:19
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-07-31 10:42:57
 * @FilePath: /wetalk_server/src/main.ts
 * @Description: Description
 */
import config from '../config/server';
import getRandomAvatar from '../utils/getRandomAvatar';
import { doctor } from '../bin/scripts/doctor';
import logger from '../utils/logger';
import initMongoDB from '../database/mongoose/initMongoDB';
import Socket from '../database/mongoose/models/socket';
import Group, { GroupDocument } from '../database/mongoose/models/group';
import app from './app';

(async () => {
    if (process.argv.find((argv) => argv === '--doctor')) {
        await doctor();
    }

    await initMongoDB();

    // 判断默认群是否存在, 不存在就创建一个
    const group = await Group.findOne({ isDefault: true });
    if (!group) {
        const defaultGroup = await Group.create({
            name: 'fiora',
            avatar: getRandomAvatar(),
            isDefault: true,
        } as GroupDocument);

        if (!defaultGroup) {
            logger.error('[defaultGroup]', 'create default group fail');
            return process.exit(1);
        }
    }

    app.listen(config.port, async () => {
        await Socket.deleteMany({}); // 删除Socket表所有历史数据
        logger.info(`>>> server listen on http://localhost:${config.port}`);
    });

    return null;
})();
