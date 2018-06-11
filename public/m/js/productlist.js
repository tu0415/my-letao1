$(function(){
    var letao = new Letao();
    letao.initPullRefresh();
});

// 乐淘的构造函数
var Letao = function() {}

Letao.prototype = {
    // 初始化下拉刷新
    initPullRefresh:function() {
        mui.init({
            pullRefresh : {
              container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
              down : {
                // style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
                // color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
                // height:'50px',//可选,默认50px.下拉刷新控件的高度,
                // range:'100px', //可选 默认100px,控件可下拉拖拽的范围
                // offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
                // auto: true,//可选,默认false.首次加载自动上拉刷新一次
                //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback :function () {
                    setTimeout(function () {
                        mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
                    },1500)
                }
              },
              up : {
                  contentnomore : "没有更多了...",
                  callback:function () {
                      setTimeout (function () {
                        mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(true);
                      },1500)
                  }
              }
            }
          });
    },
        //初始化上拉加载更多
    //   initPullUpRefresh:function () {
    //   	mui.init({
    //   pullRefresh : {
    //     container:".mui-scroll-wrapper",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
    //     up:{		    
    //       callback :function () {

    //       } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    //     }
    //   }
    // });
    //   }
}