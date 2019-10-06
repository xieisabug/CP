// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const db = cloud.database();
    const _ = db.command;

    let updateInfo = await db.collection("taskList").doc(event.id).update({
        data: {
            status: event.status
        }
    });
    console.log(updateInfo);

    return {
        success: true
    }
}