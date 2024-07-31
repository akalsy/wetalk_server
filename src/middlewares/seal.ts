/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2023-10-09 22:57:19
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-07-31 11:01:41
 * @FilePath: /wetalk_server/src/middlewares/seal.ts
 * @Description: Description
 */
import { SEAL_TEXT } from '../../utils/const';
import { getSocketIp } from '../../utils/socket';
import { Socket } from 'socket.io';
import {
    getSealIpKey,
    getSealUserKey,
    Redis,
} from '../../database/redis/initRedis';

/**
 * 拦截被封禁用户的请求
 */
export default function seal(socket: Socket) {
    return async ([, , cb]: MiddlewareArgs, next: MiddlewareNext) => {
        const ip = getSocketIp(socket);
        const isSealIp = await Redis.has(getSealIpKey(ip));
        const isSealUser =
            socket.data.user &&
            (await Redis.has(getSealUserKey(socket.data.user)));

        if (isSealUser || isSealIp) {
            cb(SEAL_TEXT);
        } else {
            next();
        }
    };
}
