/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2023-10-09 22:57:19
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-07-31 11:02:21
 * @FilePath: /wetalk_server/test/middlewares/seal.spec.ts
 * @Description: Description
 */
import { mocked } from 'ts-jest/utils';
import { SEAL_TEXT } from '../../utils/const';
import { Socket } from 'socket.io';
import { Redis } from '../../database/redis/initRedis';
import seal from '../../src/middlewares/seal';
import { getMiddlewareParams } from '../helpers/middleware';

jest.mock('../../database/redis/initRedis');

describe('server/middlewares/seal', () => {
    it('should call service success', async () => {
        const socket = ({
            id: 'id',
            data: {
                user: 'user',
            },
            handshake: {
                headers: {
                    'x-real-ip': '127.0.0.1',
                },
            },
        } as unknown) as Socket;
        const middleware = seal(socket);

        const { args, next } = getMiddlewareParams();

        await middleware(args, next);
        expect(next).toBeCalled();
    });

    it('should call service fail when user has been sealed', async () => {
        mocked(Redis.has).mockReturnValue(Promise.resolve(true));
        const socket = ({
            id: 'id',
            data: {
                user: 'user',
            },
            handshake: {
                headers: {
                    'x-real-ip': '127.0.0.1',
                },
            },
        } as unknown) as Socket;
        const middleware = seal(socket);

        const { args, cb, next } = getMiddlewareParams();

        await middleware(args, next);
        expect(cb).toBeCalledWith(SEAL_TEXT);
    });
});
