// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    i:0,
    movies:[],
    id: 26794435
  },
  loadMore:function(){
   wx.cloud.callFunction({
     name:"movielist3",
     data:{
       start:this.data.movies.length,
       count:10
     }
   }).then(res=>{
     //将res.result字符串转换为json对象
     var obj = JSON.parse(res.result);
     //保存电影列表
     //1.10:保存电影列表数据
     var rows = obj.subjects;
     //1.11:将电影列表数据拼接到数组
     var rows = this.data.movies.concat(rows);
     console.log(obj);
     //1.12：将电影列表数据赋值给movies
     this.setData({
       movies: rows
     });
   }).catch(err=>{
     console.log(err);
   })
  },
  jumpComment:function(e){
    //功能：用户点击详情按钮后跳转详情组件
    //wx.redirectTo关闭并跳转
    // wx.redirectTo({
    //   url: '/pages/comment/comment',
    // })
    //获取电影id并在跳转组件时将id传递给comment组件
    var id = e.target.dataset.id;
    // wx.navigateTo保留并跳转,可以回退
    wx.navigateTo({
      url: '/pages/comment/comment?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMore();
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
    console.log(123);
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})