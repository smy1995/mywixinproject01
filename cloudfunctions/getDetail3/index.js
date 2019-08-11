// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require("request-promise");
exports.main = async (event,context)=>{
  var url = `http://api.douban.com/v2/movie/subject/${event.id}?apikey=0df993c66c0c636e29ecbb5344252a4a`;
  return rp(url)
  .then(res=>{
    return (res);
  })
  .catch(err=>{
    return err;
  })
}