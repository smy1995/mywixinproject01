// pages/comment/comment.js
//1.初始化数据库
const db = wx.cloud.database({
  env:"web-text-01-yyznx"
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieid:0, //电影id
    detail:{},//保存电影的信息
    value: '', //输入框中用户输入内容
    score: 3, //评分
    images:[],//保存选中的图片
    fileIDs:[] //保存云存储中的fileID
  },
  //输入框对应事件
  onContentChange:function(e) {
    // event.detail 输入框输入的内容
    console.log(e.detail);
  },
  //用户打分对应事件处理函数
  onScoreChange:function(e) {
    //e.detail 用户输入分数
    //将用户输入分数赋值操作
    this.setData({
      score: e.detail
    });
  },
  loadMore:function(){
    //显示提示框
    wx.showLoading({
      title: '加载中.....',
    });
    wx.cloud.callFunction({
      name: "getDetail3",
      data: {
        id: this.data.movieid
      }
    })
    .then(res => {
        var obj = JSON.parse(res.result);
        console.log(obj);
        this.setData({
          detail: obj
        })
        //隐藏提示框
        wx.hideLoading();
      })
      .catch(err => {
        console.log(err);
      })
  },
 
  selectImge:function(){
     //功能：用户选择九张图片并保存data中
    //  1.在data添加数组images
    //  2.调用wx.chooseImage选中图片
    wx.chooseImage({
      count:9,
      sizeType:["original","compressed"],
      sourceType:["album","camera"],
      success: (res)=> {
        console.log(res);
        //  3.将选中9张图片保存images中
        this.setData({
          images: res.tempFilePaths
        })
      },
    })
    
  },
  mySubmit:function(){
    // 功能：将图片上传云存储中
    // 功能：将云存储fileID一次性存储云数据库中
    // 1.在data添加属性fileIDS:[]
    // 2.显示加载动画提示框“正在提交中”
    // wx.showLoading({
    //   title: '正在提交中....',
    // })
    // 3.上传到云存储
    // 3.1：创建promise数组,promiseArr中保存的都是promise对象
    var promiseArr = [];
    // 3.2：创建一个循环遍历选中图片
    for (var i = 0; i < this.data.images.length;i++){
      //promise对象负责完成上传一张图片任务
      //并且将图片fileID保存数组中
      promiseArr.push(new Promise((reslove,reject)=>{
        // 3.3.1：获取当前图片
        var item = this.data.images[i];
        // 3.3.2：创建正则表达式拆分后缀名
        var reg = new RegExp(/\.\w+$/); //创建正则表达式
        var suffix = reg.exec(item)[0]  //exec 拆分，获取后缀
        // 3.3.3: 上传图片并将fileID保存数组
        // 3.3.4: 为图片创建新的文件名
        // 新文件名 = 当前时间（时间戳） + 随机数 + 后缀
        var newFile = new Date().getTime() + Math.floor (Math.random() * 9999) +suffix;
        wx.cloud.uploadFile({
          cloudPath:newFile, //新文件名
          filePath: item, //选中文件
          success:res=>{ //上传成功
           // 3.3.5： 上传成功后拼接fileID
           var fid = res.fileID;
           var ids = this.data.fileIDs.concat(fid);
           this.setData({
             fileIDs:ids
           });
           
           reslove();
          },
          fail:err=>{ //上传失败
            console.log("1234436");
            console.log(err);
          }
        });
        
        
        // 3.3.6： 将当前promise认为追加任务列表中
        // 3.3.7： 上传失败输出错误消息
      }));
    }  
    //4.在云数据库中添加一个集合 comment
    //此集合用于保存评论内容与文件id
    //5.等待数组中所有promise任务执行结束
    // 6.回调函数中
    // 7.将评论内容 分数 电影id 上传图片所有id 
    //   添加集合中
    Promise.all(promiseArr).then(res=>{
      db.collection("comment")
        .add({
          data: {
            content: this.data.value,  //评论内容
            score: this.data.score,  //评论分数
            movieid: this.data.movieid,  //电影id
            fileIds: this.data.fileIDs //图片fileID
          }
        })
        .then(res => {
          // 8.隐藏加载提示框
          wx.hideLoading();
          // 9.显示提示框“发表成功”
          wx.showToast({
            title: '发表成功',
          });
        })
        .catch(err => {
          // 10.添加集合失败
          // 11.隐藏加载提示框
          wx.hideLoading();
          // 12.显示提示框“评论失败”
          wx.showToast({
            title: '发表失败',
          })
        })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieid: options.id
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})