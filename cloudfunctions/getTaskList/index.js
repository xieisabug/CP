// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const db = cloud.database();
    const _ = db.command;

    const taskList = await db.collection("taskList").where(_.or([
        _.and([{ toOpenId: wxContext.OPENID }, { status: 0 }]),
        _.and([{ toOpenId: wxContext.OPENID }, { status: 1 }]),
        _.and([{ fromOpenId: wxContext.OPENID }, { status: 0 }]),
        _.and([{ fromOpenId: wxContext.OPENID }, { status: 1 }]),
    ])).get();

    return {
        taskList: taskList.data
    }
}