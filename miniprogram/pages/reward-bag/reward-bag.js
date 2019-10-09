// miniprogram/pages/reward-bag/reward-bag.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rewardList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getRewardList();
    },

    getRewardList() {
        wx.showLoading({
            title: '加载中',
        });
        wx.cloud.callFunction({
            name: 'getRewardList',
            data: {},
            success: res => {
                console.log('[云函数] [getRewardList] ', res.result);
                this.setData({
                    rewardList: res.result.rewardList
                });
                wx.hideLoading();
            },
            fail: err => {
                console.error('[云函数] [getRewardList] 调用失败', err)
            }
        })
    },

    handleClickReward(e) {
        let reward = e.currentTarget.dataset.reward;
        console.log(e)

        wx.showModal({
            title: '确认',
            content: '是否要使用' + reward.name + '?',
            success: res => {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: 'useReward',
                        data: { id: reward._id, formId: e.detail.formId },
                        success: res => {
                            console.log('[云函数] [useReward] ', res.result);
                            if (res.result.success) {
                                wx.showModal({
                                    title: '成功',
                                    content: '使用成功，请赶紧告诉对方这个消息吧~',
                                })
                            }
                            this.getRewardList();
                        },
                        fail: err => {
                            wx.showModal({
                                title: '失败',
                                content: '使用奖励失败，如果有疑问，请联系开发者',
                            })
                            console.error('[云函数] [useReward] 调用失败', err)
                        }
                    })
                }
            }
        })
    }
})