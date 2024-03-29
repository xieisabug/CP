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

    const cpInfo = await db.collection("cpInfo").where(_.or([
        { "user1": wxContext.OPENID },
        { "user2": wxContext.OPENID }
    ])).get();

    if (cpInfo.data.length > 0) {
        let cp = cpInfo.data[0];
        let toOpenId = cp["user1"] == wxContext.OPENID ? cp["user2"] : cp["user1"];

        let addInfo = await db.collection("taskList").add({
            data: {
                fromOpenId: wxContext.OPENID,
                toOpenId,
                name: event.name,
                rewardList: event.rewardList,
                status: 0, // 0 待确认， 1进行中， 2已完成， 3已放弃， 4被取消
                createDate: new Date()
            }
        });

        const mostReward = await db.collection("mostReward").where({
            openId: wxContext.OPENID
        }).get();
        if (mostReward && mostReward.data.length) {
            let rewardList = mostReward.data[0].rewardList;
            if (event.rewardList.length > 3) {
                rewardList = event.rewardList.slice(0, 3);
            } else {
                rewardList = event.rewardList.concat(rewardList.slice(0, 3 - event.rewardList.length));
            }

            await db.collection("mostReward").doc(mostReward.data[0]._id).update({
                data: {
                    rewardList
                }
            });
        } else {
            await db.collection("mostReward").add({
                data: {
                    openId: wxContext.OPENID,
                    rewardList: event.rewardList.slice(0, 3)
                }
            })
        }

        console.log(addInfo);
        return {
            success: true
        }
    } else {
        return {
            success: false,
            message: "您的cp信息有误，请联系管理员"
        }
    }

}