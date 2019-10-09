// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const db = cloud.database();
    const _ = db.command;
    
    try {
        let taskDoc = db.collection("taskList").doc(event.id);
        
        let updateInfo = await taskDoc.update({
            data: {
                status: 2
            }
        });
        console.log(updateInfo);

        const cpInfo = await db.collection("cpInfo").where(_.or([
            { "user1": wxContext.OPENID },
            { "user2": wxContext.OPENID }
        ])).get();
        const cpObj = cpInfo.data[0];
        let toUser = cpObj["user1"] === wxContext.OPENID ? cpObj["user2"] : cpObj["user1"];

        let taskObj = await taskDoc.get();
        console.log("finish task", taskObj);

        let rewardListCollection = db.collection("rewardList");
        for (let i = 0; i < taskObj.data.rewardList.length; i++) {
            await rewardListCollection.add({
                data: {
                    openId: toUser,
                    name: taskObj.data.rewardList[i],
                    status: 0, // 0未使用， 1已使用
                    createDate: new Date()
                }
            })
        }

        return {
            success: true
        }
    } catch(e) {
        console.error(e);
        return {
            success: false,
            message: "更新失败"
        }
    }
    
    
}