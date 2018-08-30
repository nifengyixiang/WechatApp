//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        page: 1,
        currentCid: '',
        currentName: '',
        key: '235f0f3c0b208',
        contentHeight: 0,
        tabWidth: 0,
        scrollLeft: 0,
        currentTab: 0,
        actionSheetList: [],
        categorys: [],
        childCategorys: [],
        menuList: [],
        bottomArrow: '/images/arrow_up.png'
    },

    onLoad: function (res) {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    tabWidth: res.windowWidth,
                    contentHeight: res.windowHeight - res.windowWidth / 750 * 80
                })
            },
        })
        this.getMenuCategorys();
    },

    //菜谱分类标签查询
    getMenuCategorys: function () {
        var that = this;
        wx.request({
            url: 'https://apicloud.mob.com/v1/cook/category/query',
            data: {
                key: this.data.key
            },
            success: function (res) {
                console.log(res.data)
                var actionSheetList = new Array;
                for (var i = 0; i < res.data.result.childs.length; i++) {
                    actionSheetList[i] = res.data.result.childs[i].categoryInfo.name
                }
                that.setData({
                    currentCid: res.data.result.childs[0].childs[0].categoryInfo.ctgId,
                    currentName: res.data.result.childs[0].childs[0].categoryInfo.name,
                    actionSheetList: actionSheetList,
                    categorys: res.data.result.childs,
                    childCategorys: res.data.result.childs[0].childs
                })
                that.getMenuListByCid()
            }
        })
    },

    //点击tab
    swichNav: function (e) {
        var cur = e.currentTarget.id;
        if (this.data.currentTab == cur) {
            return false;
        }
        this.setData({
            currentCid: this.data.childCategorys[e.currentTarget.id].categoryInfo.ctgId,
            currentName: this.data.childCategorys[e.currentTarget.id].categoryInfo.name,
            currentTab: e.currentTarget.id,
            page: 1
        })
        this.getMenuListByCid()
    },

    //根据分类获取菜谱列表
    getMenuListByCid: function () {
        var that = this;
        wx.setNavigationBarTitle({
            title: "炒个菜-" + this.data.currentName,
        })

        wx.request({
            url: 'https://apicloud.mob.com/v1/cook/menu/search',
            data: {
                key: this.data.key,
                cid: this.data.currentCid,
                page: this.data.page,
                size: 20
            },
            success: function (res) {
                if (that.data.page == 1) {
                    that.setData({
                        menuList: res.data.result.list
                    })
                } else {
                    console.log("page",that.data.page)
                    var myList = that.data.menuList;
                    for (var i in res.data.result.list) {
                        myList.push(res.data.result.list[i]);
                    }
                    that.setData({
                        menuList: myList
                    })
                }
            }
        })
    },

    // 滚动切换标签样式
    switchTab: function (e) {
        this.setData({
            currentCid: this.data.childCategorys[e.detail.current].categoryInfo.ctgId,
            currentName: this.data.childCategorys[e.detail.current].categoryInfo.name,
            currentTab: e.detail.current,
            page: 1
        });
        console.log('切换Tab')
        this.checkCor();
        this.getMenuListByCid()
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function () {
        var that = this;
        if (this.data.currentTab > 5) {
            this.setData({
                scrollLeft: that.data.scrollLeft + 120
            })
        } else {
            this.setData({
                scrollLeft: 0
            })
        }
    },

    //切换不同分类
    switchCategory: function () {
        var that = this;
        wx.showActionSheet({
            itemList: this.data.actionSheetList,
            success: function (res) {
                that.setData({
                    currentCid: that.data.childCategorys[0].categoryInfo.ctgId,
                    currentName: that.data.childCategorys[0].categoryInfo.name,
                    currentTab: 0,
                    page: 1,
                    bottomArrow: '/images/arrow_down.png',
                    childCategorys: that.data.categorys[res.tapIndex].childs
                })
                that.getMenuListByCid()
            },
            complete: function () {
                that.setData({
                    bottomArrow: '/images/arrow_up.png',
                })
            }
        })
    },

    //点击事件
    itemClick: function (e) {
        var clickIndex = e.currentTarget.id;
        wx.navigateTo({
            url: '../menuDetail/menuDetail?menuId=' + this.data.menuList[clickIndex].menuId,
        })
    },

    //纵向scroll-view滚动到底部监听
    lower: function (e) {
        this.setData({
            page: this.data.page + 1
        })
        this.getMenuListByCid();
    }
})
