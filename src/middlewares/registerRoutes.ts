/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2024-07-18 15:14:37
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-07-31 11:13:20
 * @FilePath: /wetalk_server/src/middlewares/registerRoutes.ts
 * @Description: Description
 */
import assert from 'assert';
import logger from '../../utils/logger';
import { getSocketIp } from '../../utils/socket';
import { Socket } from 'socket.io';

function defaultCallback() {
    logger.error('Server Error: emit event with callback');
}

export default function registerRoutes(socket: Socket, routes: Routes) {
    return async ([event, data, cb = defaultCallback]: MiddlewareArgs) => {
        const route = routes[event];
        if (route) {
            try {
                const ctx: Context<any> = {
                    data,
                    socket: {
                        id: socket.id,
                        ip: getSocketIp(socket),
                        get user() {
                            return socket.data.user;
                        },
                        set user(newUserId: string) {
                            socket.data.user = newUserId;
                        },
                        get isAdmin() {
                            return socket.data.isAdmin;
                        },
                        join: socket.join.bind(socket),
                        leave: socket.leave.bind(socket),
                        emit: (target, _event, _data) => {
                            socket.to(target).emit(_event, _data);
                        },
                    },
                };
                const before = Date.now();
                const res = await route(ctx);
                const after = Date.now();
                logger.info(
                    `[${event}]`,
                    after - before,
                    ctx.socket.id,
                    ctx.socket.user || 'null',
                    typeof res === 'string' ? res : 'null',
                );
                cb(res);
            } catch (err) {
                if (err instanceof assert.AssertionError) {
                    cb(err.message);
                } else {
                    logger.error(`[${event}]`, err.message);
                    cb(`Server Error: ${err.message}`);
                }
            }
        } else {
            cb(`Server Error: event [${event}] not exists`);
        }
    };
}
