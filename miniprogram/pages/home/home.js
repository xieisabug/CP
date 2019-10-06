// miniprogram/pages/home/home.js
const app = getApp()

Page({

    data: {
        logged: false,
        loadCpInfo: false
    },

    onLoad: function (options) {
        this.getOpenid()
            .then(this.getCpInfo);

        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            console.log(res)
                            this.setData({
                                logged: true,
                                avatarUrl: res.userInfo.avatarUrl,
                                nickName: res.userInfo.nickName,
                                userInfo: res.userInfo
                            })
                        }
                    })
                }
            }
        })
    },

    onGetUserInfo(e) {
        if (!this.data.logged && e.detail.userInfo) {
            this.setData({
                logged: true,
                avatarUrl: e.detail.userInfo.avatarUrl,
                nickName: e.detail.userInfo.nickName,
                userInfo: e.detail.userInfo
            })
        }
    },
    getOpenid: function () {
        return new Promise(function(resolve) {
            // 调用云函数
            wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                    console.log('[云函数] [login] user openid: ', res.result.openid)
                    app.globalData.openid = res.result.openid
                    resolve();
                },
                fail: err => {
                    console.error('[云函数] [login] 调用失败', err)
                    wx.navigateTo({
                        url: '../deployFunctions/deployFunctions',
                    })
                }
            })
        })
    },
    getCpInfo() {
        return new Promise((resolve) => {
            // 调用云函数
            wx.cloud.callFunction({
                name: 'getCpInfo',
                data: {},
                success: res => {
                    console.log('[云函数] [getCpInfo] ', res.result);
                    this.setData({
                        cpInfo: res.result,
                        loadCpInfo: true
                    });
                    resolve();
                },
                fail: err => {
                    console.error('[云函数] [getCpInfo] 调用失败', err)
                }
            })
        })
    },

    getTaskList() {

    },

    handleBindCp() {
        wx.navigateTo({
            url: '/pages/bind-cp/bind-cp',
        })
    },
    handleAdd() {
        wx.navigateTo({
            url: '/pages/add-task/add-task',
        })
    }
})