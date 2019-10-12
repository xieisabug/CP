// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const {
        OPENID
    } = wxContext;
    const db = cloud.database();
    const _ = db.command;

    const cpInfo = await db.collection("cpInfo").where(_.or([
        { "user1": wxContext.OPENID },
        { "user2": wxContext.OPENID }
    ])).get();

    if (cpInfo.data.length > 0) {
        return {
            success: false,
            message: "您已经绑定了CP。"
        }
    } else {
        const addInfo = await db.collection("cpInfo").add({
            data: {
                user1: event.user1,
                user2: OPENID,
                createDate: new Date()
            }
        });

        console.log(addInfo);

        return {
            success: true
        }
    }
    
}