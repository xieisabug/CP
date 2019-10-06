// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
    console.log(event)
    switch (event.action) {
        case 'sendTemplateMessage':
            {
                return sendTemplateMessage(event)
            }
        case 'getWXACode':
            {
                return getWXACode(event)
            }
        case 'getOpenData':
            {
                return getOpenData(event)
            }
        default:
            {
                return
            }
    }
}

async function sendTemplateMessage(event) {
    const {
        OPENID
    } = cloud.getWXContext()

    // 接下来将新增模板、发送模板消息、然后删除模板
    // 注意：新增模板然后再删除并不是建议的做法，此处只是为了演示，模板 ID 应在添加后保存起来后续使用
    const addResult = await cloud.openapi.templateMessage.addTemplate({
        id: 'AT0002',
        keywordIdList: [3, 4, 5]
    })

    const templateId = addResult.templateId

    const sendResult = await cloud.openapi.templateMessage.send({
        touser: OPENID,
        templateId,
        formId: event.formId,
        page: 'pages/openapi/openapi',
        data: {
            keyword1: {
                value: '未名咖啡屋',
            },
            keyword2: {
                value: '2019 年 1 月 1 日',
            },
            keyword3: {
                value: '拿铁',
            },
        }
    })

    await cloud.openapi.templateMessage.deleteTemplate({
        templateId,
    })

    return sendResult
}

async function getWXACode(event) {
    const {
        OPENID
    } = cloud.getWXContext();

    const wxacodeResult = await cloud.openapi.wxacode.getUnlimited({
        page: 'pages/bind-cp/bind-cp',
        scene: "id=" + OPENID
    })

    console.log(wxacodeResult);
}

async function getOpenData(event) {
    // 需 wx-server-sdk >= 0.5.0
    return cloud.getOpenData({
        list: event.openData.list,
    })
}