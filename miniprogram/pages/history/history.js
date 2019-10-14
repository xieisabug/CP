// miniprogram/pages/history/history.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        historyList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getHistoryList();
    },

    getHistoryList() {
        wx.showLoading({
            title: '加载中',
        });
        wx.cloud.callFunction({
            name: 'getHistoryList',
            data: {},
            success: res => {
                console.log('[云函数] [getHistoryList] ', res.result);
                this.setData({
                    historyList: res.result.historyList
                });
                wx.hideLoading();
                wx.stopPullDownRefresh();
            },
            fail: err => {
                console.error('[云函数] [getHistoryList] 调用失败', err)
            }
        })
    },

    onPullDownRefresh() {
        this.getHistoryList();
    }
})