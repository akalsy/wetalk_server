/*
 * @Author: akalsy hermanyu666@gmail.com
 * @Date: 2023-10-09 22:57:19
 * @LastEditors: akalsy hermanyu666@gmail.com
 * @LastEditTime: 2024-07-31 11:12:15
 * @FilePath: /wetalk_server/src/routes/notification.ts
 * @Description: Description
 */
import { AssertionError } from 'assert';
import User from '../../database/mongoose/models/user';
import Notification from '../../database/mongoose/models/notification';

export async function setNotificationToken(ctx: Context<{ token: string }>) {
    const { token } = ctx.data;

    const user = await User.findOne({ _id: ctx.socket.user });
    if (!user) {
        throw new AssertionError({ message: '用户不存在' });
    }

    const notification = await Notification.findOne({ token: ctx.data.token });
    if (notification) {
        notification.user = user;
        await notification.save();
    } else {
        await Notification.create({
            user,
            token,
        });

        const existNotifications = await Notification.find({ user });
        if (existNotifications.length > 3) {
            await Notification.deleteOne({ _id: existNotifications[0]._id });
        }
    }

    return {
        isOK: true,
    };
}
