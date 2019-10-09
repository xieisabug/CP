// miniprogram/pages/home/home.js
const app = getApp()

Page({

    data: {
        logged: false,
        loadCpInfo: false,
        taskList: []
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

    onShow() {
        wx.showLoading({
            title: '',
        })
        this.getTaskList()
            .then(() => {
                wx.hideLoading()
            })
    },

    onPullDownRefresh() {
        this.getTaskList()
            .then(() => {
                wx.stopPullDownRefresh()
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
                        cpInfo: res.result.cpInfo,
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
        return new Promise((resolve) => {
            // 调用云函数
            wx.cloud.callFunction({
                name: 'getTaskList',
                data: {},
                success: res => {
                    console.log('[云函数] [getTaskList] ', res.result);
                    this.setData({
                        taskList: res.result.taskList
                    });
                    resolve();
                },
                fail: err => {
                    console.error('[云函数] [getTaskList] 调用失败', err)
                }
            })
        })
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
    },
    handleTaskClick(e) {
        console.log(e);
        const task = e.currentTarget.dataset.task;

        if (task.fromOpenId === app.globalData.openid) {
            if (task.status === 0) {
                wx.showModal({
                    title: '确认',
                    content: '是否删除本任务？',
                    success: (res) => {
                        if (res.confirm) {
                            wx.cloud.callFunction({
                                name: 'updateTask',
                                data: { id: task._id, status: 4 },
                                success: res => {
                                    console.log('[云函数] [updateTask] ', res.result);
                                    this.getTaskList();
                                },
                                fail: err => {
                                    console.error('[云函数] [updateTask] 调用失败', err)
                                }
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            } else if (task.status === 1) {
                wx.showModal({
                    title: '确认',
                    content: '确认本任务已完成？',
                    success: (res) => {
                        if (res.confirm) {
                            wx.cloud.callFunction({
                                name: 'finishTask',
                                data: { id: task._id },
                                success: res => {
                                    console.log('[云函数] [finishTask] ', res.result);
                                    this.getTaskList();
                                },
                                fail: err => {
                                    console.error('[云函数] [finishTask] 调用失败', err)
                                }
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
        } else if (task.toOpenId === app.globalData.openid) {
            if (task.status === 0) {
                wx.showModal({
                    title: '确认',
                    content: '是否接受本任务？',
                    success: (res) => {
                        if (res.confirm) {
                            wx.cloud.callFunction({
                                name: 'updateTask',
                                data: { id: task._id, status: 1 },
                                success: res => {
                                    console.log('[云函数] [updateTask] ', res.result);
                                    this.getTaskList();
                                },
                                fail: err => {
                                    console.error('[云函数] [updateTask] 调用失败', err)
                                }
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            } else if (task.status === 1) {
                wx.showModal({
                    title: '确认',
                    content: '是否放弃本任务？',
                    success: (res) => {
                        if (res.confirm) {
                            wx.cloud.callFunction({
                                name: 'updateTask',
                                data: { id: task._id, status: 3 },
                                success: res => {
                                    console.log('[云函数] [updateTask] ', res.result);
                                    this.getTaskList();
                                },
                                fail: err => {
                                    console.error('[云函数] [updateTask] 调用失败', err)
                                }
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
        }
    },
    handleGoRewardBag() {
        wx.navigateTo({
            url: '/pages/reward-bag/reward-bag'
        })
    }
})