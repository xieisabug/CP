// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const db = cloud.database();
    const _ = db.command;

    const rewardList = await db.collection("rewardList").where({ 
        openId: wxContext.OPENID, status: 0 
    }).get();

    return {
        rewardList: rewardList.data
    }
}