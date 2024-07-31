/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2023-10-09 22:57:19
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-07-31 11:09:47
 * @FilePath: /wetalk_server/test/middlewares/isAdmin.spec.ts
 * @Description: Description
 */
import { mocked } from 'ts-jest/utils';
import config from '../../config/server';
import { Socket } from 'socket.io';
import isAdmin, {
    YOU_ARE_NOT_ADMINISTRATOR,
} from '../../src/middlewares/isAdmin';
import { getMiddlewareParams } from '../helpers/middleware';

jest.mock('../../config/server');

describe('server/middlewares/isAdmin', () => {
    it('should call service fail when user not administrator', async () => {
        const socket = {
            id: 'id',
            data: {
                user: 'user',
            },
        } as Socket;
        const middleware = isAdmin(socket);

        const { args, cb, next } = getMiddlewareParams('sealUser');

        await middleware(args, next);
        expect(cb).toBeCalledWith(YOU_ARE_NOT_ADMINISTRATOR);
    });

    it('should call service success when user is administrator', async () => {
        mocked(config).administrator = ['administrator'];
        const socket = {
            id: 'id',
            data: {
                user: 'administrator',
            },
        } as Socket;
        const middleware = isAdmin(socket);

        const { args, next } = getMiddlewareParams('sealUser');

        await middleware(args, next);
        expect(next).toBeCalled();
    });
});
