// pages/myphoto/myphoto.js
//初始化数据库
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  //上传图片，并将图片地址保存到云数据库
  myupload:function(){
    wx.chooseImage({
      count: 1,//一次上传一张图片
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        //选中图片地址列表 数组
        var list = res.tempFilePaths
        console.log(list);
        //上传图片值云存储
        // 1.指定上传后新文件名
        // 2.指定选中图片地址
        // 3.上传成功回调函数
        var file = list[0];
        var newfile = new Date().getTime() + "jpg";
        console.log(newfile);
        wx.cloud.uploadFile({
          cloudPath:newfile,
          filePath: file,
          success: res => {
            console.log(res);
            db.collection("myphoto")
            .add({
              data:{
                fileID:res.fileID
              }
            }).then(res=>{
              console.log("图片路径保存成功"); 
        
              
            }).catch(err=>{
              console.log("图片路径保存失败",err);
            });
           
          },
          fail:err=>{
            console.log("图片上传失败",err);
          }
        })
      },
      fail: function(err){
        console.log(err);
      }
    })

  },
  //显示云数据库中的图片
  showImages:function(){
    db.collection("myphoto")
    .get()
    .then(res=>{
      console.log("获取图片路径成功");
      this.setData({
        list: res.data
      });
    }).catch(err=>{
      console.log("获取图片路径失败",err);
    })
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
    console.log("页面监听显示");
    this.showImages();
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