// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const db = cloud.database();
    const _ = db.command;

    const taskList = await db.collection("taskList").where(_.or([
        { toOpenId: wxContext.OPENID, status: 0 },
        { toOpenId: wxContext.OPENID, status: 1 },
        { fromOpenId: wxContext.OPENID, status: 0 },
        { fromOpenId: wxContext.OPENID, status: 1 },
    ])).get();

    return {
        taskList: taskList.data
    }
}