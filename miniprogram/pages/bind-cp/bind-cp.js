// miniprogram/pages/bind-cp/bind-cp.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // wx.cloud.callFunction({
        //     name: 'openapi',
        //     data: {
        //         action: "getWXACode"
        //     },
        //     success: res => {
        //         console.log('[云函数] [login] user openid: ')
        //     },
        //     fail: err => {
        //         console.error('[云函数] [login] 调用失败', err)
        //     }
        // })
        const {id, date} = options;

        if (id && date) {
            if ((new Date().getTime() - parseInt(date) < 60000)) {
                wx.cloud.callFunction({
                    name: "bindCp",
                    data: { user1: id },
                    success: res => {
                        console.log('[云函数] [bindCp]: ', res.result);
                        if (res.result.success) { 
                            wx.showModal({
                                title: '恭喜',
                                content: "绑定成功",
                                showCancel: false,
                                success: () => {
                                    wx.reLaunch({
                                        url: '/pages/home/home',
                                    });
                                }
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: res.result.message,
                                showCancel: false
                            })
                        }
                    },
                    fail: err => {
                        console.error(err)
                    }
                })
            } else {
                wx.showModal({
                    title: '超过时间了',
                    content: '只能在一分钟之内点击，请重新分享',
                });
            }
            
        }
    },

    onShareAppMessage: function() {
        return {
            title: '来和我组成cp吧',
            path: '/pages/bind-cp/bind-cp?id=' + getApp().globalData.openid + '&date=' + new Date().getTime()
        }
    }
})