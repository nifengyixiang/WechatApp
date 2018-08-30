// pages/menuDetail/menuDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      key: '235f0f3c0b208',
      img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      wx.request({
          url: 'https://apicloud.mob.com/v1/cook/menu/query',
          data: {
              key: this.data.key,
              id: options.menuId,
              ingredients:[],
              sumary:'',
              methods:[]
          },
          success: function (res) {
              console.log(res.data)
              wx.setNavigationBarTitle({
                  title: res.data.result.name,
              })
              that.setData({
                  img: res.data.result.recipe.img,
                  ingredients: JSON.parse(res.data.result.recipe.ingredients),
                  sumary: res.data.result.recipe.sumary,
                  methods: JSON.parse(res.data.result.recipe.method)
              })
          }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})