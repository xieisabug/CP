// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const db = cloud.database();

    const mostReward = await db.collection("mostReward").where({
        openId: wxContext.OPENID
    }).get();

    if (mostReward.data.length) {
        return {
            mostReward: mostReward.data[0].rewardList
        }
    } else {
        return {
            mostReward: []
        }
    }
}