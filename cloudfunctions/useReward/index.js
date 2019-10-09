// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const db = cloud.database();
    const _ = db.command;

    let rewardDocument = db.collection("rewardList").doc(event.id);
    let updateInfo = await rewardDocument.update({
        data: {
            status: 1
        }
    });
    // let rewardData = await rewardDocument.get();
    console.log(updateInfo);

    // const cpInfo = await db.collection("cpInfo").where(_.or([
    //     { "user1": wxContext.OPENID },
    //     { "user2": wxContext.OPENID }
    // ])).get();
    // const cpObj = cpInfo.data[0];
    // let toUser = cpObj["user1"] === wxContext.OPENID ? cpObj["user2"] : cpObj["user1"];

    // 发送模板消息
    // const sendResult = await cloud.openapi.templateMessage.send({
    //     touser: toUser,
    //     templateId: "A1JCGzM99GbziKeV0-AiNzPE1H-ApZBSZbHU4VCfkBw",
    //     formId: event.formId,
    //     page: 'pages/home/home',
    //     data: {
    //         keyword1: {
    //             value: rewardData.name,
    //         },
    //         keyword2: {
    //             value: new Date(),
    //         },
    //     }
    // })

    return {
        success: true
    }
}