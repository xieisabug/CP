// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

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
                status: 0, // 0 待确认， 1进行中， 2已完成
                createDate: new Date()
            }
        });

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