// pages/mymovie/mymovie.js
//声明数据库
const db = wx.cloud.database({
  env:"web-text-01-yyznx"
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    file:""
  },
  onContentChange:function(e){
    //获取用户输入的留言内容
    this.setData({
      content:e.detail
    });
  },
  myupload:function(){
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        var file = res.tempFilePaths[0];
        //  3.将选中9张图片保存images中
        this.setData({
          file: file
        })
      },
    })
  },
  mysumbit:function(){
   //上传图片并将图片保存云函数
   //1.获取上传图片
   var f = this.data.file;
   //2.截取文件后缀名称
   var reg = new RegExp(/\.\w+$/);
   var suffix = reg.exec(f)[0];
   //3.创建新的文件名
   // 新文件名 = 当前时间（时间戳） + 后缀
   var newFile = new Date().getTime() + suffix;
   //4.上传图片
    wx.cloud.uploadFile({
      cloudPath: newFile, //新文件名
      filePath: f, //选中文件
      success: res => { //上传成功
        var fid = res.fileID;
        db.collection("mymovie")
        .add({
          data:{
            fileID:fid,
            content: this.data.content
            }
        })
        .then(res=>{
          console.log(res);
          wx.showToast({
            title: '发表成功',
          })
        })
        .catch(err=>{
          console.log(err);
          wx.showToast({
            title: '发表失败',
          })
        })
      },
      fail: err => { //上传失败
        console.log(err);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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