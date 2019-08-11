/** 
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
*/
//云函数movelist3
//此函数功能：向豆瓣网发送请求
//获取最新热映电影列表
//1.引入第三方ajax库 request-Promise
var rp = require("request-promise");
//2.创建main函数
exports.main = async(event,context)=>{
  //event:事件对象保存参数
  //context：上下文对象，保存appid,openid...
  //3.创建变量url请求地址
  var url = `http://api.douban.com/v2/movie/in_theaters?`;
  url += `apikey=0df993c66c0c636e29ecbb5344252a4a`;
  url += `&start=${event.start}&count=${event.count}`;
  //4.请求 rp函数发送请求并且将豆瓣返回电影列表返回调用者
  return rp(url)
  .then(res=>{
    return res;
  }).catch(err=>{
    console.log(err);
  })
}
