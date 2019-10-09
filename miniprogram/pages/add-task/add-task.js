// miniprogram/pages/add-task/add-task.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: "",
        rewardList: [""]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    handleInputName(e) {
        this.setData({
            name: e.detail.value
        })
    },

    handleInputReward(e) {
        let rewardList = this.data.rewardList.slice();
        rewardList[+e.currentTarget.dataset.index] = e.detail.value;
        this.setData({
            rewardList
        })
    },

    handleAddReward() {
        let rewardList = this.data.rewardList.slice();
        rewardList.push("");
        this.setData({
            rewardList
        })
    },

    handleConfirmTask() {
        if (this.data.name.length === 0) {
            wx.showModal({
                title: '提示',
                content: '请填写任务名称',
                showCancel: false
            });
            return;
        }

        wx.showLoading({
            title: '',
        });

        wx.cloud.callFunction({
            name: 'addTask',
            data: {
                name: this.data.name,
                rewardList: this.data.rewardList
            },
            success: res => {
                wx.hideLoading();
                console.log('[云函数] [addTask] ', res.result);
                if (res.result.success) {
                    wx.showModal({
                        title: '成功',
                        content: '发送任务成功，等待对方确认',
                        showCancel: false,
                        success: () => {
                            wx.navigateBack({
                                delta: 1,
                            });
                        }
                    })
                }
            },
            fail: err => {
                wx.hideLoading();
                console.error('[云函数] [addTask] 调用失败', err)
            }
        })
    }
})